import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import { Card, CardSection, Input, Button } from '../_global/components';
import * as signupActions from './reducer';
import * as rootActions from '../_global/reducer';

class SignupFinish extends Component {
  componentWillReceiveProps(props) {
    if (props.signup.signupFinished) {
      props.loggedInUser(); // signup action
      props.loginUser(); // root action
    }
  }

  onSignupPress() {
    const { displayName } = this.props.signup;
    this.props.finishSignup({ displayName });
  }

  render() {
    const { displayName, error, loading } = this.props.signup;

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
              label="Full name"
              placeholder="John Doe"
              value={displayName}
              onChangeText={value => this.props.formChange({ key: 'displayName', value })}
            />
          </CardSection>


          <CardSection>
            <Button onPress={() => this.onSignupPress()} label="Finish" type="wide" />
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

export default connect(mapStateToProps, { ...signupActions, ...rootActions })(SignupFinish);
