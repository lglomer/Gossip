import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ListView, Image } from 'react-native';
//import TimeAgo from 'react-native-timeago';

/*
  <ChatCard
    title={chat.displayName}
    onPress={() => this.props.onFriendPress(chat)}
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

  render() {
    const { card, image, imageContainer, titlesContainer } = styles;

    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={card}>
          <View style={imageContainer}>
            <Image style={image} source={{ uri: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fweknowmemes.com%2Fwp-content%2Fuploads%2F2012%2F01%2Fanonymous-mask.jpg&f=1' }} />
          </View>
          <View style={titlesContainer}>
            {this.renderTitle()}
          </View>
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
    paddingTop: 7,
    paddingBottom: 7,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    position: 'relative',
  },
  titlesContainer: {
    justifyContent: 'center'
  },
  title: {
    color: '#424242',
    fontSize: 13,
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
    height: 30,
    width: 30,
    borderRadius: 15
  },
};

export { ChatCard };
