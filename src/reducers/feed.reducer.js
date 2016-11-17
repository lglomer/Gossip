import RETRIEVE_POPULAR_MOVIES_SUCCESSS from '../constants/actionTypes';
import initialState from '../store/initialState';

export default function (state = initialState.feed, action) {
	switch (action.type) {

		case RETRIEVE_POPULAR_MOVIES_SUCCESSS:
			return {
				...state,
			posts: action.popularMovies
			};
		default:
			return state;
	}
}
