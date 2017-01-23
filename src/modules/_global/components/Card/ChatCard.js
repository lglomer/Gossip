import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ListView, Image } from 'react-native';
//import TimeAgo from 'react-native-timeago';

/*
  <ChatCard
    title={chat.displayName}
    members={}
    onPress={() => this.props.onFriendPress(chat)}
    unreadNum=4
  />
*/
class ChatCard extends Component {
  renderTitle() {
    const { displayName, members } = this.props;
    if (displayName) {
      return (
        <Text style={styles.title}>
          {displayName}
        </Text>
      );
    }

    const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		//[{ data: { content: 'cloneMe!' } }]
		const membersDs = ds.cloneWithRows(members);

    return (
      <ListView
        enableEmptySections
        dataSource={membersDs}
        renderRow={(member) => <Text style={styles.title}>{member.displayName}</Text>}
      />
    );
  }

  renderBadge() {
    if (this.props.unreadNum && this.props.unreadNum !== 0) {
      return (
        <View style={styles.rightPart}>
          <View style={styles.badge}>
            <Text>{this.props.unreadNum}</Text>
          </View>
        </View>
      );
    }

    return null;
  }

  render() {
    const { card, image, imageContainer, leftPart, titlesContainer } = styles;

    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={card}>
          <View style={leftPart}>
            <View style={imageContainer}>
              <Image style={image} source={{ uri: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fweknowmemes.com%2Fwp-content%2Fuploads%2F2012%2F01%2Fanonymous-mask.jpg&f=1' }} />
            </View>
            <View style={titlesContainer}>
              {this.renderTitle()}
            </View>
          </View>
          {this.renderBadge()}
        </View>
      </TouchableOpacity>
    );
  }
}


const styles = {
  card: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    position: 'relative',
    flexDirection: 'row',
    marginBottom: 5,
    marginTop: 5
  },
  leftPart: {
    flex: 1,
    paddingTop: 7,
    paddingBottom: 7,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  rightPart: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titlesContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  title: {
    color: '#424242',
    fontSize: 14,
    //fontWeight: '500'
  },
  subtitle: {
    color: '#757575',
    fontSize: 11,
    marginTop: -2
  },
  imageContainer: {
    justifyContent: 'center',
    paddingRight: 7,
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  badge: {
    backgroundColor: '#ffc107',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    paddingRight: 11,
    paddingLeft: 11,
    borderRadius: 11,
  }
};

export { ChatCard };
