import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as rootActions from '../_global/reducer';
import { Button } from '../_global/components';

class Settings extends Component {
	render() {
		return (
			<Button
				label={'Logout'}
				onPress={() => this.props.logoutUser(this.props.currentUser)}
			/>
		);
	}
}


const mapStateToProps = state => {
  return { currentUser: state.root.currentUser };
};

export default connect(mapStateToProps, rootActions)(Settings);
