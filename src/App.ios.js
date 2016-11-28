/* eslint-disable  global-require */
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import firebase from 'firebase';
import configureStore from './redux/configureStore';
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

export default class App {
  constructor() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'PetSpot.Main',
        title: 'PetSpot',
        topTabs: createTabs(),
        navigatorStyle: {
          navBarTextColor: '#000000', // color of the title
          navBarButtonColor: '#444444',
          navBarHideOnScroll: false,
        },
      },
      portraitOnlyMode: true, // full support only on 2.0
      appStyle: {
        tabBarBackgroundColor: '#ffffff',
        tabBarSelectedButtonColor: '#42A5F5',
        statusBarColor: '#009688'
      },
      drawer: {
        left: {
          screen: 'PetSpot.Drawer'
        }
      }
    });

    // since react-redux only works on components, we need to subscribe this class manually
    //store.subscribe(this.onStoreUpdate.bind(this));
    const config = {
      apiKey: 'AIzaSyBck2LzNSsU9zUUnhBbtKJ0tS54QtQ0SsQ',
      authDomain: 'petspot1.firebaseapp.com',
      databaseURL: 'https://petspot1.firebaseio.com',
      storageBucket: 'petspot1.appspot.com',
      messagingSenderId: '282730565872'
    };

    firebase.initializeApp(config);
  }

  // onStoreUpdate() {
  //   const { root } = store.getState().app;
  //   // handle a root change
  //   // if your app doesn't change roots in runtime, you can remove onStoreUpdate() altogether
  //   if (this.currentRoot !== root) {
  //     this.currentRoot = root;
  //     this.startApp(root);
  //   }
  // }

  render() {
    return (
      null
   );
  }
}
