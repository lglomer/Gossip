import React, { Component } from 'react';
import {
  Text
} from 'react-native';
import { Card, CardSection, CardHeader } from '../../_global/components';

class PostCard extends Component {
  render() {
    //const {profilePic} = this.props.data;
    return (
      <Card>
        <CardHeader
          image={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }}
          title="Omer Lagziel"
          subtitle="3 minutes ago"
        />
        <CardSection style={{ marginLeft: 35 }}>
          <Text>This is some awesome text</Text>
        </CardSection>
      </Card>
    );
  }
}

export { PostCard };
