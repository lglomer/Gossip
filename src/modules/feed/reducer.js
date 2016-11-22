import { Alert } from 'react-native';
import firebase from 'firebase';

const FETCH_SUCCESS = 'petspot/feed/FETCH_SUCCESS';

const initialState = {
	isLoading: true,
	isRefreshing: true,
	canLoadMorePosts: true,
	posts: {}
};

export default function (state = initialState, action) {
	let allPosts = {}; // an object with objects
	switch (action.type) {
		case FETCH_SUCCESS:
			if (action.toBottom) {
				allPosts = { ...state.posts, ...action.posts };
			} else {
				allPosts = { ...action.posts, ...state.posts };
			}

			return { ...state, posts: allPosts };

		default:
			return state;
	}
}

export const fetchPosts = (fromId, toBottom) => {
  return (dispatch) => {
    const ref = firebase.database().ref('/posts');
      ref.limitToLast(3).once('value', snapshot => {
        dispatch({ type: FETCH_SUCCESS, posts: snapshot.val(), toBottom });
      }, (err) => {
				Alert.alert("something went wrong.");
			});
  };
};
