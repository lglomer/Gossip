import React, { Component } from 'react';
import { TextInput, Text, View, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import * as chatroomActions from './reducer';
import * as Sounds from '../_global/sounds';
//const moreIcon = require('../../img/ic_add_black_48dp.png');

class Chatroom extends Component {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarBackgroundColor: '#e91e63',
    statusBarColor: '#AD1457',
    navBarButtonColor: '#FFFFFF',
    navBarTextColor: '#FFFFFF'
  }

  componentWillMount() {
    const { chatToEnter, friend } = this.props;

    if (chatToEnter) {
      if (chatToEnter.isMember) {
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
      this.props.subscribeToTyping({ chatId: nextProps.chatId });
    }
  }

  onSend(message) {
    Sounds.playSound('message_send.wav');
    if (this.props.chatId) {
      this.props.sendMessage({ message, chatId: this.props.chatId });
    } else {
      this.props.sendMessage({ message, friend: this.props.friend });
    }
  }

  renderComposer(props) {
    return (
      <TextInput
        placeholder={'Write a message...'}
        multiline
        onChange={(e) => {
          Sounds.playSound('typing_key_press.wav');
          props.onChange(e);
        }}
        onChangeText={(text) => {
          this.props.messageChange({
            newVal: text,
            oldVal: props.text,
            chatId: this.props.chatId
          });
        }}
        style={[styles.textInput, {
          height: Math.max(40, props.composerHeight),
        }]}
        value={props.text}
        enablesReturnKeyAutomatically
        underlineColorAndroid="transparent"
      />
    );
  }

  renderFooter() {
    return (
      <Text style={styles.typing}>{this.props.typingText}</Text>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.props.messages}
          onSend={this.onSend.bind(this)}
          renderComposer={this.renderComposer.bind(this)}
          renderFooter={this.renderFooter.bind(this)}
          user={{
            _id: this.props.currentUser.uid,
            name: this.props.currentUser.displayName,
            avatar: this.props.currentUser.photoURL
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F7F7',
    flex: 1,
  },
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
  typing: {
    fontSize: 14,
    color: '#999999',
    paddingLeft: 10,
    paddingRight: 10
  }
});

const mapStateToProps = state => {
  return { ...state.chatroom, currentUser: state.root.currentUser };
};

export default connect(mapStateToProps, chatroomActions)(Chatroom);
