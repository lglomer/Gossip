import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import TimeAgo from 'react-native-timeago';
import { Card, CardSection } from '../../_global/components';

const userPic = require('../../../img/user-default.png');

class FriendCard extends Component {
  renderSubtitle() {
    const { isOnline, lastOnline } = this.props.friend;

    if (isOnline) {
      return (
        <Text style={styles.subtitle}>
          Spectating
        </Text>
      );
    }

    return (
      <Text style={styles.subtitle}>
        Last seen <TimeAgo time={lastOnline} />
      </Text>
    );
  }

  render() {
    const { displayName, picURL } = this.props.friend;
    const { cardHeader, title, image, imageContainer, titlesContainer } = styles;

    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Card style={cardHeader}>
          <CardSection>
            <View style={imageContainer}>
              <Image style={image} source={{ uri: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fweknowmemes.com%2Fwp-content%2Fuploads%2F2012%2F01%2Fanonymous-mask.jpg&f=1' }} />
            </View>
            <View style={titlesContainer}>
              <Text style={title}>
                {displayName}
              </Text>
              {this.renderSubtitle()}
            </View>
          </CardSection>
        </Card>
      </TouchableOpacity>
    );
  }
}


const styles = {
  cardHeader: {
    backgroundColor: '#fff',
  },
  titlesContainer: {
    justifyContent: 'center'
  },
  title: {
    color: '#333',
    fontSize: 13,
    marginBottom: -2
  },
  subtitle: {
    color: '#777',
    fontSize: 11
  },
  imageContainer: {
    justifyContent: 'center',
    paddingRight: 7,
  },
  image: {
    height: 30,
    width: 30,
    borderRadius: 15
  },
};

export { FriendCard };
