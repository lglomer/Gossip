/* eslint-disable global-require */
import React, { Component } from 'react';
import {
	ListView,
	Text,
	View
} from 'react-native';
import { connect } from 'react-redux';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import * as chatActions from './reducer';
import { ChatCard } from './components';

//const addIcon = require('../../img/ic_add_black_48dp.png');

class Chats extends Component {
	static navigatorButtons = {
    rightButtons: [{
      //icon: addIcon,
			title: 'START A CHAT',
			id: 'add'
    }]
  };
	constructor(props) {
		super(props);
		this.state = { dataSource: [] };
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
	}

	componentWillMount() {
		this.props.fetchChatList();
		this.createDataSource(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.createDataSource(nextProps);
	}

	onNavigatorEvent(event) {
		if (event.id === 'add') {
			this.props.navigator.push({
				screen: 'Gossip.Chatroom',
				title: this.props.currentUser.email,
				navigatorStyle: this.props.navigatorStyle,
				animationType: 'slide-up'
			});
		}
	}

	createDataSource({ chats }) { //props.posts
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		//[{ data: { content: 'cloneMe!' } }]
		const chatsDs = ds.cloneWithRows(chats);
		this.setState({ dataSource: chatsDs });
	}

	loadMore() {
    this.props.fetchChatList();
  }

	enterChat(chat) {
		this.props.navigator.push({
			screen: 'Gossip.Chatroom',
			title: 'Chatroom',
			navigatorStyle: this.props.navigatorStyle,
			animationType: 'slide-up',
			passProps: { chat }
		});
	}

	renderRow(chat) {
		return <ChatCard chat={chat} onPress={() => this.enterChat(chat)} />;
	}

	renderListScreen() {
		return (
			<ListView
					style={styles.container}
					enableEmptySections
					renderScrollComponent={props => <InfiniteScrollView {...props} />}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow.bind(this)}
					canLoadMore={this.props.canLoadMoreChats}
					onLoadMoreAsync={() => this.loadMore()}
			/>
		);
	}

	renderEmptyListScreen() {
		const { headMessage, container, centerChildren } = styles;
		return (
			<View style={[container, centerChildren]}>
				<Text style={headMessage}>{'Looks like you\'re the hottest person in the room!'}</Text>
			</View>
		);
	}

	renderLoadingScreen() {
		const { headMessage, container, centerChildren } = styles;
		return (
			<View style={[container, centerChildren]}>
				<Text style={headMessage}>{'Looking for awesome people...'}</Text>
			</View>
		);
	}

	render() {
		switch (this.props.fetchedEmptyList) {
			case true:
				return this.renderEmptyListScreen();
			case false:
				return this.renderListScreen();
			default:
				return this.renderLoadingScreen();
		}
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: '#E0E0E0',
	},
	centerChildren: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 40
	},
	headMessage: {
		fontSize: 18,
		fontWeight: '500',
		textAlign: 'center',
		color: '#444'
	}
};

const mapStateToProps = state => {
  // const chats = _.map(state.chats.posts, (val, uid) => {
  //   return { ...val, uid };
  // });// { chats' states, override posts to an array }
  return { ...state.chats, currentUser: state.root.currentUser };
};

export default connect(mapStateToProps, chatActions)(Chats);
