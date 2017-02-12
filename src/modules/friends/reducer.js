import firebase from 'firebase';
import _ from 'lodash';
import { Alert } from 'react-native';
import { parse, format, isValidNumber } from 'libphonenumber-js';

const Contacts = require('react-native-contacts');

const FETCH_ONLINE_FRIENDS_START = 'gossip/friends/FETCH_ONLINE_FRIENDS_START';
const FETCH_ONLINE_FRIENDS_SUCCESS = 'gossip/friends/FETCH_ONLINE_FRIENDS_SUCCESS';
const FETCH_ONLINE_FRIENDS_EMPTY = 'gossip/friends/FETCH_ONLINE_FRIENDS_EMPTY';
const FETCH_CONTACTS = 'gossip/friends/FETCH_CONTACTS';

const initialState = {
	onlineUsers: [],
	isLoadingOnlineUsers: true,
	onlineUsersEmpty: false,
	contacts: []
};

export default function (state = initialState, action) {
	switch (action.type) {
		case FETCH_ONLINE_FRIENDS_START:
			return { ...state, isLoadingOnlineUsers: true, onlineUsersEmpty: false };
		case FETCH_ONLINE_FRIENDS_SUCCESS:
			return {
				...state,
				onlineUsers: action.payload.onlineUsers,
				isLoadingOnlineUsers: false,
				onlineUsersEmpty: false
			};
		case FETCH_ONLINE_FRIENDS_EMPTY:
			return {
				...state,
				onlineUsers: [],
				isLoadingOnlineUsers: false,
				onlineUsersEmpty: true
			};

		case FETCH_CONTACTS:
			return {
				...state,
				contacts: action.payload.contacts
			};

		default:
			return state;
	}
}

export const fetchContacts = () => {
  return (dispatch) => {
		function getPhoneNumber(contact) {
			let number = '';
			let label = '';
			contact.phoneNumbers.forEach((phone) => {
				if (label !== 'mobile' && phone.number !== '') {
					label = phone.label;
					number = phone.number;
				}
			});

			const newPhone = parse(number, 'IL').phone;
			if (isValidNumber(number, 'IL')) {
				return format(newPhone, 'IL', 'International_plaintext');
			}

			return '';
		}

		function getDisplayName(contact) {
			let name = '';

			if (contact.givenName) {
				name += `${contact.givenName} `;
			}
			if (contact.middleName) {
				name += `${contact.middleName} `;
			}

			if (contact.familyName) {
				name += `${contact.familyName}`;
			}

			name = name.trim();

			return name;
		}

		Contacts.getAll((err, contacts) => {
			if (!err) {
				let contactsObj = {};
				contacts.forEach((contact) => {
					if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
						const phone = getPhoneNumber(contact);
						if (phone !== '' && !contactsObj[phone]) {
							contactsObj = {
								...contactsObj,
								[phone]: {
									number: phone,
									name: getDisplayName(contact)
								}
							};
						}
					}
				});

				const contactsArr = _.map(contactsObj, (val) => {
					return val;
				});

				dispatch({
					type: FETCH_CONTACTS,
					payload: { contacts: contactsArr }
				});
			}
		});
	};
};

export const fetchOnlineFriends = () => {
  return (dispatch) => {
	dispatch({ type: FETCH_ONLINE_FRIENDS_START });
	const { currentUser } = firebase.auth();
	const friendsRef = firebase.database().ref(`/userFriends/${currentUser.uid}`);

    friendsRef.orderByChild('isOnline').equalTo(true).on('value', snapshot => {
		if (snapshot.exists()) {
			const onlineUsers = _.map(snapshot.val(), (val, uid) => {
				return { ...val, id: uid };
			});

			dispatch({
				type: FETCH_ONLINE_FRIENDS_SUCCESS,
				payload: { onlineUsers }
			});
		} else {
			dispatch({
				type: FETCH_ONLINE_FRIENDS_EMPTY,
			});
		}
    });
  };
};
