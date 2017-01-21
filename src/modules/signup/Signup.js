import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import { Card, CardSection, Input, Button } from '../_global/components';
import * as signupActions from './reducer';

class Signup extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: 'SIGN UP',
        id: 'signup'
      }
    ]
  };

  constructor(props) {
    super(props);
    // if you want to listen on navigator events, set this up
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.id === 'signup') {
      this.onSignupPress();
    }
  }

  onSignupPress() {
    const { email, password } = this.props.signup;
    this.props.signupUser({ email, password });
  }

  render() {
    const { email, password, error, loading } = this.props.signup;

    return (
      <View style={styles.container}>
        <Spinner
          visible={loading}
          // color={'#111'}
          // overlayColor={'rgba(0,0,0,0.4)'}
        />
            <Input
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={value => this.props.formChange({ key: 'email', value })}
            />
            <Input
              style={styles.input}
              placeholder="Full Name"
              value={email}
              onChangeText={value => this.props.formChange({ key: 'displayName', value })}
            />
            <Input
              style={styles.input}
              secureTextEntry
              placeholder="Password"
              value={password}
              onChangeText={value => this.props.formChange({ key: 'password', value })}
            />
            <Text>{error}</Text>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 15
  },
  input: {
  }
};

const mapStateToProps = state => {
  return { signup: state.signup };
};

export default connect(mapStateToProps, signupActions)(Signup);
