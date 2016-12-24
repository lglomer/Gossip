import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { GiftedChat } from 'react-native-gifted-chat';
import * as chatroomActions from './reducer';

const moreIcon = require('../../img/ic_add_black_48dp.png');

class Chatroom extends Component {
  static navigatorButtons = {
    rightButtons: [{
      icon: moreIcon,
      title: 'LEAVE',
      id: 'leave'
    }],
    // leftButtons: [{
    //   icon: moreIcon,
    //   id: 'leave'
    // }]
  };

  constructor(props) {
    super(props);
    // if you want to listen on navigator events, set this up
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentWillMount() {
    //TODO: reset state
    if (this.props.chat) {
      this.props.enterExistingChat(this.props.chat.id);
    } else if (this.props.friend) {
      this.props.initChatWithFriend(this.props.friend);
    }

    this.props.subscribeToMessages({ chatId: this.props.chatId });
  }

  onNavigatorEvent(event) {
    if (event.id === 'leave') {
      this.props.navigator.pop();
      this.props.leaveChat(this.props.chatId);
    }
  }

  onSend(message) {
    this.props.sendMessage({ message, chatId: this.props.chatId });
  }

  // onLoadEarlier() {
  //   this.props.fetchMessages({
  //     chatId: this.props.chatId,
  //     lastMessageKey: this.props.lastMessageKey
  //   });
  // }


  render() {
    return (
      <GiftedChat
        messages={this.props.messages}
        onSend={this.onSend.bind(this)}
        user={{
          _id: this.props.uid,
        }}

        loadEarlier={this.props.loadEarlier}
        // onLoadEarlier={this.onLoadEarlier}
        // isLoadingEarlier={this.props.isLoadingEarlier}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 20
  },
});

const mapStateToProps = state => {
  return { ...state.chatroom, uid: state.root.currentUser.uid };
};

export default connect(mapStateToProps, chatroomActions)(Chatroom);
