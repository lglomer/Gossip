import firebase from 'firebase';
import { Alert } from 'react-native';
import _ from 'lodash';
import chatService from '../../services/chatService';
import Sounds from '../../services/soundService';

const CHAT_INITIALIZED = 'gossip/chatroom/CHAT_INITIALIZED';
const FETCH_MESSAGES = 'gossip/chatroom/FETCH_MESSAGES';
const MESSAGE_CHANGE = 'gossip/chatroom/MESSAGE_CHANGE';
const MESSAGE_SEND = 'gossip/chatroom/MESSAGE_SEND';
const MESSAGE_RECIEVE = 'gossip/chatroom/MESSAGE_RECIEVE';
const MESSAGE_EDITED = 'gossip/chatroom/MESSAGE_EDITED';
const TYPING_RECEIVE = 'gossip/chatroom/TYPING_RECEIVE';

const initialState = {
	text: '',
	messages: [],
	chatId: null,
	chat: {},
	typingText: null,
};

export default function (state = initialState, action) {
	let messages;
	switch (action.type) {
		case MESSAGE_CHANGE:
			return { ...state, text: action.payload.value };
		case MESSAGE_SEND:
			return {
				...state,
				text: initialState.text,
				messages: [action.payload.message, ...state.messages],
				isTyping: false
			};

		case FETCH_MESSAGES:
			return {
				...state,
				messages: [...state.messages, ...action.payload.messages],
			};
		case MESSAGE_RECIEVE:
			return {
				...state,
				messages: [action.payload.message, ...state.messages]
			};

		case MESSAGE_EDITED:
			messages = [...state.messages];
			messages[action.payload.messageIndex] = action.payload.message;
			return {
				...state,
				messages
			};

		case TYPING_RECEIVE:
			return {
				...state,
				typingText: action.payload.typingText,
			};

		case CHAT_INITIALIZED:
			return { ...state, chat: action.payload.chat, chatId: action.payload.chatId };

		default:
			return state;
	}
}

// Push typing state to chat members && dispatch new message value
export function messageChange({ newVal, oldVal, chatId }) {
	return (dispatch) => {
		dispatch({
			type: MESSAGE_CHANGE,
			payload: { value: newVal }
		});

		if (newVal.length > 0 && oldVal.length === 0) { // typing
			chatService.setCurrentUserTyping({ isTyping: true, chatId });
		}

		if (newVal.length === 0) { // not typing
			chatService.setCurrentUserTyping({ isTyping: false, chatId });
		}
	};
}

export function subscribeToAll({ chatId }) {
	return (dispatch) => {
		chatService.init(chatId);
		dispatch(subscribeToMessages());
		dispatch(subscribeToTyping());
	};
}

// Listen and dispatch new messages
export function subscribeToMessages() {
	return (dispatch) => {
		const callback = snapshot => {
			const { currentUser } = firebase.auth();
			if (snapshot.exists()) {
				const val = snapshot.val();
				const message = {
					_id: snapshot.getKey(),
					text: val.text,
					createdAt: val.timestamp,
					user: {
						_id: val.sender.id,
						name: val.sender.displayName,
						avatar: 'https://facebook.github.io/react/img/logo_og.png',
					},
					//image: 'https://facebook.github.io/react/img/logo_og.png',
				};

				if (val.sender.id === currentUser.uid) {
					Alert.alert(val.text);
					Sounds.playSound('message_send.wav'); // sent
					dispatch({
						type: MESSAGE_EDITED,
						payload: { message: { ...message, isSent: true }, messageIndex: 0 }
					});
				} else {
					dispatch({
						type: MESSAGE_RECIEVE,
						payload: { message }
					});
				}
			}
    };

		// listen to messages
		chatService.on('message_added', callback);
	};
}

// Change typing text on other member type
export function subscribeToTyping() {
	return (dispatch) => {
		// listen to typing
    chatService.on('typing_changed', snapshot => {
			dispatch({
				type: TYPING_RECEIVE,
				payload: { typingText: chatService.getTypingText(snapshot) }
			});
    });
	};
}

export function sendMessage({ message, chatId, friend }) {
	return (dispatch) => {
		const send = (chatKey, messageKey) => {
			chatService.sendMessage({ chatId: chatKey, message, messageKey });
			dispatch(messageChange({ //to stop typing
				newVal: '',
				oldVal: message,
				chatId: chatKey
			}));
		};

		const dispatchSend = (chatKey) => { // Dispatch MESSAGE_SEND
			const messageKey = firebase.database().ref(`/chatMessages/${chatKey}`).push().key;
			dispatch({
				type: MESSAGE_SEND,
				payload: { message: { ...message[0], _id: messageKey, isSent: false } }
			});

			return messageKey;
		};

		if (chatId) {
			const messageKey = dispatchSend(chatId);
			send(chatId, messageKey);
		} else {
			const chatKey = firebase.database().ref('/chatMessages').push().key;
			const messageKey = dispatchSend(chatKey);

			chatService.createChatWithFriend({ chatId: chatKey, friend }).then((result) => {
				dispatch(chatInitialized(result.chat, result.chatId)); //must be first
				send(chatKey, messageKey);
			});
		}
	};
}

export function listenFriendForChat({ chatFriend }) {
	return (dispatch) => {
		chatService.on('friend_started_chat', chatshot => {
			dispatch(chatInitialized(chatshot.val(), chatshot.getKey()));
		});
		chatService.listenFriendForChat(chatFriend);
	};
}

export function enterExistingChat({ chat }) {
	return (dispatch) => {
		console.log('enterExistingChat');
		const { currentUser } = firebase.auth();
		const firebaseRef = firebase.database().ref();
		const friendsRef = firebase.database().ref(`/userFriends/${currentUser.uid}`);
		const membersRef = firebase.database().ref(`/chats/${chat.id}/members`);
		const updateObj = {
			displayName: currentUser.displayName,
			joinedAt: firebase.database.ServerValue.TIMESTAMP
		};

		let path;
		let onlineUpdates = {}; // eslint-disable-line
		let offlineUpdates = {}; // eslint-disable-line

		onlineUpdates[`/userChats/${currentUser.uid}/${chat.id}/members/${currentUser.uid}`]
			= updateObj;
		onlineUpdates[`/userChats/${currentUser.uid}/${chat.id}/isMember`] = true;
		onlineUpdates[`/userChats/${currentUser.uid}/${chat.id}/unseenNum`] = 0;

		offlineUpdates[`/userChats/${currentUser.uid}/${chat.id}/members/${currentUser.uid}`] = null;
		offlineUpdates[`/userChats/${currentUser.uid}/${chat.id}/isMember`] = null;
		offlineUpdates[`/userChats/${currentUser.uid}/${chat.id}/unseenNum`] = null;

    // prepare friends updates
    const updateUsers = (friendshot) => {
      friendshot.forEach(friend => { // for each friend update chats
				path = `/userChats/${friend.getKey()}/${chat.id}/members/${currentUser.uid}`;
				onlineUpdates[path] = updateObj;
        offlineUpdates[path] = null;
      });
    };

		friendsRef.once('value', updateUsers).then(() => {
			membersRef.once('value', updateUsers).then(() => {
				firebase.database().ref().update(onlineUpdates).then(() => {
					dispatch(chatInitialized(chat, chat.id));
				});
				firebaseRef.onDisconnect().update(offlineUpdates);
			});
		});
	};
}


// export function fetchMessages({ chat }) {
// 	return (dispatch) => {
// 		console.log('fetchMessages');
// 		const { currentUser } = firebase.auth();
// 		const chatMessagesRef = firebase.database().ref(`/chatMessages/${chat.id}`);
//
// 		chatMessagesRef.orderByChild('timestamp').startAt(chat.members[currentUser.uid].joinedAt)
// 		.limitToLast(50).once('value', (snapshot) => {
// 			if (snapshot.exists()) {
// 				const messages = _.map(snapshot.val(), (val, uid) => {
// 					return {
// 						_id: uid,
// 						text: val.text,
// 						createdAt: val.timestamp,
// 						user: {
// 							_id: val.sender.id,
// 							name: val.sender.displayName,
// 							avatar: 'https://facebook.github.io/react/img/logo_og.png',
// 						},
// 						seenBy: val.seenBy
// 					};
// 				});
//
// 				dispatch({
// 					type: FETCH_MESSAGES,
// 					payload: { messages }
// 				});
// 			}
// 		});
// 	};
// }

export function chatInitialized(chat, chatId) {
	return {
		type: CHAT_INITIALIZED,
		payload: { chat, chatId }
	};
}
