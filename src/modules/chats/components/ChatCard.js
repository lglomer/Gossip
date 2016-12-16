import React, { Component } from 'react';
import { Text, View } from 'react-native';
import TimeAgo from 'react-native-timeago';
import { Card, CardHeader } from '../../_global/components';

const userPic = require('../../../img/user-default.png');

class ChatCard extends Component {
  renderSubtitle(style) {
    return (
      <View>
        <Text style={style}>
          Last seen <TimeAgo time={this.props.chat.lastOnline} />
        </Text>
      </View>
    );
  }

  render() {
    const { currentChat, lastOnline, isOnline, displayName } = this.props.chat;

    if (isOnline) {
      if (currentChat) {
        return (
          <Card>
            <CardHeader
              title={displayName}
              subtitle={'with some other people'}
              image={userPic}
              //moment(timestamp).fromNow()
            />
          </Card>
        );
      }

      return (
        <Card>
          <CardHeader
            title={displayName}
            subtitle={`${displayName} is spectating`}
            image={userPic}
          />
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader
          title={displayName}
          renderSubtitle={this.renderSubtitle.bind(this)}
          image={userPic}
          //moment(timestamp).fromNow()
        />
      </Card>
    );
  }
}

export { ChatCard };
