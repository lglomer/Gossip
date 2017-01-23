import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import _ from 'lodash';
import * as chatsActions from './reducer';
import { ChatList } from '../_global/components';

class Chats extends Component {
	static navigatorStyle = {
		navBarBackgroundColor: '#FFFFFF',
		drawUnderTabBar: true
	}

	// static navigatorButtons = {
	// 	rightButtons: [
	// 		{
	// 			title: 'Settings',
	// 			id: 'settings'
	// 		}
	// 	]
	// };
	//
	// constructor(props) {
	// 	super(props);
	// 	// if you want to listen on navigator events, set this up
	// 	this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
	// }

	componentWillMount() {
		this.props.fetchChats();
	}

	// onNavigatorEvent(event) {
	// 	if (event.id === 'settings') {
	// 		this.props.navigator.push({
	// 			screen: 'Gossip.Settings',
	// 			title: 'Settings'
	// 		});
	// 	}
	// }


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

	render() {
		const { container, bodyContainer, section } = styles;
		return (
			<ScrollView contentContainerStyle={container}>
				<View style={bodyContainer}>
					<View style={section}>
						<ChatList
							list={this.props.chats}
							onChatPress={this.enterChat.bind(this)}
						/>
					</View>
				</View>
			</ScrollView>
		);
	}
}

const styles = {
	container: {
		backgroundColor: '#F7F7F7',
		flex: 1,
		paddingBottom: 50
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
