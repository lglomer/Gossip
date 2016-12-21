/* eslint-disable global-require */
import React, { Component } from 'react';
import {
	ListView,
	View,
	Text,
	Alert,
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
			title: 'chat.displayName',
			navigatorStyle: this.props.navigatorStyle,
			animationType: 'slide-up',
		});
	}

	renderRow(chat) {
		return <ChatCard chat={chat} onPress={() => this.enterChat(chat)} />;
	}

	render() {
		const { container } = styles;
		if (this.props.fetchedEmptyList) {
			console.log(this.props.contacts);
			return (
				<Text>Cold Outside</Text>
			);
		}

		return (
				<ListView
						style={container}
						enableEmptySections
						renderScrollComponent={props => <InfiniteScrollView {...props} />}
						dataSource={this.state.dataSource}
						renderRow={this.renderRow.bind(this)}
						canLoadMore={this.props.canLoadMoreChats}
						onLoadMoreAsync={() => this.loadMore()}
				/>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: '#E0E0E0',
	}
};

const mapStateToProps = state => {
  // const chats = _.map(state.chats.posts, (val, uid) => {
  //   return { ...val, uid };
  // });// { chats' states, override posts to an array }

  return { ...state.chats, currentUser: state.root.currentUser };
};

export default connect(mapStateToProps, chatActions)(Chats);
