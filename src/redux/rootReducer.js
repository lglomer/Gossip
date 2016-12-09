import { combineReducers } from 'redux';
import root from '../modules/_global/reducer';
import chats from '../modules/chats/reducer';
import publish from '../modules/publish/reducer';
import login from '../modules/login/reducer';


export default combineReducers({
  root,
  chats,
  publish,
  login
});
