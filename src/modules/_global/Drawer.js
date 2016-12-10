import React, { Component } from 'react';
import {
	View,
	Text
} from 'react-native';
import firebase from 'firebase';
import { Button } from './components';

class Drawer extends Component {
	logout() {
		this.props.logoutUser();
		// const userRef = firebase.database().ref(`/users/${currentUser.uid}`);
		//
		// userRef.update({
		// 	isOnline: false,
		// 	lastOnline: firebase.database.ServerValue.TIMESTAMP
		// });
	}

	render() {
		const { menuContainer, menuHeader, menuBody } = styles;
		return (
      <View style={menuContainer}>
				<View style={menuHeader} >
					<Text>Cool stuff goes around here</Text>
				</View>
				<View style={menuBody}>
					<Button onPress={() => { this.logout(); }} label="Logout" />
				</View>
			</View>
		);
	}
}

const styles = {
	menuContainer: {
		backgroundColor: '#ffffff',
		flexDirection: 'column',
		flex: 1
	},
	menuHeader: {
		backgroundColor: 'steelblue',
		flex: 3
	},
	menuBody: {
		backgroundColor: '#ffffff',
		flex: 7
	},
};

export default Drawer;
