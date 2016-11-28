import { combineReducers } from 'redux';
import feed from '../modules/feed/reducer';
import publish from '../modules/publish/reducer';

export default combineReducers({
  feed,
  publish
});
