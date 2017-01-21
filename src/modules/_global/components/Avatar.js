import React from 'react';
import {
  Image,
} from 'react-native';

const Avatar = (props) => {
    const { style, source } = props;
    return (
      <Image style={[styles.avatar, style]} source={source} />
    );
};

const styles = {
  avatar: {
    height: 45,
    width: 45,
    borderRadius: 30,
    //borderWidth: 2,
    //borderColor: 'yellow',
    margin: 8
  }
};

export { Avatar };
