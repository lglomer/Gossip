import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import * as rootActions from '../_global/reducer';
import * as drawerActions from './reducer';
import { Button } from '../_global/components';
import { ChatList } from './components';

class Drawer extends Component {
	componentWillMount() {
		this.props.fetchOnlineFriends();
		this.props.fetchAvailableChats();
		this.props.fetchCurrentChats();
	}

	closeDrawer() {
		this.props.navigator.toggleDrawer({ side: 'left' });
	}

	enterChatWithUser(user) {
		this.props.navigator.resetTo({
			screen: 'Gossip.Chatroom',
			title: user.displayName,
			passProps: { friend: user, isJoined: false }
		});
		this.closeDrawer();
	}

	enterExistingChat(chat) {
		this.props.navigator.resetTo({
			screen: 'Gossip.Chatroom',
			title: chat.id,
			passProps: { chat, chatId: chat.id, isJoined: true }
		});
		this.closeDrawer();
	}

	joinChat(chat) {
		this.props.navigator.resetTo({
			screen: 'Gossip.Chatroom',
			title: chat.id,
			passProps: { chat, chatId: chat.id, isJoined: false }
		});
		this.closeDrawer();
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

	renderAvailableChats() {
		const { padding, sectionTitle } = styles;
		const { isLoadingAvailableChats, availableChatsEmpty } = this.props;
		if (isLoadingAvailableChats || availableChatsEmpty) {
			return (
				<Text style={[padding, sectionTitle]}>AVAILABLE CHATS</Text>
			);
		}

		return (
			<View>
				<Text style={[padding, sectionTitle]}>AVAILABLE CHATS</Text>
				<ChatList
					list={this.props.availableChats}
					onChatPress={this.joinChat.bind(this)}
				/>
			</View>
		);
	}

	renderCurrentChats() {
		const { padding, sectionTitle } = styles;
		const { isLoadingCurrentChats, currentChatsEmpty } = this.props;
		if (isLoadingCurrentChats || currentChatsEmpty) {
			return (
				<Text style={[padding, sectionTitle]}>CURRENT CHATS</Text>
			);
		}

		return (
			<View>
				<Text style={[padding, sectionTitle]}>CURRENT CHATS</Text>
				<ChatList
					list={this.props.currentChats}
					onChatPress={this.enterExistingChat.bind(this)}
				/>
			</View>
		);
	}

	render() {
		const { container, padding, headContainer, bodyContainer, section, headTitle } = styles;
		return (
      <ScrollView contentContainerStyle={container}>
				<View style={bodyContainer}>
					<View style={headContainer}>
						<Text style={[headTitle, padding]}>Home</Text>
					</View>
					<View style={section}>
						{this.renderCurrentChats()}
					</View>
					<View style={section}>
						{this.renderAvailableChats()}
					</View>
					<View style={section}>
						{this.renderOnlineUsers()}
					</View>
				</View>
				<View>
					<Button onPress={this.props.logoutUser.bind(this)} type="wide" label="Logout" />
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
		paddingBottom: 15
	},
	sectionTitle: {
		color: '#424242',
		fontWeight: '500',
		fontSize: 13,
	},
	headContainer: {
		height: 56,
		flexDirection: 'column',
		justifyContent: 'space-around',
	},
	headTitle: {
		color: '#212121',
		fontWeight: '500',
		fontSize: 21
	}
};

const mapStateToProps = state => {
  return { ...state.drawer, currentUser: state.root.currentUser };
};

export default connect(mapStateToProps, { ...rootActions, ...drawerActions })(Drawer);