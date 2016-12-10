import { combineReducers } from 'redux';
import root from '../modules/_global/reducer';
import chats from '../modules/chats/reducer';
import chatroom from '../modules/chatroom/reducer';
import login from '../modules/login/reducer';


export default combineReducers({
  root,
  chats,
  chatroom,
  login
});
