import { Alert } from 'react-native';
import firebase from 'firebase';
import _ from 'lodash';

const FETCH_MESSAGES = 'gossip/chatroom/FETCH_MESSAGES';
const MESSAGE_CHANGE = 'gossip/chatroom/MESSAGE_CHANGE';
const MESSAGE_SEND_START = 'gossip/chatroom/MESSAGE_SEND_START';
const MESSAGE_SEND_FINISH = 'gossip/chatroom/MESSAGE_SEND_FINISH';
const CHAT_INITIALIZED = 'gossip/chatroom/CHAT_INITIALIZED';
const ENTER_EXISTING_CHAT = 'gossip/chatroom/ENTER_EXISTING_CHAT';
const MESSAGE_RECIEVE = 'gossip/chatroom/MESSAGE_RECIEVE';
const GET_TYPING_TEXT = 'gossip/chatroom/GET_TYPING_TEXT';
const CREATE_CHAT_WITH_FRIEND = 'gossip/chatroom/CREATE_CHAT_WITH_FRIEND';

const initialState = {
	text: '',
	messages: [],
	chatId: null,
	loadEarlier: false,
	typingText: null,
	isSending: false,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case MESSAGE_CHANGE:
			return { ...state, text: action.payload.value };
		case MESSAGE_SEND_START:
			return { ...state, text: initialState.text, isSending: true };
		case MESSAGE_SEND_FINISH:
			return { ...state, isSending: false };
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
		case ENTER_EXISTING_CHAT:
			return { ...state, chatId: action.payload.chatId };
		case GET_TYPING_TEXT:
			return { ...state, typingText: action.payload.typingText };
		case CREATE_CHAT_WITH_FRIEND:
			return { ...state, chatId: action.payload.chatId };

		default:
			return state;
	}
}

export const messageChange = ({ value, chatId }) => {
	// if (value === '') {
	// 	firebase.database().ref(``)
	// } else {
	//
	// }

	return {
		type: MESSAGE_CHANGE,
		payload: { value }
	};
};

export const subscribeToMessages = ({ chatId }) => {
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
};

const createChatWithFriend = ({ friend }) => {
	return new Promise((resolve) => {
		const { currentUser } = firebase.auth();
		const chatId = firebase.database().ref('/chatMessages').push().key;

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


		firebase.database().ref().update(chatUpdates).then(() => {
			resolve(chatId);
		});

		firebase.database().ref().onDisconnect().update(offlineUpdates);
	});
};

export const sendMessage = ({ message, chatId, friend }) => {
	return (dispatch) => {
		dispatch({
			type: MESSAGE_SEND_START,
		});

		let key;
		if (chatId) {
			key = chatId;
		} else {
			createChatWithFriend({ friend }).then((id) => {
				key = id;
			});
		}

		// SEND MESSAGE
		const { currentUser } = firebase.auth();
		const messagesRef = firebase.database().ref(`/chatMessages/${key}`);
		messagesRef.push({
			text: message[0].text,
			timestamp: firebase.database.ServerValue.TIMESTAMP,
			sender: {
				id: currentUser.uid,
				displayName: currentUser.displayName
			},
		})
		.then(() => {
			dispatch({
				type: MESSAGE_SEND_FINISH
			});
		});
	};
};

export function initChatWithFriend({ chatFriend }) {
	return (dispatch) => {
		const { currentUser } = firebase.auth();
		const privateChatRef =
			firebase.database().ref(`/userFriends/${currentUser.uid}/${chatFriend.id}/privateChatId`);

		const callback = (snapshot) => {
			if (snapshot.exists()) {
				dispatch({
					type: CHAT_INITIALIZED,
					payload: { chatId: snapshot.val() }
				});
				dispatch(subscribeToMessages({ chatId: snapshot.val() }));
				privateChatRef.off('value', callback);
			}
		};
		privateChatRef.on('value', callback);

		let offlineUpdates = {}; // eslint-disable-line
		offlineUpdates[`/userFriends/${currentUser.uid}/${chatFriend.id}/privateChatId`] = null;
		firebase.database().ref().onDisconnect().update(offlineUpdates);
	};
}

export function enterExistingChat({ chatId }) {
	return (dispatch) => {
		const { currentUser } = firebase.auth();
		const updateObj = {
			[currentUser.uid]: {
				displayName: currentUser.displayName,
				joinedAt: firebase.database.ServerValue.TIMESTAMP
			}
		};

		let offlineUpdates = {}; // eslint-disable-line
		offlineUpdates[`/userCurrentChats/${currentUser.uid}/${chatId}`] = null;

		firebase.database().ref(`/userAvailableChats/${currentUser.uid}/${chatId}`)
		.once('value', (snapshot) => {
			offlineUpdates[`/userAvailableChats/${currentUser.uid}/${chatId}`] = snapshot.val();
		});

		let onlineUpdates = {}; // eslint-disable-line
		onlineUpdates[`/userCurrentChats/${currentUser.uid}/${chatId}/members`] = updateObj;
		onlineUpdates[`/userAvailableChats/${currentUser.uid}/${chatId}`] = null;

		firebase.database().ref().update(onlineUpdates).then(() => {
			dispatch({
				type: ENTER_EXISTING_CHAT,
				payload: { chatId }
			});
		});
		firebase.database().ref().onDisconnect().update(offlineUpdates);
	};
}


export const fetchMessages = ({ chat }) => {
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
};

// export function initChatWithFriend({ chatFriend }) {
//   return (dispatch) => {
//     let onlineUpdates = {};  // eslint-disable-line
//     let offlineUpdates = {};  // eslint-disable-line
//     const { currentUser } = firebase.auth();
//     const firebaseRef = firebase.database().ref();
//     const friendsRef = firebase.database().ref(`userFriends/${currentUser.uid}`);
// 		const chatsRef = firebase.database().ref('chats');
//
//     const setUpdatesByPath = (updatePath) => {
//       // online updates
// 			onlineUpdates[`${updatePath}/members/${currentUser.uid}/joinedAt`] =
// 				firebase.database.ServerValue.TIMESTAMP;
// 			onlineUpdates[`${updatePath}/members/${currentUser.uid}/displayName`] =
// 				currentUser.displayName;
//
// 			onlineUpdates[`${updatePath}/members/${chatFriend.id}/joinedAt`] =
// 				firebase.database.ServerValue.TIMESTAMP;
// 			onlineUpdates[`${updatePath}/members/${chatFriend.id}/displayName`] =
// 				chatFriend.displayName;
//     };
//
// 		// add the chat
// 		const chatId = chatsRef.push().key;
//     setUpdatesByPath(`/userCurrentChats/${currentUser.uid}/${chatId}`);
// 		setUpdatesByPath(`/userCurrentChats/${chatFriend.id}/${chatId}`);
// 		// (offlineUpdates handled in global reducer on logout / disconnect)
//
// 		//let path;
//     // function to update friend's chats
//     const updateFriendsChats = (friendshot) => {
//       friendshot.forEach(friend => { // for each friend
// 				if (friend.id !== chatFriend.id) {
// 					setUpdatesByPath(`/userAvailableChats/${friend.getKey()}/${chatId}`);
// 					// path = `/userCurrentChats/${friend.getKey()}/${chatId}/members/${currentUser.uid}`;
// 					// offlineUpdates[path] = null;
// 				}
//       });
//     };
//
//     // execute updates
//     friendsRef.once('value', updateFriendsChats).then(() => {
//       firebaseRef.update(onlineUpdates).then(() => {
// 				/////dispatch({ type: CHAT_INITIALIZED });
// 			});
//       firebaseRef.onDisconnect().update(offlineUpdates);
//   };
// }

// export function leaveChat(chatId) {
//   return (dispatch) => {
//     let offlineUpdates = {};  // eslint-disable-line
//     const { currentUser } = firebase.auth();
//     const firebaseRef = firebase.database().ref();
//     const friendsRef = firebase.database().ref(`userFriends/${currentUser.uid}`);
//
// 		offlineUpdates[`/users/${currentUser.uid}/currentChat`] = null;
//
// 		let updatePath;
//     // function to update friend's chats
//     const updateFriendsChats = (friendshot) => {
//       friendshot.forEach(friend => { // for each friend
// 				updatePath = `/userOnlineFriends/${friend.getKey()}/${currentUser.uid}/currentChat`;
// 				offlineUpdates[`${updatePath}`] = null;
//
// 				updatePath = `/userAvailableChats/${friend.getKey()}/${chatId}/members/${currentUser.uid}`;
// 				offlineUpdates[`${updatePath}`] = null;
//       });
//     };
//     });
//
//     // execute updates
//     friendsRef.once('value', updateFriendsChats).then(() => {
//       firebaseRef.update(offlineUpdates).then(() => {
// 				dispatch({ type: CHAT_INITIALIZED });
// 			});
//     });
//   };
// }

// export const fetchMessages = ({ chatId }) => {
// 	return (dispatch) => {
// 		dispatch({
// 			type: FETCH_MESSAGES_START
// 		});
//
// 		if (!chatId) { // If no chat id, add one and return
// 			dispatch({
// 				type: FETCH_MESSAGES_EMPTY,
// 			});
// 			return;
// 		}
//
// 		const chatMessagesRef = firebase.database().ref(`/chatMessages/${chatId}`);
// 		chatMessagesRef.orderByKey().limitToFirst(MESSAGES_PER_FETCH).on('value', snapshot => {
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
// 						//image: 'https://facebook.github.io/react/img/logo_og.png',
// 					};
// 				});
//
// 				if (messages.length === MESSAGES_PER_FETCH) {
// 					const keys = Object.keys(messages);
// 					const newLastKey = keys[0];
// 					messages.shift(); // remove first item
//
// 					dispatch({
// 						type: FETCH_MESSAGES_SUCCESS,
// 						payload: { messages, lastMessageKey: newLastKey, loadEarlier: true }
// 					});
// 				} else {
// 					dispatch({
// 						type: FETCH_MESSAGES_SUCCESS,
// 						payload: { messages, loadEarlier: false }
// 					});
// 				}
// 			} else {
// 				dispatch({
// 					type: FETCH_MESSAGES_EMPTY,
// 				});
// 			}
// 		});
// 	};
// };
