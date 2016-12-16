import React, { Component } from 'react';
import {
	View,
	Text
} from 'react-native';
import { connect } from 'react-redux';
import * as rootActions from './reducer';
import { Button } from './components';

class Drawer extends Component {

	render() {
		const { menuContainer, menuHeader, menuBody } = styles;
		return (
      <View style={menuContainer}>
				<View style={menuHeader} >
					<Text>{this.props.currentUser.uid}</Text>
				</View>
				<View style={menuBody}>
					<Button onPress={this.props.logoutUser.bind(this)} label="Logout" />
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
		backgroundColor: '#BDBDBD',
		flex: 3
	},
	menuBody: {
		backgroundColor: '#ffffff',
		flex: 7
	},
};

const mapStateToProps = state => {
  return { ...state.root };
};

export default connect(mapStateToProps, rootActions)(Drawer);
