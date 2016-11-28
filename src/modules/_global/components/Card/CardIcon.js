import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CardIcon = (props) => {
  const { actionContainer, iconStyle } = styles;
  return (
      <TouchableOpacity style={actionContainer}>
        <Icon style={iconStyle} name={props.icon} size={13} color="#999" />
        <Text style={{ color: '#666', fontWeight: 'bold', fontSize: 12 }}>{props.title}</Text>
      </TouchableOpacity>
  );
};

const styles = {
  actionContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
  },
  iconStyle: {
    marginRight: 4
  }
};

export { CardIcon };
