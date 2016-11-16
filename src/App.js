/* eslint-disable  global-require */
import {
  Platform
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { registerScreens } from './screens';

registerScreens(); // this is where you register all of your app's screens

// Navigation.startTabBasedApp({
//   tabs: [
//     {
//       label: 'Feed',
//       screen: 'PetSpot.Feed', // this is a registered name for a screen
//       icon: require('../img/one@1x.android.png'),
//       title: 'Feed'
//     },
//     {
//       label: 'Login',
//       screen: 'PetSpot.Login',
//       icon: require('../img/two@2x.png'),
//       selectedIcon: require('../img/two_selected@2x.png'),
//       title: 'Login'
//     }
//   ]
// });


const createTabs = () => {
  const tabs = [
    {
      label: 'Feed',
      screen: 'PetSpot.Feed',
      icon: require('../img/one@1x.android.png'),
      selectedIcon: require('../img/one_selected@2x.png'),
      title: 'Screen One'
    },
    {
      label: 'Login',
      screen: 'PetSpot.Login',
      icon: require('../img/two@2x.png'),
      selectedIcon: require('../img/two_selected@2x.png'),
      title: 'Screen Two',
      navigatorStyle: {
        tabBarBackgroundColor: '#4dbce9',
      }
    }
  ];

  if (Platform.OS === 'android') {
    tabs.push({
      label: 'Collapsing',
      screen: 'PetSpot.CollapsingTopBarScreen',
      icon: require('../img/one@1x.android.png'),
      title: 'Collapsing',
    });
  }
  return tabs;
};


Navigation.startTabBasedApp({
  tabs: createTabs(),
  appStyle: {
    tabBarBackgroundColor: '#0f2362',
    tabBarButtonColor: '#ffffff',
    tabBarSelectedButtonColor: '#63d7cc'
  },
  drawer: {
    left: {
      screen: 'PetSpot.SideMenu'
    }
  }
});
