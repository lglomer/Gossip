import { combineReducers } from 'redux';
import root from '../modules/_global/reducer';
import feed from '../modules/feed/reducer';
import publish from '../modules/publish/reducer';
import login from '../modules/login/reducer';


export default combineReducers({
  root,
  feed,
  publish,
  login
});
