import firebase from 'firebase';
import * as rootActions from '../_global/reducer'; //to dispatch login

const FORM_CHANGE = 'petspot/login/FORM_CHANGE';
const LOGIN_SUCCESS = 'petspot/login/LOGIN_SUCCESS';

const initialState = {
	email: '',
	password: '',
};

export default function (state = initialState, action) {
	switch (action.type) {
		case FORM_CHANGE:
			return { ...state, [action.payload.key]: action.payload.value };
		case LOGIN_SUCCESS:
			return { ...initialState };
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

export const login = () => {
	return (dispatch) => {
		dispatch({
			type: LOGIN_SUCCESS
		});
		dispatch(rootActions.login());
	};
};
