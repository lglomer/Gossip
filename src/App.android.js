/* eslint-disable  global-require */
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import firebase from 'firebase';
import configureStore from './redux/configureStore';
import { registerScreens } from './screens';
import * as appActions from './modules/_global/reducer';

const store = configureStore();
registerScreens(store, Provider); // register app's screens

export default class App {
  constructor() {
    const config = {
      apiKey: 'AIzaSyBck2LzNSsU9zUUnhBbtKJ0tS54QtQ0SsQ',
      authDomain: 'petspot1.firebaseapp.com',
      databaseURL: 'https://petspot1.firebaseio.com',
      storageBucket: 'petspot1.appspot.com',
      messagingSenderId: '282730565872'
    };
    firebase.initializeApp(config);
    //this.startApp();
    // since react-redux only works on components, we need to subscribe this class manually
    store.subscribe(this.onStoreUpdate.bind(this));
    store.dispatch(appActions.appInitialized());
  }

  startApp() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'PetSpot.Feed',
        title: 'Feed',
        navigatorStyle: {
          navBarTextColor: '#000000', // color of the title
          navBarButtonColor: '#444444',
        },
      },
      portraitOnlyMode: true, // full support only on 2.0
      appStyle: {
        //tabBarBackgroundColor: '#ffffff',
        //tabBarSelectedButtonColor: '#42A5F5',
        statusBarColor: '#009688'
      },
      drawer: {
        left: {
          screen: 'PetSpot.Drawer'
        }
      }
    });
  }


  onStoreUpdate() {
    const { root } = store.getState();
    console.log(this.currentRoot);

    // handle a root change
    if (this.currentRoot !== root) {
      this.currentRoot = root;
      this.startApp(root);
    }

    console.log(this.currentRoot);
  }

  render() {
    return (
      null
   );
  }
}
