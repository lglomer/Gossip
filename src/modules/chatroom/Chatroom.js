import React, { Component } from 'react';
import {
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import * as chatroomActions from './reducer';

const Sound = require('react-native-sound');
//const moreIcon = require('../../img/ic_add_black_48dp.png');

class Chatroom extends Component {
  static navigatorStyle = {
    drawUnderNavBar: true,
    navBarTransparent: true
  };

  componentWillMount() {
    const { chatId, isJoined, chat, friend } = this.props;

    if (chatId) {
      if (isJoined) {
        this.props.fetchMessages({ chat });
      }
      this.props.enterExistingChat({ chatId });
    } else if (this.props.friend) {
      this.props.listenFriendForChat({ chatFriend: friend });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.chatId !== nextProps.chatId) {
      this.props.subscribeToMessages({ chatId: nextProps.chatId });
    }
  }

  onSend(message) {
    this.playSound();
    if (this.props.chatId) {
      this.props.sendMessage({ message, chatId: this.props.chatId });
    } else {
      this.props.sendMessage({ message, friend: this.props.friend });
    }
  }

  playSound() {
    const sound = new Sound('message_send.wav', Sound.MAIN_BUNDLE, (error) => {
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

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 20
  },
  footerContainer: {
  marginTop: 5,
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
};

const mapStateToProps = state => {
  return { ...state.chatroom, currentUser: state.root.currentUser };
};

export default connect(mapStateToProps, chatroomActions)(Chatroom);
