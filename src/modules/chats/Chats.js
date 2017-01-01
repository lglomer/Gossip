import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, Text } from 'react-native';
import * as chatsActions from './reducer';
import { ChatList } from '../_global/components';

class Drawer extends Component {
	componentWillMount() {
		this.props.fetchOnlineFriends();
		this.props.fetchAvailableChats();
		this.props.fetchCurrentChats();
	}

	enterChatWithUser(user) {
		this.props.navigator.push({
			screen: 'Gossip.Chatroom',
			title: user.displayName,
			passProps: { friend: user, isJoined: false }
		});
	}

	enterExistingChat(chat) {
		this.props.navigator.push({
			screen: 'Gossip.Chatroom',
			title: chat.id,
			passProps: { chat, chatId: chat.id, isJoined: true }
		});
	}

	joinChat(chat) {
		this.props.navigator.push({
			screen: 'Gossip.Chatroom',
			title: chat.id,
			passProps: { chat, chatId: chat.id, isJoined: false }
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
		const { container, padding, bodyContainer, section } = styles;
		return (
      <ScrollView contentContainerStyle={container}>
				<View style={bodyContainer}>
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
  return { ...state.chats, currentUser: state.root.currentUser };
};

export default connect(mapStateToProps, chatsActions)(Drawer);
