/* eslint-disable global-require */
import React, { Component } from 'react';
import {
	ListView,
	Alert
} from 'react-native';
import { connect } from 'react-redux';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import _ from 'lodash';
import * as feedActions from './reducer';
import { PostCard } from './components';

const addIcon = require('../../img/ic_add_black_48dp.png');

class Feed extends Component {
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
		this.props.fetchPosts(0, true);
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

	createDataSource({ posts }) { //props.posts
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		//[{ data: { content: 'cloneMe!' } }]
		const postsDs = ds.cloneWithRows(posts);
		this.setState({ dataSource: postsDs });
	}

	loadMore() {
    this.props.fetchPosts();
  }

	renderRow(post) {
		return <PostCard post={post} />;
	}

	render() {
		const { container } = styles;
		return (
			<ListView
					style={container}
					enableEmptySections
					renderScrollComponent={props => <InfiniteScrollView {...props} />}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow}
					canLoadMore={this.props.canLoadMorePosts}
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
  const posts = _.map(state.feed.posts, (val, uid) => {
    return { ...val, uid };
  });

  return { ...state.feed, posts }; // { feed's states, override posts to an array }
};

export default connect(mapStateToProps, feedActions)(Feed);
