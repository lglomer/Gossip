/* eslint-disable  global-require */
import { Navigation } from 'react-native-navigation';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';
import firebase from 'firebase';
import configureStore from './redux/configureStore';
import { registerScreens } from './screens';
import * as appActions from './modules/_global/reducer';

const store = configureStore();
registerScreens(store, Provider); // register app's screens

const appStyle = {
  statusBarColor: '#AD1457',
};

const navigatorStyle = {
  navBarTextColor: '#ffffff', // color of the title
  navBarButtonColor: '#ffffff',
  navBarBackgroundColor: '#F50057',
};

const portraitOnlyMode = true; // full support only on 2.0

export default class App {
  constructor() {
    const config = {
      apiKey: 'AIzaSyB4cFLAPYHAwXyZFuctpXCHevksy9D1kTI',
      authDomain: 'gossip-c3ea2.firebaseapp.com',
      databaseURL: 'https://gossip-c3ea2.firebaseio.com',
      storageBucket: 'gossip-c3ea2.appspot.com',
      messagingSenderId: '877126629070'
    };
    firebase.initializeApp(config);

    firebase.auth().onAuthStateChanged((user) => {
      if (user) { // login
        store.dispatch(appActions.userLoggedIn(user));
      } else if (!store.getState().root.currentUser) { // if null
        store.dispatch(appActions.appInitialized());
      }

      /* appActions.logoutUser() is called manually, as we need to be
          authenticated to run the queries within it.
          firebase.auth().signOut() is only called inside of appActions.logoutUser()
       */
    });

    // since react-redux only works on components, we need to subscribe this class manually
    store.subscribe(this.onStoreUpdate.bind(this));

    //store.dispatch(appActions.appInitialized());
  }

  startApp({ loginState }) {
    switch (loginState) {
      case 'app':
        this.startFullApp();
        break;

      case 'welcome':
        this.startWelcomeApp();
        break;

      case 'signup-finish':
        this.startFinishSignupApp();
        break;

      default:
        console.error('Unknown app root');
    }
  }

  startWelcomeApp() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'Gossip.Welcome',
        title: 'Welcome',
      },
      appStyle,
      portraitOnlyMode,
    });
  }

  startFinishSignupApp() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'Gossip.SignupFinish',
        title: 'Finish Signup',
      },
      appStyle,
      portraitOnlyMode,
    });
  }

  startFullApp() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'Gossip.Chats',
        title: 'Chats',
        navigatorStyle,
      },
      portraitOnlyMode,
      appStyle,
      passProps: {
        navigatorStyle
      },
      drawer: {
        left: {
          screen: 'Gossip.Drawer',
          passProps: {
            navigatorStyle
          },
        }
      }
    });
  }


  onStoreUpdate() {
    const { root } = store.getState();
    // handle a root change
    if (this.currentRoot !== root) {
      this.currentRoot = root;
      this.startApp(root);
    }
  }

  render() {
    return (
      null
   );
  }
}
