/* eslint-disable import/prefer-default-export */
import { Navigation } from 'react-native-navigation';
import SingleScreen from './SingleScreen';
import SideMenu from './SideMenu';
import Feed from './Feed';
import Login from './Login';

export function registerScreens(store, Provider) {
	Navigation.registerComponent('PetSpot.Login', () => Login, store, Provider);
	Navigation.registerComponent('PetSpot.Feed', () => Feed, store, Provider);
	Navigation.registerComponent('PetSpot.SideMenu', () => SideMenu, store, Provider);
	Navigation.registerComponent('PetSpot.SingleScreen', () => SingleScreen, store, Provider);
}
