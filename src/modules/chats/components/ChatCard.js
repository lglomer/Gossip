import React, { Component } from 'react';
import moment from 'moment';
import { Card, CardHeader } from '../../_global/components';

const userPic = require('../../../img/user-default.png');

class ChatCard extends Component {
  render() {
    const { currentChat, lastOnline, isOnline, displayName } = this.props.chat;

    if (isOnline) {
      if (currentChat) {
        return (
          <Card>
            <CardHeader
              title={displayName}
              subtitle={'with some other people'} image={userPic}
              //moment(timestamp).fromNow()
            />
          </Card>
        );
      }

      return (
        <Card>
          <CardHeader
            title={displayName}
            subtitle={`${displayName} is waiting`} image={userPic}
          />
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader
          title={displayName}
          subtitle={`Last seen ${moment(lastOnline).fromNow()}`} image={userPic}
          //moment(timestamp).fromNow()
        />
      </Card>
    );
  }
}

export { ChatCard };
