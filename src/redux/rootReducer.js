import { combineReducers } from 'redux';
import root from '../modules/_global/reducer';
import chats from '../modules/chats/reducer';
import friends from '../modules/friends/reducer';
import chatroom from '../modules/chatroom/reducer';
import login from '../modules/login/reducer';
import signup from '../modules/signup/reducer';

export default combineReducers({
  root,
  chats,
  chatroom,
  login,
  friends,
  signup
});
