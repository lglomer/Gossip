/* eslint-disable  global-require */
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { registerScreens } from './screens';

const store = configureStore();
registerScreens(store, Provider); // register app's screens

const createTabs = () => [ // returns the app's tabs
    {
      screenId: 'PetSpot.Feed',
      title: 'Feed',
    },
    {
      screenId: 'PetSpot.Login',
      title: 'Login',
    },
  ];

Navigation.startSingleScreenApp({
 screen: {
   screen: 'PetSpot.SingleScreen',
   title: 'PetSpot',
   topTabs: createTabs(),
   navigatorStyle: {
     navBarTextColor: '#000000', // color of the title
     navBarButtonColor: '#444444',
     navBarHideOnScroll: false,
   },
 },
 appStyle: {
   tabBarBackgroundColor: '#ffffff',
   tabBarSelectedButtonColor: '#42A5F5',
   statusBarColor: '#009688'
 },
 drawer: {
   left: {
     screen: 'PetSpot.SideMenu'
   }
 }
});
