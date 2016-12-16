import firebase from 'firebase';

const FETCH_CHATS_SUCCESS = 'petspot/chats/FETCH_SUCCESS';
const FETCH_CHATS_EMPTY = 'petspot/chats/FETCH_EMPTY';
const FETCH_CHATS_START = 'petspot/chats/FETCH_START';

const initialState = {
	isLoading: true,
	fetchedEmptyList: false,
	canLoadMoreChats: true,
	chats: [],
	contacts: []
};

export default function (state = initialState, action) {
	switch (action.type) {
		case FETCH_CHATS_START:
			return { ...state, isLoading: true };
		case FETCH_CHATS_SUCCESS:
			return { ...state, chats: action.payload.chats, isLoading: false };
		case FETCH_CHATS_EMPTY:
			return { ...state, fetchedEmptyList: true, isLoading: false, canLoadMoreChats: false };
		default:
			return state;
	}
}

export const fetchChatList = () => {
  return (dispatch) => {
		dispatch({
			type: FETCH_CHATS_START
		});

		let chatsArr = []; //eslint-disable-line

		const { currentUser } = firebase.auth();
		const friendsChatsRef = firebase.database().ref(`/userFriendsChats/${currentUser.uid}`);

    friendsChatsRef.orderByChild('isOnline').on('value', snapshot => {
			// should it be on value or on child_added / removed?
			// if the latter how will we know from where to remove the child?
			if (snapshot.exists()) {
				console.log(snapshot.val());
				dispatch({
					type: FETCH_CHATS_SUCCESS,
					payload: {
						chats: snapshot.val(),
					}
				});
			} else {
				dispatch({
					type: FETCH_CHATS_EMPTY,
				});
			}
    });
  };
};
