/* eslint-disable  global-require */
import { Navigation } from 'react-native-navigation';
import { AsyncStorage, Alert } from 'react-native';
import { Provider } from 'react-redux';
import firebase from 'firebase';
import FCM from 'react-native-fcm';
import Storage from 'react-native-storage';
import configureStore from './redux/configureStore';
import { registerScreens } from './screens';
import * as appActions from './modules/_global/reducer';
import * as Sounds from './modules/_global/sounds';

const store = configureStore();
registerScreens(store, Provider); // register app's screens

const appStyle = {
  statusBarColor: '#AD1457',
  //navigationBarColor: '#FFFFFF',
  navBarBackgroundColor: '#FFFFFF',
  navBarTextColor: 'black',
  navBarButtonColor: 'black',
  tabBarButtonColor: '#AD1457',
  tabBarSelectedButtonColor: '#AD1457',
  tabBarBackgroundColor: '#AD1457'
};

const portraitOnlyMode = true; // full support only on 2.0

const storage = new Storage({
    storageBackend: AsyncStorage,
    defaultExpires: null
});

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

      Sounds.prepareSounds();
      /* appActions.logoutUser() is called manually, as we need to be
          authenticated to run the queries within it.
          firebase.auth().signOut() is only called inside of appActions.logoutUser()
       */
    });
    //
    // if (store.getState().root.currentUser) { // previously logged in
    //
    // }
    store.subscribe(this.onStoreUpdate.bind(this));
  }

  componentDidMount() {
    //FCM.requestPermissions(); // for ios
    Alert.alert('componentDidMount');
    FCM.getFCMToken().then(token => {
      Alert.alert('token received');
      console.log('TOKEN (getFCMToken)', token);
      storage.save({
        key: 'FCMToken',   // Note: Do not use underscore("_") in key!
        rawData: {
          token
        },
        expires: null
      });
    });

    FCM.getInitialNotification().then(notif => {
      console.log('INITIAL NOTIFICATION', notif);
    });

    this.notificationUnsubscribe = FCM.on('notification', notif => {
      console.log('Notification', notif);
      if (notif && notif.local) {
        return;
      }
      this.sendRemote(notif);
    });

    this.refreshUnsubscribe = FCM.on('refreshToken', token => {
      console.log('TOKEN (refreshUnsubscribe)', token);
      storage.save({
        key: 'FCMToken',   // Note: Do not use underscore("_") in key!
        rawData: {
          token
        },
        expires: null
      });
    });
  }

  componentWillUnmount() {
      // prevent leaking
      this.refreshUnsubscribe();
      this.notificationUnsubscribe();
  }

  sendRemote(notif) {
    FCM.presentLocalNotification({
      title: notif.title,
      body: notif.body,
      priority: 'high',
      click_action: notif.click_action,
      show_in_foreground: true,
      local: true
    });
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
        screen: 'Gossip.Root',
        title: 'Chats',
        topTabs: this.createTabs(),
        navigatorStyle: {
           navBarBackgroundColor: '#4dbce9',
           navBarTextColor: '#ffff00',
           navBarSubtitleTextColor: '#ff0000',
           navBarButtonColor: '#ffffff',
           statusBarTextColorScheme: 'light',
           tabBarButtonColor: 'red',
           tabBarSelectedButtonColor: 'red',
        }
      },
      portraitOnlyMode,
      appStyle,
      // passProps: {
      //   navigatorStyle
      // }
    });
  }

  createTabs() {
    return [
      {
        screenId: 'Gossip.Chats',
        title: 'Chats',
        label: 'Chats',
      },
      {
        screenId: 'Gossip.Friends',
        title: 'Friends',
        label: 'Friends',
      },
    ];
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
