/* eslint-disable global-require */
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import * as friendsActions from './reducer';
import { FriendsList } from './components';

//const addIcon = require('../../img/ic_add_black_48dp.png');

class Friends extends Component {
	static navigatorButtons = {
    rightButtons: [{
			title: '+',
			id: 'add'
    }],
  };

	componentWillMount() {
		this.props.fetchFriendsList();
	}

	onNavigatorEvent(event) {
		if (event.id === 'add') {
			this.props.navigator.push({
				screen: 'Gossip.Chatroom',
				title: this.props.currentUser.email,
				navigatorStyle: this.props.navigatorStyle,
				animationType: 'slide-up'
			});
		}
	}

	enterChat(friend) {
		this.props.navigator.push({
			screen: 'Gossip.Chatroom',
			title: friend.displayName,
			navigatorStyle: this.props.navigatorStyle,
			animationType: 'slide-up',
			backButtonHidden: true,
			passProps: {
				friend
			}
		});
	}

	loadMore() {
    this.props.fetchFriendsList();
  }

	render() {
		const { container } = styles;
		if (this.props.fetchedEmptyList) {
			return (
				<View />
			);
		}

		return (
			<FriendsList
				styles={container}
				loadMore={this.loadMore.bind(this)}
				canLoadMore={this.props.canLoadMoreFriends}
				data={this.props.friendsList}
				onFriendPress={this.enterChat.bind(this)}
			/>
		);
	}
}

const styles = {
	container: {
		flex: 1,
	}
};

const mapStateToProps = state => {
  return { ...state.friends, currentUser: state.root.currentUser };
};

export default connect(mapStateToProps, friendsActions)(Friends);
