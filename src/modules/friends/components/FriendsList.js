/* eslint-disable global-require */
import React, { Component } from 'react';
import {
	ListView,
	Text,
} from 'react-native';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import { FriendCard } from './';

//const addIcon = require('../../img/ic_add_black_48dp.png');

class FriendsList extends Component {
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

  createDataSource({ data }) { //props.friends.friends
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		//[{ data: { content: 'cloneMe!' } }]
		const friendsDs = ds.cloneWithRows(data);
		this.setState({ dataSource: friendsDs });
	}

	renderRow(friend) {
		return <FriendCard friend={friend} onPress={() => this.props.onFriendPress(friend)} />;
	}

	render() {
		if (this.props.fetchedEmptyList) {
			return (
				<Text>Cold Outside</Text>
			);
		}

		return (
				<ListView
						style={this.props.style}
						enableEmptySections
						renderScrollComponent={props => <InfiniteScrollView {...props} />}
						dataSource={this.state.dataSource}
						renderRow={this.renderRow.bind(this)}
						canLoadMore={this.props.canLoadMoreFriends}
						onLoadMoreAsync={() => this.props.loadMore()}
				/>
		);
	}
}

export { FriendsList };
