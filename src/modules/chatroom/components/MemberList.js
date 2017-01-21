import React, { Component } from 'react';
import { ListView } from 'react-native';
import _ from 'lodash';
import { Avatar } from '../../_global/components';

class MemberList extends Component {
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

  createDataSource({ members }) {
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});

    const membersArr = _.map(members, (val, uid) => {
      return { ...val, id: uid };
    });

		const membersDs = ds.cloneWithRows(membersArr);
		this.setState({ dataSource: membersDs });
	}

	renderRow(member) {
		return (
      <Avatar source={{ uri: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fweknowmemes.com%2Fwp-content%2Fuploads%2F2012%2F01%2Fanonymous-mask.jpg&f=1' }} />
    );
	}

	render() {
		return (
			<ListView
        contentContainerStyle={[this.props.style, styles.container]}
				enableEmptySections
				dataSource={this.state.dataSource}
				renderRow={this.renderRow.bind(this)}
        horizontal
			/>
		);
	}
}

const styles = {
  container: {
    //backgroundColor: '#FFFFFF',
  }
};

export { MemberList };
