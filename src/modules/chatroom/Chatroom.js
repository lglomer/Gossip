import React, { Component } from 'react';
import { TextInput, StyleSheet, Platform } from 'react-native';
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

  renderComposer(props) {
    return (
      <TextInput
        placeholder={'Write a message...'}
        multiline
        onChange={(e) => {
          props.onChange(e);
          this.props.messageChange(props.text);
        }}
        style={[styles.textInput, {
          height: Math.max(40, props.composerHeight),
        }]}
        value={props.text}
        enablesReturnKeyAutomatically
        underlineColorAndroid="transparent"
      />
        //{ height:  }
    );
  }

  render() {
    return (
      <GiftedChat
        messages={this.props.messages}
        onSend={this.onSend.bind(this)}
        renderComposer={this.renderComposer.bind(this)}
        user={{
          _id: this.props.currentUser.uid,
          name: this.props.currentUser.displayName,
          avatar: this.props.currentUser.photoURL
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 16,
    marginTop: Platform.select({
      ios: 6,
      android: 0,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 3,
    }),
  },
});

const mapStateToProps = state => {
  return { ...state.chatroom, currentUser: state.root.currentUser };
};

export default connect(mapStateToProps, chatroomActions)(Chatroom);
