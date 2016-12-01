import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
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

  render() {
    return (
      <View style={styles.container}>
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
            <Button onPress={() => this.props.login()} label="Login" />
          </CardSection>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20
  },
});

const mapStateToProps = state => {
  return { ...state.login };
};

export default connect(mapStateToProps, loginActions)(Login);
