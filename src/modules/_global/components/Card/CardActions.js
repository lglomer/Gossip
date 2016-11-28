import React from 'react';
import { View } from 'react-native';
import { CardIcon } from './CardIcon';

const CardActions = () => {
  const { actionsContainer } = styles;
  return (
      <View style={actionsContainer}>
        <CardIcon title="Share" icon="share" />
        <CardIcon title="Like" icon="heart" />
      </View>
  );
};

const styles = {
  actionsContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    marginTop: 20
  }
};

export { CardActions };
