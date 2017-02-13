import React, { Component } from 'react';
import {
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { GiftedChat, InputToolbar, Time, Bubble } from 'react-native-gifted-chat';
import _ from 'lodash';
import * as chatroomActions from './reducer';

const sentIcon = require('../../img/sentIcon.png');
const seenIcon = require('../../img/seenIcon.png');
const plusIcon = require('../../img/plusIcon.png');
const sendIcon = require('../../img/sendIcon.png');

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
      this.props.listenToInvitationByFriend(friend.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.chatId !== nextProps.chatId) {
      this.props.subscribeToAll({ chatId: nextProps.chatId });
    }
  }

  onSend(message) {
    //Sounds.playSound('message_send.wav');
    if (this.props.chatId) {
      this.props.sendMessage({ message, chatId: this.props.chatId });
    } else {
      this.props.sendMessage({ message, friend: this.props.friend });
    }
  }

  renderInputToolbar(inputToolbarProps) {
    const props = {
      ...inputToolbarProps,
      containerStyle: {
        //backgroundColor: 'transparent', //#F7F7F7
        //borderTopWidth: 0,
        //borderTopColor: 'transparent',
        //shadowOpacity: 0,
        //paddingBottom: 15,
      },
      primaryStyle: {
        //borderRadius: 20,
        //elevation: 1,
        //marginLeft: 8,
        //marginRight: 8,
        //paddingBottom: 20
      }
    };

    return (
      <InputToolbar
        {...props}
      />
    );
  }

  renderActions() {
    return (
      <TouchableOpacity
        onPress={() => Alert.alert('Add')}
        style={{ paddingLeft: 10, paddingBottom: 7 }}
      >
        <Image
          style={{ height: 25, width: 25, opacity: 0.7 }}
          source={plusIcon}
        />
      </TouchableOpacity>
    );
  }

  renderComposer(props) {
    let count = 0;
    if (this.props.chat && this.props.chat.members) {
      _.map(this.props.chat.members, () => {
        count++;
      });
    }

    const editable = count > 1 || this.props.friend !== undefined;
    return (
      <TextInput
        placeholder={'Write a message...'}
        //placeholderTextColor={'#FFFFFF'}
        multiline
        onChange={(e) => {
          props.onChange(e);
        }}
        onChangeText={(text) => {
          this.props.messageChange({
            newVal: text,
            oldVal: props.text,
            chatId: this.props.chatId
          });
        }}
        editable={editable}
        style={[styles.textInput, styles[`disabled_${!editable}`], {
          height: Math.max(40, props.composerHeight),
          //color: '#FFFFFF'
        }]}
        value={props.text}
        enablesReturnKeyAutomatically
        underlineColorAndroid="transparent"
      />
    );
  }

  renderSend(props) {
    if (props.text.trim().length > 0) {
      return (
        <TouchableOpacity
          onPress={() => {
            props.onSend({ text: props.text.trim() }, true);
          }}
          accessibilityTraits="button"
          style={{ marginRight: 10, marginBottom: 9 }}
        >
          <Image
            style={{ height: 22,
              width: 22,
              opacity: 0.7,
            }}
            source={sendIcon}
          />
        </TouchableOpacity>
      );
    }

    return <View />;
  }

  renderSentIndicator(isSent) {
    switch (isSent) {
      case true:
        return (
          <View style={{ marginTop: 1, marginRight: 13 }}>
            <Image
              style={{ height: 13, width: 13 }}
              source={sentIcon}
            />
          </View>
        );

      case false:
        return (
          <View style={{ marginTop: 3, marginRight: 12, marginLeft: 4 }}>
            <ActivityIndicator
              color={'#FFFFFF'}
              size={10} // only on android
            />
          </View>
        );

      default:
        return null;
    }
  }

  renderTime(props) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Time {...props} />
        {this.renderSentIndicator(props.currentMessage.isSent)}
      </View>
    );
  }

  // renderFooter() {
  //   if (this.props.chat && this.props.chat.members) {
  //     return (
  //       <MemberList
  //         members={this.props.chat.members}
  //       />
  //     );
  //     //<Text style={styles.typing}>{this.props.typingText}</Text>
  //   }
  // }

  render() {
    return (
      <View style={styles.container}>
          <GiftedChat
            messages={this.props.messages}
            onSend={this.onSend.bind(this)}

            renderInputToolbar={this.renderInputToolbar.bind(this)}
              renderActions={this.renderActions.bind(this)}
              renderComposer={this.renderComposer.bind(this)}
              renderSend={this.renderSend.bind(this)}
              renderTime={this.renderTime.bind(this)}

            user={{
              _id: this.props.currentUser.uid,
              name: this.props.currentUser.displayName,
              avatar: this.props.currentUser.photoURL
            }}

            //renderFooter={this.renderFooter.bind(this)}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F7F7', // If changed change in containerStyle above ^^
    flex: 1,
  },
  textInput: {
    flex: 1,
    marginLeft: 7,
    fontSize: 16,

    lineHeight: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  typing: {
    fontSize: 14,
    color: '#999999',
    paddingLeft: 10,
    paddingRight: 10
  },
  disabled_true: {
    backgroundColor: 'red'
  }
});

const mapStateToProps = state => {
  const messages = _.map(state.chatroom.messages, (val, uid) => {
    return { ...val, uid };
  });

  return { ...state.chatroom, messages, currentUser: state.root.currentUser };
};

export default connect(mapStateToProps, chatroomActions)(Chatroom);
