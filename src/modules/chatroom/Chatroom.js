import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { GiftedChat } from 'react-native-gifted-chat';
import * as chatroomActions from './reducer';

const moreIcon = require('../../img/ic_add_black_48dp.png');

class Chatroom extends Component {
  static navigatorButtons = {
    leftButtons: [{
      id: 'menu'
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
    if (this.props.chatId) {
      this.props.enterExistingChat(this.props.chatId);
      this.props.subscribeToMessages({ chatId: this.props.chatId });
    } else if (this.props.friend) {
      Alert.alert('init');
      this.props.initChatWithFriend({ chatFriend: this.props.friend });
      //this.props.subscribeToMessages({ userId: this.props.friend.id });
    }
  }


  componentWillReceiveProps(nextProps) {
    console.log(nextProps.messages);
  }

  onNavigatorEvent(event) {
    // if (event.id === 'leave') {
    //   this.props.navigator.pop();
    //   this.props.leaveChat(this.props.chatId);
    // }
  }

  onSend(message) {
    if (this.props.chatId) {
      this.props.sendMessage({ message, chatId: this.props.chatId });
    } else {
      this.props.sendMessage({ message, friend: this.props.friend });
    }
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
