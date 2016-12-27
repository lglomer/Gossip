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

export function userLoggedIn(user) {
  return (dispatch) => {
    // logged in app logic would go here, and when it's done, we switch app roots
    // runs on app start if previously logged in
    let currentUser = user;
    if (!currentUser) {
      currentUser = firebase.auth().currentUser;
    }

    let val;
    let onlineUpdates = {};  // eslint-disable-line
    let offlineUpdates = {};  // eslint-disable-line
    const { email, uid } = currentUser;
    const firebaseRef = firebase.database().ref();
    const friendsRef = firebase.database().ref(`userFriends/${currentUser.uid}`);
    const userRef = firebase.database().ref(`users/${currentUser.uid}`);

    const setOnlineStatusUpdate = (updatePath) => {
      // online updates
      onlineUpdates[`${updatePath}/isOnline`] = true;
      // offline updates
      offlineUpdates[`${updatePath}/isOnline`] = false;
      offlineUpdates[`${updatePath}/lastOnline`] = firebase.database.ServerValue.TIMESTAMP;
    };

    // Check if signup is finished. If not open signupFinish screen.
    userRef.once('value', snapshot => {
      val = snapshot.val();
      if (!snapshot.exists() || !val.signupFinished) {
        dispatch(
          changeAppRoot('signup-finish', { email, uid })
        );
      } else {
        setOnlineStatusUpdate(`/users/${currentUser.uid}`);

        // for each of my chats
        firebase.database().ref(`/userCurrentChats/${currentUser.uid}`).once('value', chatshot => {
          chatshot.forEach(chat => {
            offlineUpdates[`chats/${chat.getKey()}/members/${currentUser.uid}`] = null;
          });
        });

        offlineUpdates[`/userCurrentChats/${currentUser.uid}`] = null; // LEAVE CHATS

        let path;
        // function to update friends' lists and chats
        const updateFriends = (friendshot) => {
          friendshot.forEach(friend => { // for each friend
            setOnlineStatusUpdate(`/userFriends/${friend.getKey()}/${currentUser.uid}`);

            firebase.database().ref(`/userAvailableChats/${friend.getKey()}`).once('value', chatshot => {
              chatshot.forEach(chat => {
                path =
                `userAvailableChats/${friend.getKey()}/${chat.getKey()}/members/${currentUser.uid}`;
                offlineUpdates[path] = null;
              });
            });
            firebase.database().ref(`/userCurrentChats/${friend.getKey()}`).once('value', chatshot => {
              chatshot.forEach(chat => {
                path =
                `userCurrentChats/${friend.getKey()}/${chat.getKey()}/members/${currentUser.uid}`;
                offlineUpdates[path] = null;
              });
            });
          });
        };

        // execute updates
        friendsRef.once('value', updateFriends).then(() => {
          firebaseRef.update(onlineUpdates);
          firebaseRef.onDisconnect().update(offlineUpdates);
        });
        ////friendsRef.on('child_added', updateFriendsChats);
        //^^BAD^^, in case of new friend added, will handle manually when adding the friend.

        dispatch(changeAppRoot('app', { email, uid }));
      }
    });
  };
}

export function logoutUser() {
  return function (dispatch) {
    const { currentUser } = firebase.auth();

    if (currentUser) {
      let updates = {}; // eslint-disable-line

      const setUpdatesByPath = (updatePath) => {
        updates[`${updatePath}/isOnline`] = false;
        updates[`${updatePath}/lastOnline`] = firebase.database.ServerValue.TIMESTAMP;
      };

      setUpdatesByPath(`/users/${currentUser.uid}`);
      updates[`/userCurrentChats/${currentUser.uid}`] = null; // LEAVE CHATS

      const friendsRef = firebase.database().ref(`userFriends/${currentUser.uid}`);
      friendsRef.once('value', friendshot => { // fetch friends
        friendshot.forEach(friend => { // for each friend
          // update my chat to offline
          setUpdatesByPath(`/userFriends/${friend.getKey()}/${currentUser.uid}`);
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

export function changeAppRoot(loginState, currentUser) {
  return {
    type: LOGIN_STATE_CHANGED,
    payload: { loginState, currentUser },
  };
}
