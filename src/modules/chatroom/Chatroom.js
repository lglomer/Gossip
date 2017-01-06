import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import * as chatroomActions from './reducer';

const Sound = require('react-native-sound');
//const moreIcon = require('../../img/ic_add_black_48dp.png');

class Chatroom extends Component {
  static navigatorStyle = {
    drawUnderNavBar: true,
  };

  componentWillMount() {
    const { chatToEnter, friend } = this.props;

    if (chatToEnter) {
      if (chatToEnter.isMember) {
        //this.props.fetchMessages({ chat: chatToEnter });
        this.props.chatInitialized(chatToEnter, chatToEnter.id);
      } else {
        this.props.enterExistingChat({ chat: chatToEnter });
      }
    } else if (friend) {
      this.props.listenFriendForChat({ chatFriend: friend });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.chatId !== nextProps.chatId) {
      this.props.subscribeToMessages({ chatId: nextProps.chatId });
    }
  }

  onSend(message) {
    this.playSound('message_send.wav');
    if (this.props.chatId) {
      this.props.sendMessage({ message, chatId: this.props.chatId });
    } else {
      this.props.sendMessage({ message, friend: this.props.friend });
    }
  }

  playSound(path) {
    const sound = new Sound(path, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
      } else {
        sound.play();
      }
    });
  }

  render() {
    return (
      <GiftedChat
        messages={this.props.messages}
        onSend={this.onSend.bind(this)}
        user={{
          _id: this.props.currentUser.uid,
          name: this.props.currentUser.displayName,
          avatar: this.props.currentUser.photoURL
        }}
      />
    );
  }
}

// const styles = {
//   container: {
//     flex: 1,
//     backgroundColor: '#f1f1f1',
//     padding: 20
//   },
//   footerContainer: {
//   marginTop: 5,
//   marginLeft: 10,
//   marginRight: 10,
//   marginBottom: 10,
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#aaa',
//   },
// };

const mapStateToProps = state => {
  return { ...state.chatroom, currentUser: state.root.currentUser };
};

export default connect(mapStateToProps, chatroomActions)(Chatroom);
