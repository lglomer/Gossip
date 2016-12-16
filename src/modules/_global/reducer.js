import { Alert } from 'react-native';
import firebase from 'firebase';

const LOGIN_STATE_CHANGED = 'petspot/root/LOGIN_STATE_CHANGED';

const initialState = {
  loginState: null, // 'login' / 'after-login'
  currentUser: null, // important to keep null for logoutUser's if statement
};

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_STATE_CHANGED:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function logoutUser() {
  return function (dispatch) {
    const { currentUser } = firebase.auth();

    if (currentUser) {
      let path;
      let updates = {}; // eslint-disable-line
      updates[`/users/${currentUser.uid}/isOnline`] = false;
      updates[`/users/${currentUser.uid}/lastOnline`] = firebase.database.ServerValue.TIMESTAMP;

      const friendsRef = firebase.database().ref(`userFriends/${currentUser.uid}`);
      friendsRef.once('value', friendshot => { // fetch friends
        friendshot.forEach(friend => { // for each friend
          // update my chat to offline
          path = `/userFriendsChats/${friend.getKey()}/${currentUser.uid}`;
          updates[`${path}/isOnline`] = false;
          updates[`${path}/lastOnline`] = firebase.database.ServerValue.TIMESTAMP;
        });

        // fan-out updates
        firebase.database().ref().update(updates)
        .then(() => {
          firebase.auth().signOut();
        });
      });
    }

    dispatch(changeAppRoot('login', {}));
  };
}

export function appInitialized() {
  return function (dispatch) {
    // code before login screen (app) initialization
    // runs on logout even
    dispatch(changeAppRoot('login', {}));
  };
}

export function loginUser(currentUser) {
  return (dispatch) => {
    // logged in app logic would go here, and when it's done, we switch app roots
    // runs on app start if previously logged in

    let path;
    let onlineUpdates = {};  // eslint-disable-line
    onlineUpdates[`/users/${currentUser.uid}/isOnline`] = true;

    let offlineUpdates = {};  // eslint-disable-line
    offlineUpdates[`/users/${currentUser.uid}/isOnline`] = false;
    offlineUpdates[`/users/${currentUser.uid}/lastOnline`] =
      firebase.database.ServerValue.TIMESTAMP;

    const firebaseRef = firebase.database().ref();
    const friendsRef = firebase.database().ref(`userFriends/${currentUser.uid}`);

    const updateFriendsChats = (friendshot) => { // update friend's chats
      friendshot.forEach(friend => { // for each friend
        path = `/userFriendsChats/${friend.getKey()}/${currentUser.uid}`;
        // setup onlineUpdates
        onlineUpdates[`${path}/isOnline`] = true;
        // setup offlineUpdates
        offlineUpdates[`${path}/isOnline`] = false;
        offlineUpdates[`${path}/lastOnline`] = firebase.database.ServerValue.TIMESTAMP;
      });
    };

    friendsRef.once('value', updateFriendsChats).then(() => {
      firebaseRef.update(onlineUpdates);
      firebaseRef.onDisconnect().update(offlineUpdates);
    });
    //friendsRef.on('child_added', updateFriendsChats);

    const { email, uid } = currentUser;
    dispatch(changeAppRoot('after-login', { email, uid }));
  };
}

export function changeAppRoot(loginState, currentUser) {
  return {
    type: LOGIN_STATE_CHANGED,
    payload: { loginState, currentUser },
  };
}
