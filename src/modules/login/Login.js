import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import { Card, CardSection, Input, Button } from '../_global/components';
import * as loginActions from './reducer';

class Login extends Component {
  // componentWillMount() {
  //   //reset state
  //   _.each(this.props.login, (value, key) => { // for each post's keys:values
  //     this.props.formChange({ key, value }); // set initial values from state
  //   });
  // }

  onLoginPress() {
    const { email, password } = this.props.login;
    this.props.loginUser({ email, password });
  }

  render() {
    const { email, password, error, loading } = this.props.login;

    return (
      <View style={styles.container}>
        <Spinner
          visible={loading}
          // color={'#111'}
          // overlayColor={'rgba(0,0,0,0.4)'}
        />
        <Input
          label="Email"
          placeholder="example@mail.com"
          value={email}
          onChangeText={value => this.props.formChange({ key: 'email', value })}
        />
        <Input
          label="Password"
          secureTextEntry
          placeholder="password"
          value={password}
          onChangeText={value => this.props.formChange({ key: 'password', value })}
        />
        <Button onPress={() => this.onLoginPress()} label="Login" type="wide" />
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
};

const mapStateToProps = state => {
  return { login: state.login };
};

export default connect(mapStateToProps, loginActions)(Login);
