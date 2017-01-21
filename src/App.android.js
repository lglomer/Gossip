/* eslint-disable global-require */
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
};

const navigatorStyle = {
  navBarBackgroundColor: '#e91e63',
  navBarTextColor: '#FFFFFF',
  navBarButtonColor: '#FFFFFF'
};

const portraitOnlyMode = true; // full support only on 2.0

const storage = new Storage({
    storageBackend: AsyncStorage,
    defaultExpires: null
});

const chatsIcon = require('./img/chatsIcon.png'); // eslint-disable-line
const friendsIcon = require('./img/friendsIcon.png'); // eslint-disable-line
const settingsIcon = require('./img/settingsIcon.png'); // eslint-disable-line

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
    store.subscribe(this.onStoreUpdate.bind(this));
  }

  componentDidMount() {
    //FCM.requestPermissions(); // for ios
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

      case 'banned':
        this.startBannedApp();
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

  startBannedApp() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'Gossip.Banned',
        title: 'Banned',
      },
      appStyle,
      portraitOnlyMode,
    });
  }

  startFullApp() {
    Navigation.startTabBasedApp({
      tabs: [
        {
          screen: 'Gossip.Chats',
          label: 'Chats',
          title: 'Chats',
          icon: chatsIcon,
          navigatorStyle
        },
        {
          screen: 'Gossip.Friends',
          label: 'Friends',
          title: 'Friends',
          icon: friendsIcon,
          navigatorStyle
        },
        {
          screen: 'Gossip.Settings',
          label: 'Settings',
          title: 'Settings',
          icon: settingsIcon,
          navigatorStyle
        }
      ],
      portraitOnlyMode,
      appStyle,
      // passProps: {
      //   navigatorStyle
      // }
      animationType: 'none'
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
