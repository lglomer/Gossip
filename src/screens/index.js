/* eslint-disable import/prefer-default-export */
import { Navigation } from 'react-native-navigation';

import Login from './Login';
import Feed from './Feed';
import CollapsingTopBarScreen from './CollapsingTopBarScreen';
import SideMenu from './SideMenu';

export function registerScreens(store, Provider) {
	Navigation.registerComponent('PetSpot.Login', () => Login, store, Provider);
	Navigation.registerComponent('PetSpot.Feed', () => Feed, store, Provider);
	Navigation.registerComponent('PetSpot.CollapsingTopBarScreen',
												() => CollapsingTopBarScreen, store, Provider);
	Navigation.registerComponent('PetSpot.SideMenu', () => SideMenu, store, Provider);
}
