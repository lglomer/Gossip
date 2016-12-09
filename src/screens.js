import { Navigation } from 'react-native-navigation';
import Drawer from './modules/_global/Drawer';
import Chats from './modules/chats/Chats';
import Login from './modules/login/Login';
import Publish from './modules/publish/Publish';

export function registerScreens(store, Provider) {
	Navigation.registerComponent('PetSpot.Drawer', () => Drawer, store, Provider);
	Navigation.registerComponent('PetSpot.Chats', () => Chats, store, Provider);
	Navigation.registerComponent('PetSpot.Login', () => Login, store, Provider);
	Navigation.registerComponent('PetSpot.Publish', () => Publish, store, Provider);
}
