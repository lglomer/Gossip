import firebase from 'firebase';

const FETCH_CHATS_SUCCESS = 'gossip/chats/FETCH_SUCCESS';
const FETCH_CHATS_EMPTY = 'gossip/chats/FETCH_EMPTY';
const FETCH_CHATS_START = 'gossip/chats/FETCH_START';

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
		const userFriendsChatsRef = firebase.database().ref(`/userFriendsChats/${currentUser.uid}`);

    userFriendsChatsRef.orderByChild('dateCreated').on('value', snapshot => {
			// should it be on value or on child_added / changed (removed)?
			// if the latter how will we know from where to remove the child?
			if (snapshot.exists()) {
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
