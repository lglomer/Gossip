import firebase from 'firebase';
import _ from 'lodash';

const MESSAGES_PER_FETCH = 15;

const MESSAGE_CHANGE = 'gossip/chatroom/MESSAGE_CHANGE';
const MESSAGE_SEND_START = 'gossip/chatroom/MESSAGE_SEND_START';
const MESSAGE_SEND_FINISH = 'gossip/chatroom/MESSAGE_SEND_FINISH';
const CHAT_INITIALIZED = 'gossip/chatroom/CHAT_INITIALIZED';
const FETCH_MESSAGES_SUCCESS = 'gossip/chatroom/FETCH_MESSAGES_SUCCESS';
const FETCH_MESSAGES_EMPTY = 'gossip/chatroom/FETCH_MESSAGES_EMPTY';
const MESSAGE_RECIEVE = 'gossip/chatroom/MESSAGE_RECIEVE';

const initialState = {
	text: '',
	messages: [],
	lastMessageKey: null,
	chatId: null,
	loadEarlier: false,
	typingText: null,
	isLoadingEarlier: false,
	isSending: false,
	isTyping: false,
	isChatReady: false
};

export default function (state = initialState, action) {
	switch (action.type) {
		case MESSAGE_CHANGE:
			return { ...state, [action.payload.key]: action.payload.value };
		case MESSAGE_SEND_START:
			return { ...state, text: initialState.text, isSending: true };
		case MESSAGE_SEND_FINISH:
			return { ...state, chatId: action.payload.chatId, isSending: false };
		case FETCH_MESSAGES_SUCCESS:
			return {
				...state,
				messages: [...state.messages, ...action.payload.messages],
				lastMessageKey: action.payload.lastMessageKey
			};
		case FETCH_MESSAGES_EMPTY:
			return { ...state, loadEarlier: false };
		case MESSAGE_RECIEVE:
			return {
				...state,
				isTyping: false,
				messages: [action.payload.message, ...state.messages]
			};
		case CHAT_INITIALIZED:
			return { ...state, isChatReady: true };

		default:
			return state;
	}
}

export const messageChange = ({ key, value }) => {
	return {
		type: MESSAGE_CHANGE,
		payload: { key, value }
	};
};

export const subscribeToMessages = ({ chatId }) => {
	return (dispatch) => {
		const chatMessagesRef = firebase.database().ref(`/chatMessages/${chatId}`);

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

export const sendMessage = ({ message, chatId }) => {
	const { currentUser } = firebase.auth();

	return (dispatch) => {
		dispatch({
			type: MESSAGE_SEND_START,
		});

		let key;
		if (chatId) {
			key = chatId;
		} else {
			key = firebase.database().ref('/chatMessages').push().key;
			dispatch(subscribeToMessages({ chatId: key }));
		}

		const postsRef = firebase.database().ref(`/chatMessages/${key}`);
		postsRef.push({
			text: message[0].text,
			timestamp: firebase.database.ServerValue.TIMESTAMP,
			sender: {
				id: currentUser.uid,
				displayName: currentUser.displayName
			},
		})
		.then(() => {
			dispatch({
				type: MESSAGE_SEND_FINISH,
				payload: { chatId: key }
			});
		});
	};
};

export function enterExistingChat(chatId) {
  return (dispatch) => {
    let val;
    let onlineUpdates = {};  // eslint-disable-line
    let offlineUpdates = {};  // eslint-disable-line
    const { currentUser } = firebase.auth();
    const firebaseRef = firebase.database().ref();
    const friendsRef = firebase.database().ref(`userFriends/${currentUser.uid}`);
		const userRef = firebase.database().ref(`users/${currentUser.uid}`);
		const chatsRef = firebase.database().ref('chats');

		//fetch chat from chats/, if doesn't exist create with fan out. if exists just add me as a member with fanout

    const setUpdatesByPath = (updatePath) => {
      // online updates
			onlineUpdates[`${updatePath}/joinedAt`] = firebase.database.ServerValue.TIMESTAMP;

      // offline updates
      offlineUpdates[`${updatePath}`] = null;
    };

		// Check if signup is finished. If not open signupFinish screen.
    setUpdatesByPath(`/users/${currentUser.uid}/currentChat`);

		let updatePath;
    // function to update friend's chats
    const updateFriendsChats = (friendshot) => {
      friendshot.forEach(friend => { // for each friend
				updatePath = `/userOnlineFriends/${friend.getKey()}/${currentUser.uid}/currentChat`;
        setUpdatesByPath(updatePath);
				onlineUpdates[`${updatePath}/id`] = chatId;

				updatePath = `/userFriendsChats/${friend.getKey()}/${chatId}/members/${currentUser.uid}`;
				setUpdatesByPath(updatePath);
      });
    };

    // execute updates
    friendsRef.once('value', updateFriendsChats).then(() => {
      firebaseRef.update(onlineUpdates).then(() => {
				dispatch({ type: CHAT_INITIALIZED });
			});
      firebaseRef.onDisconnect().update(offlineUpdates);
    });
  };
}

export function initChatWithFriend(chatFriend) {
  return (dispatch) => {
    let onlineUpdates = {};  // eslint-disable-line
    let offlineUpdates = {};  // eslint-disable-line
    const { currentUser } = firebase.auth();
    const firebaseRef = firebase.database().ref();
    const friendsRef = firebase.database().ref(`userFriends/${currentUser.uid}`);
		const chatsRef = firebase.database().ref('chats');

    const setUpdatesByPath = (updatePath) => {
      // online updates
      onlineUpdates[`${updatePath}/id`] = chatId;
			onlineUpdates[`${updatePath}/joinedAt`] = firebase.database.ServerValue.TIMESTAMP;
			onlineUpdates[`${updatePath}/displayName`] = currentUser.displayName;

      // offline updates
      offlineUpdates[`${updatePath}`] = null;
    };

		const chatId = chatsRef.push().key;
    setUpdatesByPath(`/users/${currentUser.uid}/currentChat`);
		setUpdatesByPath(`/users/${chatFriend.id}/currentChat`);
		setUpdatesByPath(`/chats/${chatId}/members/${currentUser.uid}`);

    // function to update friend's chats
    const updateFriendsChats = (friendshot) => {
      friendshot.forEach(friend => { // for each friend
        setUpdatesByPath(`/userOnlineFriends/${friend.getKey()}/${currentUser.uid}/currentChat`);
        setUpdatesByPath(`/userFriendsChats/${friend.getKey()}/${chatId}/members/${currentUser.uid}`); //eslint-disable-line
      });
    };

    // execute updates
    friendsRef.once('value', updateFriendsChats).then(() => {
      firebaseRef.update(onlineUpdates).then(() => {
				dispatch({ type: CHAT_INITIALIZED });
			});
      firebaseRef.onDisconnect().update(offlineUpdates);
    });
  };
}

export function leaveChat(chatId) {
  return (dispatch) => {
    let offlineUpdates = {};  // eslint-disable-line
    const { currentUser } = firebase.auth();
    const firebaseRef = firebase.database().ref();
    const friendsRef = firebase.database().ref(`userFriends/${currentUser.uid}`);

		offlineUpdates[`/users/${currentUser.uid}/currentChat`] = null;

		let updatePath;
    // function to update friend's chats
    const updateFriendsChats = (friendshot) => {
      friendshot.forEach(friend => { // for each friend
				updatePath = `/userOnlineFriends/${friend.getKey()}/${currentUser.uid}/currentChat`;
				offlineUpdates[`${updatePath}`] = null;

				updatePath = `/userFriendsChats/${friend.getKey()}/${chatId}/members/${currentUser.uid}`;
				offlineUpdates[`${updatePath}`] = null;
      });
    };

    // execute updates
    friendsRef.once('value', updateFriendsChats).then(() => {
      firebaseRef.update(offlineUpdates).then(() => {
				dispatch({ type: CHAT_INITIALIZED });
			});
    });
  };
}

// export const fetchEarlierMessages = ({ chatId, lastMessageKey }) => {
// 	return (dispatch) => {
// 		dispatch({
// 			type: FETCH_EARLIER_MESSAGES_START
// 		});
//
// 		const chatMessagesRef = firebase.database().ref(`/chatMessages/${chatId}`);
//
// 		if (lastMessageKey) {
// 			chatMessagesRef.orderByKey().startAt(lastMessageKey).limitToFirst(MESSAGES_PER_FETCH)
// 			.on('value', (snapshot) => {
// 				if (snapshot.exists()) {
// 					const messages = _.map(snapshot.val(), (val, uid) => {
// 						return {
// 							_id: uid,
// 							text: val.text,
// 							createdAt: val.timestamp,
// 							user: {
// 								_id: val.sender.id,
// 								name: val.sender.displayName,
// 								avatar: 'https://facebook.github.io/react/img/logo_og.png',
// 							},
// 							//image: 'https://facebook.github.io/react/img/logo_og.png',
// 						};
// 					});
//
// 					if (messages.length === MESSAGES_PER_FETCH) {
// 						const keys = Object.keys(messages);
// 						const newLastKey = keys[0];
// 						console.log(lastMessageKey);
// 						messages.shift(); // remove first item
//
// 						dispatch({
// 							type: FETCH_EARLIER_MESSAGES_SUCCESS,
// 							payload: { messages, lastMessageKey: newLastKey, loadEarlier: true }
// 						});
// 					} else {
// 						dispatch({
// 							type: FETCH_EARLIER_MESSAGES_SUCCESS,
// 							payload: { messages, loadEarlier: false }
// 						});
// 					}
// 				} else {
// 					dispatch({
// 						type: FETCH_EARLIER_MESSAGES_EMPTY,
// 					});
// 				}
// 			});
// 		}
// 	};
// };


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
