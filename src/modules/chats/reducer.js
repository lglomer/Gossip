import firebase from 'firebase';

const FETCH_SUCCESS = 'petspot/chats/FETCH_SUCCESS';
const FETCH_EMPTY = 'petspot/chats/FETCH_EMPTY';
const FETCH_START = 'petspot/chats/FETCH_START';

const initialState = {
	isLoading: true,
	isRefreshing: true,
	fetchedEmptyList: false,
	canLoadMoreChats: true,
	fromUid: undefined, //maybe from 0?
	chats: []
};

export default function (state = initialState, action) {
	switch (action.type) {
		case FETCH_START:
			return { ...state };
		case FETCH_SUCCESS:
			return { ...state, chats: action.payload.chats };
		case FETCH_EMPTY:
			return { ...state, fetchedEmptyList: true };
		default:
			return state;
	}
}

export const fetchChatList = () => {
  return (dispatch) => {
		dispatch({
			type: FETCH_START
		});

		const { currentUser } = firebase.auth();
		const ref = firebase.database().ref(`/userAvailableChats/${currentUser.uid}`);
		let chatsArr = []; //eslint-disable-line

    ref.once('value', snapshot => {
			if (snapshot.exists()) {
				snapshot.forEach((childSnapshot) => {
					chatsArr.push(childSnapshot.val());
				});

				dispatch({
					type: FETCH_SUCCESS,
					payload: {
						chats: chatsArr,
					}
				});
			} else {
				dispatch({
					type: FETCH_EMPTY,
				});
			}
    });
  };
};
