import firebase from 'firebase';

const FETCH_SUCCESS = 'petspot/feed/FETCH_SUCCESS';

const initialState = {
	isLoading: true,
	isRefreshing: true,
	canLoadMorePosts: true,
	fromUid: undefined, //maybe from 0?
	posts: []
};

export default function (state = initialState, action) {
	let allPosts = {}; // an object with objects
	switch (action.type) {
		case FETCH_SUCCESS:
			if (action.payload.toBottom) {
				allPosts = [...state.posts, ...action.payload.posts];
			} else {
				allPosts = [...action.payload.posts, ...state.posts];
			}

			return { ...state, posts: allPosts };

		default:
			return state;
	}
}

export const fetchPosts = ({ toBottom }) => {
  return (dispatch) => {
		let ref = firebase.database().ref('/posts'); //eslint-disable-line
		let postsArr = []; //eslint-disable-line
    ref.orderByChild('reversedTimestamp').once('value', snapshot => {
			snapshot.forEach((childSnapshot) => {
				postsArr.push(childSnapshot.val());
			});

      dispatch({
				type: FETCH_SUCCESS,
				payload: {
					posts: postsArr,
					toBottom
				}
			});
    });
  };
};
