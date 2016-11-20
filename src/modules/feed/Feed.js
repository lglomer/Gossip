/* eslint-disable global-require */
import React, { Component } from 'react';
import {
	View,
	Alert,
} from 'react-native';
import { PostCard } from './components';

class Feed extends Component {
	static navigatorButtons = {
     rightButtons: [
       {
         title: 'Add',
         id: 'add'
       }
     ]
   };

   constructor(props) {
     super(props);
     // if you want to listen on navigator events, set this up
     this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
   }

   onNavigatorEvent(event) {
     if (event.id === 'add') {
       Alert.alert('NavBar', 'Add button pressed');
     }
   }


	render() {
		const { container } = styles;
		return (
      <View style={container}>
				<PostCard />
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: '#f1f1f1'
	}
};

export default Feed;
