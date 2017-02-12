/* eslint-disable global-require */
import React, { Component } from 'react';
import { Alert, Platform } from 'react-native';
import _ from 'lodash';
import { ChatCard, List } from '../';

class ContactList extends Component {
	renderRow(contact) {
		return (
			<ChatCard
				displayName={contact.name}
				onPress={() => Alert.alert(`${contact.number}`)}
			/>
		);
	}

	render() {
		console.log(this.props.contacts);
		return (
			<List
				list={this.props.contacts}
				renderRow={this.renderRow.bind(this)}
			/>
		);
	}
}

export { ContactList };
