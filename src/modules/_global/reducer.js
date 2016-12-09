import { NetInfo, Alert } from 'react-native';
import firebase from 'firebase';

const LOGIN_STATE_CHANGED = 'petspot/root/LOGIN_STATE_CHANGED';

const initialState = {
  loginState: null, // 'login' / 'after-login'
};

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_STATE_CHANGED:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function appInitialized() {
  return function (dispatch) {
    // code before login screen (app) initialization
    dispatch(changeAppRoot('login'));
  };
}

export function loginUser() {
  return (dispatch) => {
    // logged in app logic would go here, and when it's done, we switch app roots
    // runs on app start if previously logged in
    const connectedRef = firebase.database().ref('.info/connected');
    connectedRef.on('value', (snap) => { // on device connect event change
      if (snap.val() === true) {
        const { currentUser } = firebase.auth();
        const userRef = firebase.database().ref(`/users/${currentUser.uid}`);

        userRef.child('isOnline').set(true);
        userRef.onDisconnect().update({
          isOnline: false,
          lastOnline: firebase.database.ServerValue.TIMESTAMP
        });
      }
    });
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log('First, is ', (isConnected ? 'online' : 'offline'));
    });
    NetInfo.addEventListener('change', (connectionInfo) => {
      Alert.alert('change: ', connectionInfo);
    });

    dispatch(changeAppRoot('after-login'));
  };
}

export function changeAppRoot(loginState) {
  return {
    type: LOGIN_STATE_CHANGED,
    payload: { loginState },
  };
}
