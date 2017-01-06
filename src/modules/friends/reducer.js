import firebase from 'firebase';
import _ from 'lodash';

const FETCH_ONLINE_FRIENDS_START = 'gossip/friends/FETCH_ONLINE_FRIENDS_START';
const FETCH_ONLINE_FRIENDS_SUCCESS = 'gossip/friends/FETCH_ONLINE_FRIENDS_SUCCESS';
const FETCH_ONLINE_FRIENDS_EMPTY = 'gossip/friends/FETCH_ONLINE_FRIENDS_EMPTY';

const initialState = {
	onlineUsers: [],
	isLoadingOnlineUsers: true,
	onlineUsersEmpty: false,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case FETCH_ONLINE_FRIENDS_START:
			return { ...state, isLoadingOnlineUsers: true, onlineUsersEmpty: false };
		case FETCH_ONLINE_FRIENDS_SUCCESS:
			return {
				...state,
				onlineUsers: action.payload.onlineUsers,
				isLoadingOnlineUsers: false,
				onlineUsersEmpty: false
			};
		case FETCH_ONLINE_FRIENDS_EMPTY:
			return {
				...state,
				onlineUsers: [],
				isLoadingOnlineUsers: false,
				onlineUsersEmpty: true
			};

		default:
			return state;
	}
}

export const fetchOnlineFriends = () => {
  return (dispatch) => {
	dispatch({ type: FETCH_ONLINE_FRIENDS_START });
	const { currentUser } = firebase.auth();
	const friendsRef = firebase.database().ref(`/userFriends/${currentUser.uid}`);

    friendsRef.orderByChild('isOnline').equalTo(true).on('value', snapshot => {
		if (snapshot.exists()) {
			const onlineUsers = _.map(snapshot.val(), (val, uid) => {
				return { ...val, id: uid };
			});

			dispatch({
				type: FETCH_ONLINE_FRIENDS_SUCCESS,
				payload: { onlineUsers }
			});
		} else {
			dispatch({
				type: FETCH_ONLINE_FRIENDS_EMPTY,
			});
		}
    });
  };
};
