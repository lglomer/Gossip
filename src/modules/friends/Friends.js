import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import * as friendsActions from './reducer';
import { ChatList, ContactList } from '../_global/components';


class Friends extends Component {
	componentWillMount() {
		this.props.fetchOnlineFriends();
		this.props.fetchContacts();
	}

	enterChatWithUser(user) {
		this.props.navigator.push({
			screen: 'Gossip.Chatroom',
			title: user.displayName,
			passProps: { friend: user }
		});
	}

	render() {
		const { container, bodyContainer } = styles;
		return (
			<ScrollView contentContainerStyle={container}>
				<View style={bodyContainer}>
					<ChatList
						list={this.props.onlineUsers}
						onChatPress={this.enterChatWithUser.bind(this)}
					/>
					<ContactList
						contacts={this.props.contacts}
					/>
				</View>
			</ScrollView>
		);
	}
}

const styles = {
	container: {
		backgroundColor: '#F7F7F7',
		flex: 1,
	},
	bodyContainer: {
		flex: 1,
		flexDirection: 'column',
	},
	padding: {
		paddingRight: 15,
		paddingLeft: 15,
	}
};

const mapStateToProps = state => {
  return { ...state.friends, currentUser: state.root.currentUser };
};

export default connect(mapStateToProps, friendsActions)(Friends);
