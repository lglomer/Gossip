/* eslint-disable global-require */
import React, { Component } from 'react';
import {
	ListView,
	View,
	Text,
} from 'react-native';
import { connect } from 'react-redux';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import * as chatActions from './reducer';
import { ChatCard } from './components';

const addIcon = require('../../img/ic_add_black_48dp.png');

class Chats extends Component {
	static navigatorButtons = {
    rightButtons: [{
      icon: addIcon,
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
			this.props.navigator.showModal({
				screen: 'PetSpot.Publish',
				title: 'New post',
				// navigatorStyle: {
				// 	navBarButtonColor: '#007aff',
				// },
				navigatorButtons: {},
				appStyle: {
					//tabBarBackgroundColor: '#ffffff',
					//tabBarSelectedButtonColor: '#42A5F5',
					statusBarColor: '#009688'
				},
				animationType: 'slide-up'
			});
		}
	}

	createDataSource({ chats }) { //props.posts
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		//[{ data: { content: 'cloneMe!' } }]
		console.log(chats);
		const chatsDs = ds.cloneWithRows(chats);
		this.setState({ dataSource: chatsDs });
	}

	loadMore() {
    this.props.fetchChatList();
  }

	renderRow(chat) {
		return <ChatCard chat={chat} />;
	}

	render() {
		const { container } = styles;
		if (this.props.fetchedEmptyList) {
			return (
				<View style={container}>
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<Text>Hey, where is everybody?</Text>
					</View>
					<View style={{ flex: 1 }} />
				</View>
			);
		}

		return (
				<ListView
						style={container}
						enableEmptySections
						renderScrollComponent={props => <InfiniteScrollView {...props} />}
						dataSource={this.state.dataSource}
						renderRow={this.renderRow}
						canLoadMore={this.props.canLoadMoreChats}
						onLoadMoreAsync={() => this.loadMore()}
				/>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: '#f1f1f1',
	}
};

const mapStateToProps = state => {
  // const chats = _.map(state.chats.posts, (val, uid) => {
  //   return { ...val, uid };
  // });// { chats' states, override posts to an array }

  return { ...state.chats };
};

export default connect(mapStateToProps, chatActions)(Chats);
