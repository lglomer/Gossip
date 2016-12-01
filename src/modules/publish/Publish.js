import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as publishActions from './reducer';
import { Input } from '../_global/components';

class Publish extends Component {
  static navigatorButtons = {
    rightButtons: [{
      title: 'Publish',
      id: 'publish'
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
    if (event.id === 'publish') {
      this.props.postPublish({ content: this.props.content });
      this.props.navigator.dismissModal();
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
  return { ...state.publish };
};

export default connect(mapStateToProps, publishActions)(Publish);
