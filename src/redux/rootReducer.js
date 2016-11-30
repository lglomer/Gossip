import { combineReducers } from 'redux';
import root from '../modules/_global/reducer';
import feed from '../modules/feed/reducer';
import publish from '../modules/publish/reducer';

export default combineReducers({
  feed,
  publish,
  root
});
