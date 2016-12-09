import React, { Component } from 'react';
// import moment from 'moment';
import { Card, CardHeader } from '../../_global/components';

const userPic = require('../../../img/user-default.png');

class ChatCard extends Component {
  render() {
    const { title } = this.props.chat;
    return (
      <Card>
        <CardHeader
          title={title}
          subtitle="Kohav and Doron are gossiping" image={userPic}
          //moment(timestamp).fromNow()
        />
      </Card>
    );
  }
}

export { ChatCard };
