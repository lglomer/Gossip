/* eslint-disable  global-require */
//import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { registerScreens } from './screens';

registerScreens(); // this is where you register all of your app's screens

const createTabs = () => {
  const tabs = [
    {
      label: 'Feed',
      screen: 'PetSpot.Feed',
      icon: require('../img/one@1x.android.png'),
      selectedIcon: require('../img/one_selected@2x.png'),
      title: 'Feed'
    },
    {
      label: 'Login',
      screen: 'PetSpot.Login',
      icon: require('../img/two@2x.png'),
      selectedIcon: require('../img/two_selected@2x.png'),
      title: 'Login',
    },
    {
      label: 'Collapse',
      screen: 'PetSpot.CollapsingTopBarScreen',
      icon: require('../img/three@2x.png'),
      selectedIcon: require('../img/three_selected@2x.png'),
      title: 'Collapse Bro',
    }
  ];

  // if (Platform.OS === 'android') {
  //   tabs.push({
  //     label: 'Collapsing',
  //     screen: 'PetSpot.CollapsingTopBarScreen',
  //     icon: require('../img/one@1x.android.png'),
  //     title: 'Huh',
  //   });
  // }
  return tabs;
};


Navigation.startTabBasedApp({
  tabs: createTabs(),
  appStyle: {
    tabBarBackgroundColor: '#ffffff',
    tabBarButtonColor: '#444444',
    tabBarSelectedButtonColor: '#42A5F5'
  },
  drawer: {
    left: {
      screen: 'PetSpot.SideMenu'
    }
  }
});
