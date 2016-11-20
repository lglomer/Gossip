import React from 'react';
import {
  View,
} from 'react-native';

const Card = (props) => {
  return (
    <View style={[styles.cardStyle, props.style]}>
      {props.children}
    </View>
  );
};

const styles = {
  cardStyle: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginTop: 7
  }
};

export { Card };
