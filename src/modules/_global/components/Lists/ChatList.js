/* eslint-disable global-require */
import React, { Component } from 'react';
import { ChatCard, List } from '../';

class ChatList extends Component {
	renderRow(chat) {
		return (
      <ChatCard
        displayName={chat.displayName}
				members={chat.members}
        onPress={() => this.props.onChatPress(chat)}
				unreadNum={chat.unseenNum}
      />
    );
	}

	render() {
		return (
			<List
				list={this.props.list}
				renderRow={this.renderRow.bind(this)}
			/>
		);
	}
}

export { ChatList };
