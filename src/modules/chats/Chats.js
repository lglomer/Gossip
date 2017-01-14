import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import _ from 'lodash';
import * as chatsActions from './reducer';
import { ChatList } from '../_global/components';

class Chats extends Component {
	static navigatorStyle = {
		navBarBackgroundColor: '#FFFFFF',
	}

	static navigatorButtons = {
		rightButtons: [
			{
				title: 'Settings',
				id: 'settings',
			}
		]
	}
	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
	}

	componentWillMount() {
		this.props.fetchChats();
	}

	onNavigatorEvent(event) {
		if (event.id === 'settings') {
			this.props.navigator.push({
				screen: 'Gossip.Settings',
				title: 'Settings'
			});
		}
	}

	enterChat(chat) {
		let title = '';
		_.map(chat.members, (val) => {
			title += `${val.displayName}, `;
		});

		title = title.substring(0, title.length - 2);

		this.props.navigator.push({
			screen: 'Gossip.Chatroom',
			title,
			passProps: { chatToEnter: chat }
		});
	}

	renderChats() {
		return (
			<ChatList
				list={this.props.chats}
				onChatPress={this.enterChat.bind(this)}
			/>
		);
	}

	render() {
		const { container, bodyContainer, section } = styles;
		return (
			<ScrollView contentContainerStyle={container}>
				<View style={bodyContainer}>
					<View style={section}>
						{this.renderChats()}
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
	section: {
		paddingBottom: 10,
		paddingTop: 10
	},
};

const mapStateToProps = state => {
  return { ...state.chats, currentUser: state.root.currentUser };
};

export default connect(mapStateToProps, chatsActions)(Chats);
