/* eslint-disable global-require */
import React, { Component } from 'react';
import {
	ListView,
} from 'react-native';
import { ChatCard } from '../';

//const addIcon = require('../../img/ic_add_black_48dp.png');
/*
	<ChatCard
		list={this.props.friendsList}
		onChatPress={this.enterChat.bind(this)}
	/>
*/
class ChatList extends Component {
  constructor(props) {
		super(props);
		this.state = { dataSource: [] };
	}

	componentWillMount() {
		this.createDataSource(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.createDataSource(nextProps);
	}

  createDataSource({ list }) { //props.friends.friends
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		//[{ data: { content: 'cloneMe!' } }]
		const friendsDs = ds.cloneWithRows(list);
		this.setState({ dataSource: friendsDs });
	}

	renderRow(chat) {
		return (
      <ChatCard
        displayName={chat.displayName}
				members={chat.members}
        onPress={() => this.props.onChatPress(chat)}
      />
    );
	}

	render() {
		return (
			<ListView
				enableEmptySections
				style={this.props.style}
				dataSource={this.state.dataSource}
				renderRow={this.renderRow.bind(this)}
			/>
		);
	}
}

export { ChatList };
