import { Alert } from 'react-native';
import firebase from 'firebase';
import _ from 'lodash';

const FETCH_MESSAGES = 'gossip/chatroom/FETCH_MESSAGES';
const MESSAGE_CHANGE = 'gossip/chatroom/MESSAGE_CHANGE';
const MESSAGE_SEND = 'gossip/chatroom/MESSAGE_SEND';
const CHAT_INITIALIZED = 'gossip/chatroom/CHAT_INITIALIZED';
const MESSAGE_RECIEVE = 'gossip/chatroom/MESSAGE_RECIEVE';

const initialState = {
	text: '',
	messages: [],
	chatId: null,
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
			return { ...state, chatId: action.payload.chatId };

		default:
			return state;
	}
}

export function messageChange({ value }) {
	return {
		type: MESSAGE_CHANGE,
		payload: { value }
	};
}

export function subscribeToMessages({ chatId }) {
	return (dispatch) => {
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
		const { currentUser } = firebase.auth();

		let chatUpdates = {}; // eslint-disable-line
		let offlineUpdates = {}; // eslint-disable-line
		const updateObj = {
			members: {
				[friend.id]: {
					displayName: friend.displayName,
					joinedAt: firebase.database.ServerValue.TIMESTAMP
				},
				[currentUser.uid]: {
					displayName: currentUser.displayName,
					joinedAt: firebase.database.ServerValue.TIMESTAMP
				}
			}
		};

		chatUpdates[`/userCurrentChats/${friend.id}/${chatId}`] = updateObj;
		chatUpdates[`/userCurrentChats/${currentUser.uid}/${chatId}`] = updateObj;
		chatUpdates[`/userAvailableChats/${currentUser.uid}/${chatId}`] = null;
		chatUpdates[`/userAvailableChats/${friend.id}/${chatId}`] = null;

		chatUpdates[`/userFriends/${currentUser.uid}/${friend.id}/privateChatId`] = chatId;
		chatUpdates[`/userFriends/${friend.id}/${currentUser.uid}/privateChatId`] = chatId;

		offlineUpdates[`/userFriends/${currentUser.uid}/${friend.id}/privateChatId`] = null;
		offlineUpdates[`/userFriends/${friend.id}/${currentUser.uid}/privateChatId`] = null;


		firebase.database().ref().onDisconnect().update(offlineUpdates);
		firebase.database().ref().update(chatUpdates).then(() => {
			resolve(chatId);
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
			const messagesRef = firebase.database().ref(`/chatMessages/${key}`);
			messagesRef.push({
				text: message[0].text,
				timestamp: firebase.database.ServerValue.TIMESTAMP,
				sender: {
					id: currentUser.uid,
					displayName: currentUser.displayName
				},
			});
		};

		let key;
		if (chatId) {
			key = chatId;
			send(key);
		} else {
			key = firebase.database().ref('/chatMessages').push().key;
			send(key);

			createChatWithFriend({ chatId: key, friend }).then(() => {
				dispatch({
					type: CHAT_INITIALIZED,
					payload: { chatId: key }
				});
			});
		}
	};
}

export function listenFriendForChat({ chatFriend }) {
	return (dispatch) => {
		const { currentUser } = firebase.auth();
		const privateChatRef =
			firebase.database().ref(`/userFriends/${chatFriend.id}/${currentUser.uid}/privateChatId`);

		const callback = (snapshot) => {
			if (snapshot.exists()) {
				dispatch({
					type: CHAT_INITIALIZED,
					payload: { chatId: snapshot.val() }
				});

				privateChatRef.off('value', callback);
			}
		};
		privateChatRef.on('value', callback);

		let offlineUpdates = {}; // eslint-disable-line
		offlineUpdates[`/userFriends/${currentUser.uid}/${chatFriend.id}/privateChatId`] = null;
		//offlineUpdates[`/userFriends/${chatFriend.id}/${currentUser.uid}/privateChatId`] = null;

		firebase.database().ref().onDisconnect().update(offlineUpdates);
	};
}

export function enterExistingChat({ chatId }) {
	return (dispatch) => {
		const { currentUser } = firebase.auth();
		const firebaseRef = firebase.database().ref();
		const currentChatsRef =
			firebase.database().ref(`/userCurrentChats/${currentUser.uid}/${chatId}`);
		const updateObj = {
			[currentUser.uid]: {
				displayName: currentUser.displayName,
				joinedAt: firebase.database.ServerValue.TIMESTAMP
			}
		};

		let onlineUpdates = {}; // eslint-disable-line
		onlineUpdates[`/userCurrentChats/${currentUser.uid}/${chatId}/members/${currentUser.uid}`]
			= updateObj;
		onlineUpdates[`/userAvailableChats/${currentUser.uid}/${chatId}`] = null;

		firebase.database().ref().update(onlineUpdates).then(() => {
			dispatch({
				type: CHAT_INITIALIZED,
				payload: { chatId }
			});
		});

		let offlineUpdates = {}; // eslint-disable-line
		offlineUpdates[`/userCurrentChats/${currentUser.uid}/${chatId}`] = null;

		//`/userAvailableChats/${currentUser.uid}/${chatId}`
		firebaseRef.onDisconnect().update(offlineUpdates);
	};
}

export function fetchMessages({ chat }) {
	return (dispatch) => {
		const { currentUser } = firebase.auth();
		const chatMessagesRef = firebase.database().ref(`/chatMessages/${chat.id}`);

		chatMessagesRef.orderByChild('timestamp').startAt(chat.members[currentUser.uid].joinedAt)
		.limitToLast(50).on('value', (snapshot) => {
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
