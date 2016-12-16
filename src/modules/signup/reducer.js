import { Alert } from 'react-native';
import firebase from 'firebase';

const FORM_CHANGE = 'petspot/signup/FORM_CHANGE';
const SIGNUP_BEGIN = 'petspot/signup/SIGNUP_BEGIN';
const SIGNUP_SUCCESS = 'petspot/signup/SIGNUP_SUCCESS';
const SIGNUP_FAIL = 'petspot/signup/SIGNUP_FAIL';

const initialState = {
	fullName: '',
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
		// case SIGNOUT_SUCCESS:
		// 	return { ...state, ...initialState };
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

export const signupUser = ({ email, password, displayName }) => {
	return (dispatch) => {
		dispatch({ type: SIGNUP_BEGIN });

		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then(() => {
				const { currentUser } = firebase.auth();
				currentUser.updateProfile({
					displayName
				})
				.then(() => {
					dispatch({
						type: SIGNUP_SUCCESS
					});
				})
				.catch(() => {
					Alert.alert('No display name');
				});
			})
			.catch((err) => {
				let errorMessage = '';
				switch (err) { // custom error handling
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

				dispatch({
					type: SIGNUP_FAIL,
					payload: { error: errorMessage }
				});
			});
	};
};
