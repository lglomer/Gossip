import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, Text } from 'react-native';
import * as friendsActions from './reducer';
import { ChatList } from '../_global/components';

class Friends extends Component {
	componentWillMount() {
		this.props.fetchOnlineFriends();
	}

	enterChatWithUser(user) {
		this.props.navigator.push({
			screen: 'Gossip.Chatroom',
			title: user.displayName,
			passProps: { friend: user }
		});
	}

	renderOnlineUsers() {
		const { padding, sectionTitle } = styles;
		const { isLoadingOnlineUsers, onlineUsersEmpty } = this.props;
		if (isLoadingOnlineUsers || onlineUsersEmpty) {
			return (
				<Text style={[padding, sectionTitle]}>ONLINE USERS</Text>
			);
		}

		return (
			<View>
				<Text style={[padding, sectionTitle]}>ONLINE USERS</Text>
				<ChatList
					list={this.props.onlineUsers}
					onChatPress={this.enterChatWithUser.bind(this)}
				/>
			</View>
		);
	}

	render() {
		const { container, bodyContainer, section } = styles;
		return (
			<ScrollView contentContainerStyle={container}>
				<View style={bodyContainer}>
					<View style={section}>
						{this.renderOnlineUsers()}
					</View>
				</View>
			</ScrollView>
		);
	}
}

const styles = {
	container: {
		backgroundColor: '#EEEEEE',
		flex: 1,
	},
	bodyContainer: {
		flex: 1,
		flexDirection: 'column',
	},
	padding: {
		paddingRight: 15,
		paddingLeft: 15,
	},
	section: {
		paddingBottom: 10,
		paddingTop: 10
	},
	sectionTitle: {
		color: '#424242',
		fontWeight: '500',
		fontSize: 13,
	}
};

const mapStateToProps = state => {
  return { ...state.friends, currentUser: state.root.currentUser };
};

export default connect(mapStateToProps, friendsActions)(Friends);
