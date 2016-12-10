// import { NetInfo, Alert } from 'react-native';
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
      const userRef = firebase.database().ref(`/users/${currentUser.uid}`);
      const userFriendsRef = firebase.database().ref('userFriends');
      const friendsChatsRef = firebase.database().ref('userFriendsChats');

      userFriendsRef.child(currentUser.uid).once('value', friendshot => { // fetch friends
        friendshot.forEach(friend => { // for each friend
          // update to offline
          friendsChatsRef.child(friend.getKey()).child(currentUser.uid).update({
            isOnline: false,
            lastOnline: firebase.database.ServerValue.TIMESTAMP
          });
        });
      });

      userRef.update({
        isOnline: false,
        lastOnline: firebase.database.ServerValue.TIMESTAMP
      });

      firebase.auth().signOut();
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
    //const { currentUser } = firebase.auth();

    const userRef = firebase.database().ref(`/users/${currentUser.uid}`);
    const connectedRef = firebase.database().ref('.info/connected');
    const userFriendsRef = firebase.database().ref('userFriends');
    const friendsChatsRef = firebase.database().ref('userFriendsChats');

    connectedRef.on('value', (snap) => { // on device connect event change
      if (snap.val() === true) { // online
        userFriendsRef.child(currentUser.uid).once('value', friendshot => { // fetch friends
          friendshot.forEach(friend => { // for each friend
            // update to online
            console.log(friend.getKey());
            console.log(currentUser.uid);
            friendsChatsRef.child(friend.getKey()).child(currentUser.uid)
            .update({
              isOnline: true,
              displayName: currentUser.displayName,
            });

            // onDisconnect update to offline
            friendsChatsRef.child(friend.getKey()).child(currentUser.uid)
            .onDisconnect().update({
              isOnline: false,
              lastOnline: firebase.database.ServerValue.TIMESTAMP,
            });
          });
        });

        userRef.child('isOnline').set(true);
        userRef.onDisconnect().update({
          isOnline: false,
          lastOnline: firebase.database.ServerValue.TIMESTAMP
        });
      }
    });

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
