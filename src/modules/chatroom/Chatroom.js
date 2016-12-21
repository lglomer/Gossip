import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as chatroomActions from './reducer';
import { Input } from '../_global/components';

const moreIcon = require('../../img/ic_add_black_48dp.png');

class Chatroom extends Component {
  static navigatorButtons = {
    rightButtons: [{
      icon: moreIcon,
      id: 'more'
    }]
  };

  constructor(props) {
    super(props);
    // if you want to listen on navigator events, set this up
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentWillMount() {
    //reset state
    _.each(this.props.post, (value, key) => { // for each post's keys:values
      this.props.postChange({ key, value }); // set initial values from state
    });
  }

  onNavigatorEvent(event) {
    if (event.id === 'more') {
      //
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <Input
          label="Post"
          placeholder="What's on your mind?"
          value={this.props.content}
          onChangeText={value => this.props.postChange({ key: 'content', value })}
        />
      </View>
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
  return { ...state.chatroom };
};

export default connect(mapStateToProps, chatroomActions)(Chatroom);
