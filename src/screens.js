import { Navigation } from 'react-native-navigation';
import Drawer from './modules/_global/Drawer';
import Chats from './modules/chats/Chats';
import Login from './modules/login/Login';
import Chatroom from './modules/chatroom/Chatroom';

export function registerScreens(store, Provider) {
	Navigation.registerComponent('Gossip.Drawer', () => Drawer, store, Provider);
	Navigation.registerComponent('Gossip.Chats', () => Chats, store, Provider);
	Navigation.registerComponent('Gossip.Login', () => Login, store, Provider);
	Navigation.registerComponent('Gossip.Chatroom', () => Chatroom, store, Provider);
}
