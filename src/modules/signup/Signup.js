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
        <Card>
          <CardSection>
            <Input
              label="Email"
              placeholder="example@mail.com"
              value={email}
              onChangeText={value => this.props.formChange({ key: 'email', value })}
            />
          </CardSection>

          <CardSection>
            <Input
              label="Password"
              secureTextEntry
              placeholder="password"
              value={password}
              onChangeText={value => this.props.formChange({ key: 'password', value })}
            />
          </CardSection>

          <CardSection>
            <Button onPress={() => this.onSignupPress()} label="Sign up" type="wide" />
          </CardSection>
          <CardSection>
            <Text>{error}</Text>
          </CardSection>
        </Card>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20
  },
};

const mapStateToProps = state => {
  return { signup: state.signup };
};

export default connect(mapStateToProps, signupActions)(Signup);
