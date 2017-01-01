import firebase from 'firebase';
import _ from 'lodash';

const FETCH_ONLINE_FRIENDS_START = 'gossip/chats/FETCH_ONLINE_FRIENDS_START';
const FETCH_ONLINE_FRIENDS_SUCCESS = 'gossip/chats/FETCH_ONLINE_FRIENDS_SUCCESS';
const FETCH_ONLINE_FRIENDS_EMPTY = 'gossip/chats/FETCH_ONLINE_FRIENDS_EMPTY';
const FETCH_AVAILABLE_CHATS_START = 'gossip/chats/FETCH_AVAILABLE_CHATS_START';
const FETCH_AVAILABLE_CHATS_SUCCESS = 'gossip/chats/FETCH_AVAILABLE_CHATS_SUCCESS';
const FETCH_AVAILABLE_CHATS_EMPTY = 'gossip/chats/FETCH_AVAILABLE_CHATS_EMPTY';
const FETCH_CURRENT_CHATS_START = 'gossip/chats/FETCH_CURRENT_CHATS_START';
const FETCH_CURRENT_CHATS_SUCCESS = 'gossip/chats/FETCH_CURRENT_CHATS_SUCCESS';
const FETCH_CURRENT_CHATS_EMPTY = 'gossip/chats/FETCH_CURRENT_CHATS_EMPTY';


const initialState = {
	onlineUsers: [],
	isLoadingOnlineUsers: true,
	onlineUsersEmpty: false,

	availableChats: [],
	isLoadingAvailableChats: true,
	availableChatsEmpty: false,

	currentChats: [],
	isLoadingCurrentChats: true,
	currentChatsEmpty: false,
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

		case FETCH_AVAILABLE_CHATS_START:
			return { ...state, isLoadingAvailableChats: true, availableChatsEmpty: false };
		case FETCH_AVAILABLE_CHATS_SUCCESS:
			return {
				...state,
				availableChats: action.payload.availableChats,
				isLoadingAvailableChats: false,
				availableChatsEmpty: false
			};
		case FETCH_AVAILABLE_CHATS_EMPTY:
			return {
				...state,
				availableChats: [],
				isLoadingAvailableChats: false,
				availableChatsEmpty: true
			};

			case FETCH_CURRENT_CHATS_START:
				return { ...state, isLoadingCurrentChats: true, currentChatsEmpty: false };
			case FETCH_CURRENT_CHATS_SUCCESS:
				return {
					...state,
					currentChats: action.payload.currentChats,
					isLoadingCurrentChats: false,
					currentChatsEmpty: false
				};
			case FETCH_CURRENT_CHATS_EMPTY:
				return {
					...state,
					currentChats: [],
					isLoadingCurrentChats: false,
					currentChatsEmpty: true
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
			// should it be on value or on child_added / removed?
			// if the latter how will we know from where to remove the child?
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

export const fetchAvailableChats = () => {
  return (dispatch) => {
		dispatch({ type: FETCH_AVAILABLE_CHATS_START });
		const { currentUser } = firebase.auth();
		const friendsRef = firebase.database().ref(`/userAvailableChats/${currentUser.uid}`);

    friendsRef.orderByChild('createdAt').on('value', snapshot => {
			// should it be on value or on child_added / removed?
			// if the latter how will we know from where to remove the child?
			if (snapshot.exists()) {
				const availableChats = _.map(snapshot.val(), (val, uid) => {
					return { ...val, id: uid };
				});

				dispatch({
					type: FETCH_AVAILABLE_CHATS_SUCCESS,
					payload: { availableChats }
				});
			} else {
				dispatch({
					type: FETCH_AVAILABLE_CHATS_EMPTY,
				});
			}
    });
  };
};

export const fetchCurrentChats = () => {
  return (dispatch) => {
		dispatch({ type: FETCH_CURRENT_CHATS_START });
		const { currentUser } = firebase.auth();
		const friendsRef = firebase.database().ref(`/userCurrentChats/${currentUser.uid}`);

    friendsRef.orderByChild('createdAt').on('value', snapshot => {
			// should it be on value or on child_added / removed?
			// if the latter how will we know from where to remove the child?
			if (snapshot.exists()) {
				const currentChats = _.map(snapshot.val(), (val, uid) => {
					return { ...val, id: uid };
				});

				dispatch({
					type: FETCH_CURRENT_CHATS_SUCCESS,
					payload: { currentChats }
				});
			} else {
				dispatch({
					type: FETCH_CURRENT_CHATS_EMPTY,
				});
			}
    });
  };
};
