import React, { Component } from 'react';
import {
	View,
	Text
} from 'react-native';

class SideMenu extends Component {
	render() {
		const { menuContainer, menuHeader, menuBody } = styles;
		return (
      <View style={menuContainer}>
				<View style={menuHeader} >
					<Text>Cool stuff goes around here</Text>
				</View>
				<View style={menuBody} >
					<Text>Rock your body</Text>
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

export default SideMenu;
