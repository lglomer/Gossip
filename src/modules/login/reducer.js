import firebase from 'firebase';

const FORM_CHANGE = 'gossip/login/FORM_CHANGE';
const LOGIN_BEGIN = 'gossip/login/LOGIN_BEGIN';
const LOGIN_SUCCESS = 'gossip/login/LOGIN_SUCCESS';
const LOGIN_FAIL = 'gossip/login/LOGIN_FAIL';
// const SIGNOUT_SUCCESS = 'gossip/login/SIGNOUT_SUCCESS';

const initialState = {
	email: '',
	password: '',
	loading: false,
	error: '',
};

export default function (state = initialState, action) {
	switch (action.type) {
		case FORM_CHANGE:
			return { ...state, [action.payload.key]: action.payload.value };
		case LOGIN_BEGIN:
			return { ...state, loading: true, error: '' };
		case LOGIN_SUCCESS:
			return { ...state, ...initialState };
		case LOGIN_FAIL:
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

// export const signoutUser = () => {
// 	return (dispatch) => {
// 		firebase.auth().signOut().then(() => {
// 			dispatch({
// 				type: SIGNOUT_SUCCESS
// 			});
// 		});
// 	};
// };

export const loginUser = ({ email, password }) => {
	return (dispatch) => {
		dispatch({ type: LOGIN_BEGIN });

		firebase.auth().signInWithEmailAndPassword(email, password)
			.then(() => {
				dispatch({
					type: LOGIN_SUCCESS
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
					type: LOGIN_FAIL,
					payload: { error: errorMessage }
				});
			});
	};
};
