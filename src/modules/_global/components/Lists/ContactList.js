/* eslint-disable global-require */
import React, { Component } from 'react';
import { Alert, Platform } from 'react-native';
import { ChatCard, List } from '../';

class ContactList extends Component {
	getDisplayName(contact) {
		const { givenName, familyName } = contact;
		let displayName = '';
		if (Platform.OS === 'android') {
			displayName = givenName;
		} else {
			displayName = `${givenName} ${familyName}`;
		}

		return displayName;
	}

	renderRow(contact) {
		return (
			<ChatCard
				displayName={this.getDisplayName(contact)}
				onPress={() => Alert.alert(`${contact.givenName}`)}
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
