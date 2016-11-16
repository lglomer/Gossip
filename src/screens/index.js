/* eslint-disable import/prefer-default-export */
import { Navigation } from 'react-native-navigation';

import Login from './Login';
import Feed from './Feed';

export function registerScreens(store, Provider) {
	Navigation.registerComponent('PetSpot.Login', () => Login, store, Provider);
	Navigation.registerComponent('PetSpot.Feed', () => Feed, store, Provider);
}
