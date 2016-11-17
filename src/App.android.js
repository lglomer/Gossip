/* eslint-disable  global-require */
import { Navigation } from 'react-native-navigation';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { registerScreens } from './screens';

// redux related book keeping
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

// screen related book keeping
registerScreens(store, Provider); // this is where you register all of your app's screens

const createTabs = () => [ // a function that returns the tabs
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
