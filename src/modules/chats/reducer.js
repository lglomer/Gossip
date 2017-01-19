import firebase from 'firebase';
import { Alert } from 'react-native';
import _ from 'lodash';

const FETCH_CHATS_START = 'gossip/chats/FETCH_CHATS_START';
const FETCH_CHATS_SUCCESS = 'gossip/chats/FETCH_CHATS_SUCCESS';
const FETCH_CHATS_EMPTY = 'gossip/chats/FETCH_CHATS_EMPTY';


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

		default:
			return state;
	}
}

export const fetchChats = () => {
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

				let chats = _.map(snapshot.val(), (val, uid) => {
					if (!removedArr[uid]) {
						return { ...val, id: uid };
					}
				});

				if (!chats[0]) {
					chats = [];
				}

				console.log(chats);

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
};
