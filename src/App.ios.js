/* eslint-disable  global-require */
//import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { registerScreens } from './screens';

registerScreens(); // this is where you register all of your app's screens

const createTabs = () => [ // a function that returns the tabs
    {
      label: 'Feed',
      screen: 'PetSpot.Feed',
      icon: require('./img/one@1x.android.png'),
      selectedIcon: require('./img/one_selected@2x.png'),
      title: 'Feed',
    }
  ];

Navigation.startTabBasedApp({
 tabs: createTabs(),
 appStyle: {
   tabBarBackgroundColor: '#ffffff',
   tabBarButtonColor: '#444444',
   tabBarSelectedButtonColor: '#42A5F5',
   statusBarColor: '#999999'
 },
 drawer: {
   left: {
     screen: 'PetSpot.SideMenu'
   }
 }
});
