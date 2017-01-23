/* eslint-disable global-require */
import React, { Component } from 'react';
import {
	ListView
} from 'react-native';

/*
	<List
		list={this.props.friendsList}
		renderRow={this.enterChat.bind(this)}
	/>
*/

class List extends Component {
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

  createDataSource({ list }) {
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		//[{ data: { content: 'cloneMe!' } }]
		const listDs = ds.cloneWithRows(list);
		this.setState({ dataSource: listDs });
	}

	render() {
		return (
			<ListView
				enableEmptySections
				style={this.props.style}
				dataSource={this.state.dataSource}
				renderRow={this.props.renderRow.bind(this)}
			/>
		);
	}
}

export { List };
