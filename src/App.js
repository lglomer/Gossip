/* eslint-disable  global-require */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Navigation } from 'react-native-navigation';
import reducers from './reducers';
import { registerScreens } from './screens';

registerScreens(); // this is where you register all of your app's screens

Navigation.startTabBasedApp({
  tabs: [
    {
      label: 'One',
      screen: 'PetSpot.Feed', // this is a registered name for a screen
      icon: require('../img/colors.png'),
      selectedIcon: require('../img/colors.png'),
      title: 'Screen One'
    },
    {
      label: 'Two',
      screen: 'PetSpot.Login',
      icon: require('../img/colors.png'),
      selectedIcon: require('../img/colors.png'),
      title: 'Screen Two'
    }
  ]
});

class App extends Component {
  render() {
    return (
      <Provider store={createStore(reducers)}>
        <View>
          <Text>Some text Here</Text>
        </View>
      </Provider>
    );
  }
}

export default App;
