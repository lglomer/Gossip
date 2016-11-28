import { Navigation } from 'react-native-navigation';
import Main from './modules/_global/Main';
import Drawer from './modules/_global/Drawer';
import Feed from './modules/feed/Feed';
import Login from './modules/login/Login';
import Publish from './modules/publish/Publish';

export function registerScreens(store, Provider) {
	Navigation.registerComponent('PetSpot.Main', () => Main, store, Provider);
	Navigation.registerComponent('PetSpot.Drawer', () => Drawer, store, Provider);
	Navigation.registerComponent('PetSpot.Feed', () => Feed, store, Provider);
	Navigation.registerComponent('PetSpot.Login', () => Login, store, Provider);
	Navigation.registerComponent('PetSpot.Publish', () => Publish, store, Provider);
}
