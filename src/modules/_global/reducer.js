import firebase from 'firebase';

const LOGIN_STATE_CHANGED = 'gossip/root/LOGIN_STATE_CHANGED';

const initialState = {
  loginState: null, // 'welcome' / 'app' / 'signup-finish'
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
          path = `/userOnlineFriends/${friend.getKey()}/${currentUser.uid}`;
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

    dispatch(changeAppRoot('welcome', {}));
  };
}

export function appInitialized() {
  return function (dispatch) {
    // code before login screen (app) initialization
    // runs on logout even
    dispatch(changeAppRoot('welcome', {}));
  };
}

export function loginUser(user) {
  return (dispatch) => {
    // logged in app logic would go here, and when it's done, we switch app roots
    // runs on app start if previously logged in
    let currentUser = user;
    if (!currentUser) {
      currentUser = firebase.auth().currentUser;
    }

    let val;
    let path;
    let onlineUpdates = {};  // eslint-disable-line
    let offlineUpdates = {};  // eslint-disable-line
    const { email, uid } = currentUser;
    const firebaseRef = firebase.database().ref();
    const friendsRef = firebase.database().ref(`userFriends/${currentUser.uid}`);
    const userRef = firebase.database().ref(`users/${currentUser.uid}`);

    // Check if signup is finished. If not open signupFinish screen.
    userRef.once('value', snapshot => {
      val = snapshot.val();
      if (!snapshot.exists() || !val.signupFinished) {
        dispatch(
          changeAppRoot('signup-finish', { email, uid })
        );
      } else {
        // online updates
        onlineUpdates[`/users/${currentUser.uid}/isOnline`] = true;
        // offline updates
        offlineUpdates[`/users/${currentUser.uid}/isOnline`] = false;
        offlineUpdates[`/users/${currentUser.uid}/lastOnline`] =
          firebase.database.ServerValue.TIMESTAMP;

        // function to update friend's chats
        const updateFriendsChats = (friendshot) => {
          friendshot.forEach(friend => { // for each friend
            path = `/userOnlineFriends/${friend.getKey()}/${currentUser.uid}`;
            // online updates
            onlineUpdates[`${path}/isOnline`] = true;
            // offline updates
            offlineUpdates[`${path}/isOnline`] = false;
            offlineUpdates[`${path}/lastOnline`] = firebase.database.ServerValue.TIMESTAMP;
          });
        };

        // execute updates
        friendsRef.once('value', updateFriendsChats).then(() => {
          firebaseRef.update(onlineUpdates);
          firebaseRef.onDisconnect().update(offlineUpdates);
        });
        ////friendsRef.on('child_added', updateFriendsChats);

        dispatch(changeAppRoot('app', { email, uid }));
      }
    });
  };
}

export function changeAppRoot(loginState, currentUser) {
  return {
    type: LOGIN_STATE_CHANGED,
    payload: { loginState, currentUser },
  };
}
