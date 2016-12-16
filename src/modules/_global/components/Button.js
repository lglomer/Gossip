import React from 'react';
import {
  TouchableOpacity,
  Text
} from 'react-native';

/*
  ## EXAMPLE:
  <Button
    label="click me"
    onPress={() => doSomething()}
    type="wide" /> // optional
*/

const getStyle = (type) => {
  switch (type) {
    case 'wide':
      return styles.buttonWide;
    default:
      return styles.buttonSmall;
  }
};

const Button = (props) => {
    const { style, onPress, label, type } = props;
    return (
      <TouchableOpacity style={[styles.button, style, getStyle(type)]} onPress={onPress}>
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    );
};

const styles = {
  button: {
    paddingRight: 22,
    paddingLeft: 22,
    paddingTop: 10,
    paddingBottom: 10,
    //flex: 1,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },

  buttonSmall: {
    backgroundColor: '#FDD835',
    borderRadius: 25,
    borderWidth: 0,
    borderColor: '#fff'
  },

  buttonWide: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#f9f9f9'
  }
};

export { Button };
