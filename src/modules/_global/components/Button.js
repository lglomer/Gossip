import React from 'react';
import {
  TouchableOpacity,
  Text
} from 'react-native';

const Button = (props) => {
    const { style, onPress, label } = props;
    return (
      <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    );
};

const styles = {
  button: {
    backgroundColor: '#3F51B5',
    flex: 1,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 7,
    marginTop: 7,
    color: '#fff',
  }
};

export { Button };
