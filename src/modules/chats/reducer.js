import firebase from 'firebase';

const FETCH_SUCCESS = 'petspot/chats/FETCH_SUCCESS';
const FETCH_EMPTY = 'petspot/chats/FETCH_EMPTY';
const FETCH_START = 'petspot/chats/FETCH_START';

const initialState = {
	isLoading: true,
	fetchedEmptyList: false,
	canLoadMoreChats: true,
	chats: []
};

export default function (state = initialState, action) {
	switch (action.type) {
		case FETCH_START:
			return { ...state, isLoading: true };
		case FETCH_SUCCESS:
			return { ...state, chats: action.payload.chats, isLoading: false };
		case FETCH_EMPTY:
			return { ...state, fetchedEmptyList: true, isLoading: false, canLoadMoreChats: false };
		default:
			return state;
	}
}

const fetchUser = (userKey, callback) => {
	firebase.database().ref(`/users/${userKey}`) // fetch friend's meta info
		.orderByChild('isOnline')
		.on('value', snapshot => callback(snapshot));
};

export const fetchChatList = () => {
  return (dispatch) => {
		dispatch({
			type: FETCH_START
		});

		let chatsArr = []; //eslint-disable-line
		let friendKey;
		let currentRoom;

		const { currentUser } = firebase.auth();
		const friendsChatsRef = firebase.database().ref(`/userFriendsChats/${currentUser.uid}`);

    friendsChatsRef.orderByChild('isOnline').on('value', snapshot => {
			// should it be on value or on child_added / removed?
			// if the latter how will we know from where to remove the child?
			if (snapshot.exists()) {
				console.log(snapshot.val());
				dispatch({
					type: FETCH_SUCCESS,
					payload: {
						chats: snapshot.val(),
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
