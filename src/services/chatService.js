import firebase from 'firebase';
import { Alert } from 'react-native';
import _ from 'lodash';
import eventService from './eventService';

function init(chatId) {
  _onMessageAdded(chatId);
  _onTypingChanged(chatId);
}

function on(eventId, callback) {
  eventService.addEventCallback(`on_${eventId}`, callback);
}

function once(eventId, callback) {
  eventService.addEventCallback(`once_${eventId}`, callback);
}

function _onMessageAdded(chatId) {
  const chatMessagesRef = firebase.database().ref(`/chatMessages/${chatId}`);
  chatMessagesRef.orderByKey().on('child_added', snapshot => {
    eventService.invokeEventCallbacks('on_message_added', snapshot);
  });

  chatMessagesRef.orderByKey().once('child_added', snapshot => {
    eventService.invokeEventCallbacks('once_message_added', snapshot);
  });
}

function _onTypingChanged(chatId) {
  const typingRef = firebase.database().ref(`/chats/${chatId}/typing`);
  typingRef.on('child_added', snapshot => {
    eventService.invokeEventCallbacks('on_typing_changed', snapshot);
  });

  typingRef.once('child_added', snapshot => {
    eventService.invokeEventCallbacks('once_typing_changed', snapshot);
  });
}

function setCurrentUserTyping({ isTyping, chatId }) {
  const { currentUser } = firebase.auth();
  const typingRef = firebase.database()
    .ref(`/chats/${chatId}/typing/${currentUser.uid}`);

  let pushObj = null;
  if (isTyping) {
    pushObj = {
      displayName: currentUser.displayName
    };
  }
  typingRef.set(pushObj);
}

function getTypingText(snapshot) {
  const { currentUser } = firebase.auth();

  let typingText = '';
  if (snapshot.exists()) {
    let count = 0;
    let prvTyper;

    snapshot.forEach(typer => {
      if (typer.getKey() !== currentUser.uid) {
        switch (count) {
          case 0:
            typingText = `${typer.val().displayName} is typing...`;
            prvTyper = typer;
            break;

          case 1:
            typingText =
              `${prvTyper.val().displayName} and ${typer.val().displayName} are typing...`;
            break;

          case 2:
            typingText = `${prvTyper.val().displayName}, ${typer.val().displayName}`;
            break;
          default:
        }
        count++;
      }
    });

    if (count >= 3) {
      typingText += `and ${count - 1} more are typing...`;
    }
  }

  return typingText;
}

function sendMessage({ chatId, message, messageKey }) {
  const { currentUser } = firebase.auth();
  const messageRef = firebase.database().ref(`/chatMessages/${chatId}/${messageKey}`);
  messageRef.set({
    text: message[0].text,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    sender: {
      id: currentUser.uid,
      displayName: currentUser.displayName
    },
    seenBy: {
      [currentUser.uid]: true
    }
  });
}

function listenFriendForChat(friend) {
  const { currentUser } = firebase.auth();
  const privateChatRef =
    firebase.database().ref(`/userFriends/${friend.id}/${currentUser.uid}/privateChatId`);

  // ON
  const callbackOn = (snapshot) => {
    if (snapshot.exists()) {
      firebase.database().ref(`/chats/${snapshot.val()}`).once('value', chatshot => {
        eventService.invokeEventCallbacks('on_friend_started_chat', chatshot);
      });

      privateChatRef.off('value', callbackOn);
    }
  };
  privateChatRef.on('value', callbackOn);

  // ONCE
  const callbackOnce = (snapshot) => {
    if (snapshot.exists()) {
      firebase.database().ref(`/chats/${snapshot.val()}`).once('value', chatshot => {
        eventService.invokeEventCallbacks('on_friend_started_chat', chatshot);
      });

      privateChatRef.off('value', callbackOnce);
    }
  };
  privateChatRef.once('value', callbackOnce);

  let offlineUpdates = {}; // eslint-disable-line
  offlineUpdates[`/userFriends/${currentUser.uid}/${friend.id}/privateChatId`] = null;
  //offlineUpdates[`/userFriends/${chatFriend.id}/${currentUser.uid}/privateChatId`] = null;

  firebase.database().ref().onDisconnect().update(offlineUpdates);
}

function createChatWithFriend({ chatId, friend }) {
	return new Promise((resolve) => {
    const { currentUser } = firebase.auth();
		let chatUpdates = {}; // eslint-disable-line
		let offlineUpdates = {}; // eslint-disable-line
		const chatObj = {
			members: {
				[friend.id]: {
					displayName: friend.displayName,
					joinedAt: firebase.database.ServerValue.TIMESTAMP
				},
				[currentUser.uid]: {
					displayName: currentUser.displayName,
					joinedAt: firebase.database.ServerValue.TIMESTAMP
				}
			},
			isMember: true,
      unreadNum: 0
		};

		//chatUpdates[`/chats/${chatId}`] = chatObj;

		chatUpdates[`/userChats/${friend.id}/${chatId}`] = chatObj;
		chatUpdates[`/userChats/${currentUser.uid}/${chatId}`] = chatObj;

		chatUpdates[`/userFriends/${currentUser.uid}/${friend.id}/privateChatId`] = chatId;
		chatUpdates[`/userFriends/${friend.id}/${currentUser.uid}/privateChatId`] = chatId;

		offlineUpdates[`/userChats/${friend.id}/${chatId}/members/${currentUser.uid}`] = null;
		offlineUpdates[`/userChats/${currentUser.uid}/${chatId}/members/${currentUser.uid}`] = null;
		offlineUpdates[`/userChats/${currentUser.uid}/${chatId}/isMember`] = null;

		offlineUpdates[`/userFriends/${currentUser.uid}/${friend.id}/privateChatId`] = null;
		offlineUpdates[`/userFriends/${friend.id}/${currentUser.uid}/privateChatId`] = null;

		// if friend disconnects, remove them from the chat
		// firebase.database().ref(`/users/${friend.id}/isOnline`).on('value', snap => {
		// 	if (snap.exists()) {
		// 		if (snap.val() === false) {
		// 			const friendUpdates = {};
		// 			firebase.database().ref(`/userChats/${currentUser.uid}/${chatId}/members`)
		// 			.once('value', membershot => {
		// 				membershot.forEach(member => {
		// 					friendUpdates[`/userChats/${member.getKey()}/${chatId}/members/${friend.id}`] = null;
		// 				});
		// 			});
		// 		}
		// 	}
		// });


		firebase.database().ref().onDisconnect().update(offlineUpdates);
		firebase.database().ref().update(chatUpdates).then(() => {
			resolve({ chat: chatObj, chatId });
		});
	});
}


export default {
  init,
  on,
  once,
  setCurrentUserTyping,
  getTypingText,
  sendMessage,
  listenFriendForChat,
  createChatWithFriend
};
