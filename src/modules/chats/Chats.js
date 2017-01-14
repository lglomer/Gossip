import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, Text } from 'react-native';
import _ from 'lodash';
import * as chatsActions from './reducer';
import { ChatList } from '../_global/components';

class Chats extends Component {
	componentWillMount() {
		this.props.fetchChats();
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
		const { padding, sectionTitle } = styles;
		const { isLoadingChats, chatsEmpty } = this.props;
		if (isLoadingChats || chatsEmpty) {
			return (
				<Text style={[padding, sectionTitle]}>HELLO?</Text>
			);
		}

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

export default connect(mapStateToProps, chatsActions)(Chats);
