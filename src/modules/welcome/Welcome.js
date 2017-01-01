import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Button } from '../_global/components';

class Welcome extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  pushLogin() {
    this.props.navigator.push({
      screen: 'Gossip.Login',
      title: 'Login'
    });
  }

  pushSignup() {
    this.props.navigator.push({
      screen: 'Gossip.Signup',
      title: 'Sign up'
    });
  }

  render() {
    const { container, headerContainer, bodyContainer, title, subtitle } = styles;
    return (
      <View style={container}>
        <View />
        <View style={headerContainer}>
          <Text style={title}>Gossip</Text>
          <Text style={subtitle}>{'There\'s no room for silence'}</Text>
        </View>
        <View style={bodyContainer}>
          <Button
            label="Sign up"
            onPress={this.pushSignup.bind(this)}
            style={{ marginBottom: 5 }}
          />
          <TouchableOpacity onPress={this.pushLogin.bind(this)}>
            <Text style={{ fontSize: 12 }}>I Already have an account</Text>
          </TouchableOpacity>
        </View>
        <View />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
  },
  bodyContainer: {
    alignItems: 'center',
  },
  title: {
    color: '#000',
    fontSize: 43,
    fontWeight: '500'
  },
  subtitle: {
    fontSize: 16,
  }
};

export default Welcome;
