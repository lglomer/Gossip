import firebase from 'firebase';
import _ from 'lodash';

const FETCH_FRIENDS_SUCCESS = 'gossip/friends/FETCH_SUCCESS';
const FETCH_FRIENDS_EMPTY = 'gossip/friends/FETCH_EMPTY';
const FETCH_FRIENDS_START = 'gossip/friends/FETCH_START';
const ADD_FRIEND_CHAT = 'gossip/friends/ADD_FRIEND_CHAT';

const initialState = {
	isLoading: true,
	fetchedEmptyList: false,
	canLoadMoreFriends: true,
	friendsList: [],
	contacts: []
};

export default function (state = initialState, action) {
	switch (action.type) {
		case FETCH_FRIENDS_START:
			return { ...state, isLoading: true };
		case FETCH_FRIENDS_SUCCESS:
			return { ...state, friendsList: action.payload.friendsList, isLoading: false };
		case FETCH_FRIENDS_EMPTY:
			return { ...state, fetchedEmptyList: true, isLoading: false, canLoadMoreFriends: false };
		default:
			return state;
	}
}

export const addFriendChat = (friend) => {
  return (dispatch) => {
		dispatch({
			type: ADD_FRIEND_CHAT
		});
	};
};

export const fetchFriendsList = () => {
  return (dispatch) => {
		dispatch({
			type: FETCH_FRIENDS_START
		});

		const { currentUser } = firebase.auth();
		const onlineFriendsRef = firebase.database().ref(`/userOnlineFriends/${currentUser.uid}`);

    onlineFriendsRef.orderByChild('isOnline').on('value', snapshot => {
			// should it be on value or on child_added / removed?
			// if the latter how will we know from where to remove the child?
			if (snapshot.exists()) {
				const friendsList = _.map(snapshot.val(), (val, uid) => {
					return { ...val, id: uid };
				});

				dispatch({
					type: FETCH_FRIENDS_SUCCESS,
					payload: {
						friendsList
					}
				});
			} else {
				dispatch({
					type: FETCH_FRIENDS_EMPTY,
				});
			}
    });
  };
};
