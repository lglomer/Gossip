import firebase from 'firebase';

const POST_CHANGE = 'petspot/publish/POST_CHANGE';
const POST_PUBLISH_SUCCESS = 'petspot/publish/POST_PUBLISH_SUCCESS';

const initialState = {
	content: ''
};

export default function (state = initialState, action) {
	switch (action.type) {
		case POST_CHANGE:
			return { ...state, [action.payload.key]: action.payload.value };
		case POST_PUBLISH_SUCCESS:
			return initialState;

		default:
			return state;
	}
}

export const postChange = ({ key, value }) => {
	return {
		type: POST_CHANGE,
		payload: { key, value }
	};
};

export const postPublish = ({ content }) => {
	return (dispatch) => {
		const ref = firebase.database().ref('/posts');
		const timestamp = new Date().getTime();
		ref.push({ content, timestamp, reversedTimestamp: 0 - timestamp })
			.then(() => {
				dispatch({
					type: POST_PUBLISH_SUCCESS,
				});
			});
	};
};
