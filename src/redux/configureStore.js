/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

let middleware = [thunk];

if (__DEV__) { // eslint-disable-line
	const reduxImmutableStateInvariant = require('redux-immutable-state-invariant')();
	const createLogger = require('redux-logger');

	const logger = createLogger({ collapsed: true });
	middleware = [...middleware, reduxImmutableStateInvariant, logger];
} else {
	middleware = [...middleware];
}

export default function configureStore(initialState) {
	return createStore(
		rootReducer,
		initialState,
		applyMiddleware(...middleware)
	);
}
