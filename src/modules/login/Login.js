import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Card, CardSection, Input, Button } from '../_global/components';
import * as loginActions from './reducer';

class Login extends Component {
  componentWillMount() {
    //reset state
    _.each(this.props.post, (value, key) => { // for each post's keys:values
      this.props.formChange({ key, value }); // set initial values from state
    });
  }

  onLoginPress() {
    this.props.loginUser({ email: this.props.email, password: this.props.password });
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.props.loading}
          // color={'#111'}
          // overlayColor={'rgba(0,0,0,0.4)'}
        />
        <Card>
          <CardSection>
            <Input
              label="Email"
              placeholder="example@mail.com"
              value={this.props.email}
              onChangeText={value => this.props.formChange({ key: 'email', value })}
            />
          </CardSection>

          <CardSection>
            <Input
              label="Password"
              secureTextEntry
              placeholder="password"
              value={this.props.password}
              onChangeText={value => this.props.formChange({ key: 'password', value })}
            />
          </CardSection>

          <CardSection>
            <Button onPress={() => this.onLoginPress()} label="Login" />
          </CardSection>
          <CardSection>
            <Text>{this.props.error}</Text>
          </CardSection>
        </Card>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20
  },
};

const mapStateToProps = state => {
  return { ...state.login };
};

export default connect(mapStateToProps, loginActions)(Login);
