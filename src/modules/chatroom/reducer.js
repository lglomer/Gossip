import firebase from 'firebase';
import { Alert } from 'react-native';
import chatService from '../../services/chatService';
import Sounds from '../../services/soundService';

const CHAT_INITIALIZED = 'gossip/chatroom/CHAT_INITIALIZED';
const FETCH_MESSAGES = 'gossip/chatroom/FETCH_MESSAGES';
const MESSAGE_CHANGE = 'gossip/chatroom/MESSAGE_CHANGE';
const MESSAGE_SEND = 'gossip/chatroom/MESSAGE_SEND';
const MESSAGE_SEND_SUCCESS = 'gossip/chatroom/MESSAGE_SEND_SUCCESS';
const MESSAGE_RECIEVE = 'gossip/chatroom/MESSAGE_RECIEVE';
const TYPING_RECEIVE = 'gossip/chatroom/TYPING_RECEIVE';
const MEMBERS_CHANGED = 'gossip/chatroom/MEMBERS_CHANGED';
const FRIEND_ONLINE_CHANGE = 'gossip/chatroom/FRIEND_ONLINE_CHANGE';

const initialState = {
	text: '',
	messages: {},
	chatId: null,
	chat: {},
	typingText: null,
	isFriendOnline: null,
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
				messages: { [action.payload.message._id]: action.payload.message, ...state.messages }
			};

		case MESSAGE_SEND_SUCCESS:
			messages = { ...state.messages };
			messages[action.payload.messageKey] = action.payload.message;
			return {
				...state,
				messages
			};

		case FETCH_MESSAGES:
			return {
				...state,
				messages: { ...state.messages, ...action.payload.messages },
			};
		case MESSAGE_RECIEVE:
			return {
				...state,
				messages: { [action.payload.message._id]: action.payload.message, ...state.messages }
			};

		case TYPING_RECEIVE:
			return {
				...state,
				typingText: action.payload.typingText,
			};

		case MEMBERS_CHANGED:
			return {
				...state,
				chat: { ...state.chat, members: action.payload.members },
			};

		case CHAT_INITIALIZED:
			return { ...state, chat: action.payload.chat, chatId: action.payload.chatId };

		case FRIEND_ONLINE_CHANGE:
			return {
				...state,
				isFriendOnline: action.payload.isFriendOnline,
			};

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

		if (chatId) {
			if (newVal.length > 0 && oldVal.length === 0) { // typing
				chatService.setCurrentUserTyping({ isTyping: true, chatId });
			}

			if (newVal.length === 0) { // not typing
				chatService.setCurrentUserTyping({ isTyping: false, chatId });
			}
		}
	};
}

export function subscribeToAll({ chatId }) {
	return (dispatch) => {
		chatService.init(chatId);
		dispatch(subscribeToMessages());
		dispatch(subscribeToTyping());
		dispatch(subscribeToMembers());
	};
}

// Listen and dispatch new messages
export function subscribeToMessages() {
	return (dispatch) => {
		const callback = snapshot => {
			if (snapshot.exists()) {
				const val = snapshot.val();
				const message = {
					_id: snapshot.getKey(),
					text: val.text,
					createdAt: val.createdAt,
					user: {
						_id: val.user._id,
						name: val.user.name,
						avatar: 'https://facebook.github.io/react/img/logo_og.png',
					},
					//image: 'https://facebook.github.io/react/img/logo_og.png',
				};

				let isSent;
				if (firebase.auth().currentUser.uid === val.user._id) {
					isSent = false;
				}

				dispatch({
					type: MESSAGE_RECIEVE,
					payload: { message: { ...message, isSent } }
				});
			}
    };

		// listen to messages
		chatService.on('message_added', callback);
	};
}

export function subscribeToMembers() {
	return (dispatch) => {
		const callback = snapshot => {
			if (snapshot.exists()) {
				dispatch({
					type: MEMBERS_CHANGED,
					payload: { members: snapshot.val() }
				});
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
		const callback = snapshot => {
			dispatch({
				type: TYPING_RECEIVE,
				payload: { typingText: chatService.getTypingText(snapshot) }
			});
    };
		chatService.once('typing_changed', callback);
    chatService.on('typing_changed', callback);
	};
}

export function sendMessage({ message, chatId, friend }) {
	return (dispatch) => {
		const send = (chatKey, messageKey) => {
			dispatch(messageChange({ //to stop typing
				newVal: '',
				oldVal: message,
				chatId: chatKey,
			}));
			chatService.sendMessage({ chatId: chatKey, message, messageKey }).then((sentId) => {
				Sounds.playSound('message_send.wav'); // sent
				dispatch({
					type: MESSAGE_SEND_SUCCESS,
					payload: { message: { ...message[0], isSent: true }, messageKey: sentId }
				});
			});
		};

		if (chatId) {
			const messageKey = firebase.database().ref(`/chatMessages/${chatId}`).push().key;
			send(chatId, messageKey);
		} else { // friend
			const chatKey = firebase.database().ref('/chatMessages').push().key;
			const messageKey = firebase.database().ref(`/chatMessages/${chatKey}`).push().key;

			chatService.createChatWithFriend({ chatId: chatKey, friend }).then((result) => {
				dispatch(chatInitialized(result.chat, result.chatId)); //must be first
				send(chatKey, messageKey);
			});
		}
	};
}

export function listenToInvitationByFriend(friendId) {
	return (dispatch) => {
		const callback = (chatshot) => {
			const chatId = chatshot.getKey();
			if (chatId === friendId) {
				const chat = chatService.getChatById(chatId);
				chatService.enterExistingChat(chatId).then(() => {
					dispatch(chatInitialized(chat, chatId));
				});
			}
		};

		chatService.on('invitation_received', callback);
	};
}

export function enterExistingChat({ chat }) {
	return (dispatch) => {
		chatService.enterExistingChat(chat.id).then(() => {
			dispatch(chatInitialized(chat, chat.id));
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
