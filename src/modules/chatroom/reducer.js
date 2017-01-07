import { Alert } from 'react-native';
import firebase from 'firebase';
import _ from 'lodash';

const CHAT_INITIALIZED = 'gossip/chatroom/CHAT_INITIALIZED';
const FETCH_MESSAGES = 'gossip/chatroom/FETCH_MESSAGES';
const MESSAGE_CHANGE = 'gossip/chatroom/MESSAGE_CHANGE';
const MESSAGE_SEND = 'gossip/chatroom/MESSAGE_SEND';
const MESSAGE_RECIEVE = 'gossip/chatroom/MESSAGE_RECIEVE';

const initialState = {
	text: '',
	messages: [],
	chatId: null,
	chat: {},
	typingText: null,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case MESSAGE_CHANGE:
			return { ...state, text: action.payload.value };
		case MESSAGE_SEND:
			return { ...state, text: initialState.text };

		case FETCH_MESSAGES:
			return {
				...state,
				messages: [...state.messages, ...action.payload.messages],
			};
		case MESSAGE_RECIEVE:
			return {
				...state,
				isTyping: false,
				messages: [action.payload.message, ...state.messages]
			};

		case CHAT_INITIALIZED:
			return { ...state, chat: action.payload.chat, chatId: action.payload.chatId };

		default:
			return state;
	}
}

export function messageChange({ value }) {
	Alert.alert(value);
	return {
		type: MESSAGE_CHANGE,
		payload: { value }
	};
}

export function subscribeToMessages({ chatId }) {
	return (dispatch) => {
		console.log('subscribeToMessages');
		const chatMessagesRef = firebase.database().ref(`/chatMessages/${chatId}`);
		// listen to messages
    chatMessagesRef.orderByKey().on('child_added', snapshot => {
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

				dispatch({
					type: MESSAGE_RECIEVE,
					payload: { message }
				});
			}
    });
	};
}

function createChatWithFriend({ chatId, friend }) {
	return new Promise((resolve) => {
		console.log('createChatWithFriend');
		const { currentUser } = firebase.auth();

		let chatUpdates = {}; // eslint-disable-line
		let offlineUpdates = {}; // eslint-disable-line
		const chatObj = {
			members: {
				[friend.id]: {
					displayName: friend.displayName,
					joinedAt: firebase.database.ServerValue.TIMESTAMP
				},
				[currentUser.uid]: {
					displayName: currentUser.displayName,
					joinedAt: firebase.database.ServerValue.TIMESTAMP
				}
			},
			isMember: true
		};

		chatUpdates[`/chats/${chatId}`] = chatObj;

		chatUpdates[`/userChats/${friend.id}/${chatId}`] = chatObj;
		chatUpdates[`/userChats/${currentUser.uid}/${chatId}`] = chatObj;

		chatUpdates[`/userFriends/${currentUser.uid}/${friend.id}/privateChatId`] = chatId;
		chatUpdates[`/userFriends/${friend.id}/${currentUser.uid}/privateChatId`] = chatId;

		offlineUpdates[`/userChats/${friend.id}/${chatId}/members/${currentUser.uid}`] = null;
		offlineUpdates[`/userChats/${currentUser.uid}/${chatId}/members/${currentUser.uid}`] = null;
		offlineUpdates[`/userChats/${currentUser.uid}/${chatId}/isMember`] = null;

		offlineUpdates[`/userFriends/${currentUser.uid}/${friend.id}/privateChatId`] = null;
		offlineUpdates[`/userFriends/${friend.id}/${currentUser.uid}/privateChatId`] = null;


		firebase.database().ref().onDisconnect().update(offlineUpdates);
		firebase.database().ref().update(chatUpdates).then(() => {
			resolve({ chat: chatObj, chatId });
		});
	});
}

export function sendMessage({ message, chatId, friend }) {
	return (dispatch) => {
		dispatch({
			type: MESSAGE_SEND,
			payload: { message }
		});

		const send = (key) => {
			const { currentUser } = firebase.auth();
			//const updates = {};

			//updates[`/chats/${key}/`] =

			const messagesRef = firebase.database().ref(`/chatMessages/${key}`);
			messagesRef.push({
				text: message[0].text,
				timestamp: firebase.database.ServerValue.TIMESTAMP,
				sender: {
					id: currentUser.uid,
					displayName: currentUser.displayName
				},
				seenBy: {
					[currentUser.uid]: true
				}
			});
		};

		let key;
		if (chatId) {
			key = chatId;
			send(key);
		} else {
			key = firebase.database().ref('/chatMessages').push().key;
			send(key);

			createChatWithFriend({ chatId: key, friend }).then((result) => {
				dispatch(chatInitialized(result.chat, result.chatId));
			});
		}
	};
}

export function listenFriendForChat({ chatFriend }) {
	return (dispatch) => {
		console.log('listenFriendForChat');
		const { currentUser } = firebase.auth();
		const privateChatRef =
			firebase.database().ref(`/userFriends/${chatFriend.id}/${currentUser.uid}/privateChatId`);

		const callback = (snapshot) => {
			if (snapshot.exists()) {
				firebase.database().ref(`/chats/${snapshot.val()}`).once('value', chatshot => {
					dispatch(chatInitialized(chatshot.val(), snapshot.val()));
				});

				privateChatRef.off('value', callback);
			}
		};
		privateChatRef.on('value', callback);
		privateChatRef.once('value', callback);

		let offlineUpdates = {}; // eslint-disable-line
		offlineUpdates[`/userFriends/${currentUser.uid}/${chatFriend.id}/privateChatId`] = null;
		//offlineUpdates[`/userFriends/${chatFriend.id}/${currentUser.uid}/privateChatId`] = null;

		firebase.database().ref().onDisconnect().update(offlineUpdates);
	};
}

export function enterExistingChat({ chat }) {
	return (dispatch) => {
		console.log('enterExistingChat');
		const { currentUser } = firebase.auth();
		const firebaseRef = firebase.database().ref();
		const friendsRef = firebase.database().ref(`/userFriends/${currentUser.uid}`);
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

		offlineUpdates[`/userChats/${currentUser.uid}/${chat.id}/members/${currentUser.uid}`] = null;
		offlineUpdates[`/userChats/${currentUser.uid}/${chat.id}/isMember`] = null;

    // prepare friends updates
    const updateFriends = (friendshot) => {
      friendshot.forEach(friend => { // for each friend update chats
				path = `/userChats/${friend.getKey()}/${chat.id}/members/${currentUser.uid}`;
				onlineUpdates[path] = updateObj;
        offlineUpdates[path] = null;
      });
    };

		friendsRef.once('value', updateFriends).then(() => {
			firebase.database().ref().update(onlineUpdates).then(() => {
				dispatch(chatInitialized(chat, chat.id));
			});
			firebaseRef.onDisconnect().update(offlineUpdates);
		});
	};
}

export function fetchMessages({ chat }) {
	return (dispatch) => {
		console.log('fetchMessages');
		const { currentUser } = firebase.auth();
		const chatMessagesRef = firebase.database().ref(`/chatMessages/${chat.id}`);

		chatMessagesRef.orderByChild('timestamp').startAt(chat.members[currentUser.uid].joinedAt)
		.limitToLast(50).once('value', (snapshot) => {
			if (snapshot.exists()) {
				const messages = _.map(snapshot.val(), (val, uid) => {
					return {
						_id: uid,
						text: val.text,
						createdAt: val.timestamp,
						user: {
							_id: val.sender.id,
							name: val.sender.displayName,
							avatar: 'https://facebook.github.io/react/img/logo_og.png',
						},
						seenBy: val.seenBy
					};
				});

				dispatch({
					type: FETCH_MESSAGES,
					payload: { messages }
				});
			}
		});
	};
}

export function chatInitialized(chat, chatId) {
	return {
		type: CHAT_INITIALIZED,
		payload: { chat, chatId }
	};
}
