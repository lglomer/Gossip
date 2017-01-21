import firebase from 'firebase';

const FORM_CHANGE = 'gossip/signup/FORM_CHANGE';
const SIGNUP_BEGIN = 'gossip/signup/SIGNUP_BEGIN';
const SIGNUP_SUCCESS = 'gossip/signup/SIGNUP_SUCCESS';
const SIGNUP_FAIL = 'gossip/signup/SIGNUP_FAIL';

const initialState = {
	displayName: '',
	email: '',
	password: '',
	loading: false,
	error: '',
};

export default function (state = initialState, action) {
	switch (action.type) {
		case FORM_CHANGE:
			return { ...state, [action.payload.key]: action.payload.value };
		case SIGNUP_BEGIN:
			return { ...state, loading: true, error: '' };
		case SIGNUP_SUCCESS:
			return { ...state, ...initialState };
		case SIGNUP_FAIL:
      return { ...state, error: action.payload.error, password: '', loading: false };
		default:
			return state;
	}
}

export const formChange = ({ key, value }) => {
	return {
		type: FORM_CHANGE,
		payload: { key, value }
	};
};

export const loggedInUser = () => {
	return (dispatch) => {
		dispatch({
			type: SIGNUP_SUCCESS
		});
	};
};


export const signupUser = ({ email, password, displayName }) => {
	return (dispatch) => {
		dispatch({ type: SIGNUP_BEGIN });

		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then(() => {
				const { currentUser } = firebase.auth();
				const userRef = firebase.database().ref(`/users/${currentUser.uid}`);

				currentUser.updateProfile({ displayName }).then(() => {
					userRef.update({
						isBanned: false,
						displayName
					}).then(() => {
						dispatch({ type: SIGNUP_SUCCESS });
					}).catch((err) => {
						dispatch({
							type: SIGNUP_FAIL,
							payload: { error: getError(err) }
						});
					});
				}).catch((err) => {
					dispatch({
						type: SIGNUP_FAIL,
						payload: { error: getError(err) }
					});
				});
			})
			.catch((err) => {
				dispatch({
					type: SIGNUP_FAIL,
					payload: { error: getError(err) }
				});
			});
	};
};

function getError(err) {
	let errorMessage = '';
	switch (err.message) { // custom error handling
		case 'auth/invalid-email':
			errorMessage = 'Email is not valid';
			break;
		case 'auth/email-already-in-use':
			errorMessage = 'Email is already in use';
			break;
		case 'auth/operation-not-allowed':
			errorMessage = 'Registration is currently disabled.';
			break;
		case 'auth/weak-password':
			errorMessage = 'Password is too weak.';
			break;
		default:
			errorMessage = err.message; // use firebase's message
			break;
	}

	return errorMessage;
}
