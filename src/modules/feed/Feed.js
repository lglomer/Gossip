/* eslint-disable global-require */
import React, { Component } from 'react';
import {
	ListView
} from 'react-native';
import { connect } from 'react-redux';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import _ from 'lodash';
import * as feedActions from './reducer';
import { PostCard } from './components';

class Feed extends Component {
	constructor() {
		super();
		this.state = { dataSource: [] };
	}
	componentWillMount() {
		this.props.fetchPosts(0, true);
		this.createDataSource(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.createDataSource(nextProps);
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
    this.props.fetchPosts(0, true);
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
		backgroundColor: '#f1f1f1'
	}
};

const mapStateToProps = state => {
  const posts = _.map(state.feed.posts, (val, uid) => {
    return { ...val, uid };
  });

  return { ...state.feed, posts }; // { feed's states, override posts to an array }
};

export default connect(mapStateToProps, feedActions)(Feed);
