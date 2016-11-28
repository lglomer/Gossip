import React, { Component } from 'react';
import {
  Text
} from 'react-native';
import moment from 'moment';
import { Card, CardSection, CardHeader, CardActions } from '../../_global/components';

const userPic = require('../../../img/user-default.png');

class PostCard extends Component {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    //const { data } = this.props;
    const { textStyle } = styles;
    const { content, timestamp } = this.props.post;
    return (
      <Card>
        <CardHeader
          title="John Doe"
          subtitle={moment(timestamp).fromNow()} image={userPic}
        />
        <CardSection>
          <Text style={textStyle}>{content}</Text>
        </CardSection>
        <CardActions />
      </Card>
    );
  }
}

const styles = {
  textStyle: {
    fontSize: 13,
    color: '#333',
  }
};

export { PostCard };
