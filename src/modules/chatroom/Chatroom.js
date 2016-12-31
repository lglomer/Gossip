import React, { Component } from 'react';
import {
  View,
  Alert,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { GiftedChat } from 'react-native-gifted-chat';
import * as chatroomActions from './reducer';

const Sound = require('react-native-sound');
//const moreIcon = require('../../img/ic_add_black_48dp.png');

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

  static navigatorStyle = {
    drawUnderNavBar: true,
    navBarTransparent: true
  };

  componentWillMount() {
    const { chatId, isJoined, chat } = this.props;
    if (chatId) {
      if (isJoined) {
        this.props.fetchMessages({ chat });
      }

      this.props.enterExistingChat(this.props.chatId);
      this.props.subscribeToMessages({ chatId: this.props.chatId });
    } else if (this.props.friend) {
      this.props.initChatWithFriend({ chatFriend: this.props.friend });
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

  // onLoadEarlier() {
  //   this.props.fetchMessages({
  //     chatId: this.props.chatId,
  //     lastMessageKey: this.props.lastMessageKey
  //   });
  // }
  renderFooter() {
    // if (this.props.typingText) {
    //   return (
    //     <View style={styles.footerContainer}>
    //       <Text style={styles.footerText}>
    //         {this.props.typingText}
    //       </Text>
    //     </View>
    //   );
    // }
    return null;
  }

  renderHeader() {
    return (
      <View style={{ backgroundColor: 'red', height: 54 }} />
    );
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
        renderFooter={this.renderFooter.bind(this)}
        renderHeader={this.renderHeader.bind(this)}
        loadEarlier={this.props.loadEarlier}
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
