import firebase from 'firebase';
import { Alert } from 'react-native';

const LOGIN_STATE_CHANGED = 'gossip/root/LOGIN_STATE_CHANGED';

const initialState = {
  loginState: null, // 'welcome' / 'app' / 'signup-finish'
  currentUser: null, // important to keep null for logoutUser's if statement
};

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_STATE_CHANGED:
      return {
        ...state,
        currentUser: action.payload.currentUser,
        loginState: action.payload.loginState
      };
    default:
      return state;
  }
}

function getUserUpdates(user) {
  return new Promise((resolve, reject) => {
    let currentUser = user;
    if (!currentUser) {
      currentUser = firebase.auth().currentUser;
    }

    let onlineUpdates = {};  // eslint-disable-line
    let offlineUpdates = {};  // eslint-disable-line

    const setStatusUpdate = (updatePath) => {
      // online updates
      onlineUpdates[`${updatePath}/isOnline`] = true;
      // offline updates
      offlineUpdates[`${updatePath}/isOnline`] = false;
      offlineUpdates[`${updatePath}/lastOnline`] = firebase.database.ServerValue.TIMESTAMP;
    };

    setStatusUpdate(`/users/${currentUser.uid}`);

    // firebase.database().ref(`/userChats/${currentUser.uid}`).once('value', chatshot => {
    //   // leave my chats
    //   chatshot.forEach(chat => {
    //    offlineUpdates[`userChats/${currentUser.uid}/${chat.getKey()}/members/${currentUser.uid}`]
    //       = null;
    //     offlineUpdates[`userChats/${currentUser.uid}/${chat.getKey()}/isMember`] = null;
    //   });
    // });

    const friendsRef = firebase.database().ref(`userFriends/${currentUser.uid}`);
    const updateFriends = (friendshot) => {
      friendshot.forEach(friend => { // for each friend
        setStatusUpdate(`/userFriends/${friend.getKey()}/${currentUser.uid}`);
      });
    };

    //TESTING
    onlineUpdates[`/userStatus/${currentUser.uid}`] = 'online';
    offlineUpdates[`/userStatus/${currentUser.uid}`] = 'offline';


    // execute updates
    friendsRef.once('value', updateFriends).then(() => {
      resolve({ onlineUpdates, offlineUpdates });
    });
  });
}

export function userLoggedIn(user) {
  return (dispatch) => {
    // logged in app logic would go here, and when it's done, we switch app roots
    // runs on app start if previously logged in
    let currentUser = user;
    if (!currentUser) {
      currentUser = firebase.auth().currentUser;
    }

    const { displayName, email, photoUrl, uid } = currentUser;
    const firebaseRef = firebase.database().ref();
    const userRef = firebase.database().ref(`users/${currentUser.uid}`);

    dispatch(changeAppRoot('app', { displayName, email, photoUrl, uid }));

    getUserUpdates(currentUser).then(({ onlineUpdates, offlineUpdates }) => {
      firebaseRef.update(onlineUpdates);
      firebaseRef.onDisconnect().update(offlineUpdates);
    });

    // Check if banned or not exists. If all good do online/offline updates.
    userRef.once('value', snapshot => {
      if (snapshot.exists()) {
        if (snapshot.val().isBanned) {
          return dispatch(
            changeAppRoot('banned', { displayName, email, photoUrl, uid })
          );
        }
      }
    });
  };
}

export function logoutUser() {
  return function (dispatch) {
    const { currentUser } = firebase.auth();

    getUserUpdates(currentUser).then((allUpdates) => {
      firebase.database().ref().update(allUpdates.offlineUpdates).then(() => {
        firebase.auth().signOut();
      });
    });

    dispatch(changeAppRoot('welcome', {}));
  };
}

export function appInitialized() {
  return function (dispatch) {
    dispatch(changeAppRoot('welcome', {}));
  };
}

export function changeAppRoot(loginState, currentUser) {
  return {
    type: LOGIN_STATE_CHANGED,
    payload: { loginState, currentUser },
  };
}
