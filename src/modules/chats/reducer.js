import firebase from 'firebase';
import { Alert } from 'react-native';
import _ from 'lodash';
import chatService from '../../services/chatService';

const FETCH_CHATS_START = 'gossip/chats/FETCH_CHATS_START';
const FETCH_CHATS_SUCCESS = 'gossip/chats/FETCH_CHATS_SUCCESS';
const FETCH_CHATS_EMPTY = 'gossip/chats/FETCH_CHATS_EMPTY';
const MESSAGE_RECIEVE = 'gossip/chats/MESSAGE_RECEIVE';

const initialState = {
	chats: [],
	isLoadingChats: true,
	chatsEmpty: false,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case FETCH_CHATS_START:
			return { ...state, isLoadingChats: true, chatsEmpty: false };
		case FETCH_CHATS_SUCCESS:
			return {
				...state,
				chats: action.payload.chats,
				isLoadingChats: false,
				chatsEmpty: false
			};
		case FETCH_CHATS_EMPTY:
			return {
				...state,
				chats: [],
				isLoadingChats: false,
				chatsEmpty: true
			};

		case MESSAGE_RECIEVE:
			return {
				...state,
				chats: {
					...state.chats,
					[action.payload.chatId]: {
						...state.chats[action.payload.chatId],
						unreadNum: action.payload.unreadNum
					}
				}
			};

		default:
			return state;
	}
}

export function fetchChats() {
  return (dispatch) => {
		dispatch({ type: FETCH_CHATS_START });
		const { currentUser } = firebase.auth();
		const chatsRef = firebase.database().ref(`/userChats/${currentUser.uid}`);

    chatsRef.orderByChild('isMember').on('value', snapshot => {
			if (snapshot.exists()) {
				// remove chats with a single member
				const removedArr = [];
				snapshot.forEach(chat => {
					let count = 0;
					_.map(chat.val().members, () => { //(val, uid) => {}
						count++;
					});
					if (count <= 1) {
						firebase.database().ref(`/userChats/${currentUser.uid}/${chat.getKey()}`).remove();
						removedArr[chat.getKey()] = true;
					}
				});

				const chats = [];
				_.map(snapshot.val(), (val, uid) => {
					if (!removedArr[uid]) {
						chats[uid] = { ...val, id: uid };
						chatService.on('message_added', (messageshot) => {
							// firebase.database().ref(`/userChats/${currentUser.uid}/${uid}/unreadNum`)
							// 	.set(chats[uid].unreadNum + 1);
							dispatch({
								type: MESSAGE_RECIEVE,
								payload: { chatId: uid, unreadNum: chats[uid].unreadNum + 1 }
							});
						});
					}
				});

				dispatch({
					type: FETCH_CHATS_SUCCESS,
					payload: { chats }
				});
			} else {
				dispatch({
					type: FETCH_CHATS_EMPTY,
				});
			}
		});
	};
}
