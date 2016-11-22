import React, { Component } from 'react';
import {
  Text
} from 'react-native';
import { Card, CardSection, CardHeader } from '../../_global/components';

const userPic = require('../../../img/user-default.png');

class PostCard extends Component {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    //const { data } = this.props;
    const { textStyle } = styles;
    const { content } = this.props.post;
    return (
      <Card>
        <CardHeader title="Omer Lagziel" subtitle="24 minutes ago" image={userPic} />
        <CardSection>
          <Text style={textStyle}>{content}</Text>
        </CardSection>
      </Card>
    );
  }
}

const styles = {
  textStyle: {
    fontSize: 13,
    color: '#333',
    paddingBottom: 100
  }
};

export { PostCard };
