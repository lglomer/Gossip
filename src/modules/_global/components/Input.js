import React from 'react';
import { TextInput, View, Text } from 'react-native';

const Input = (props) => {
  const { inputStyle, labelStyle, containerStyle } = styles;
  const { label, value, onChangeText, style, placeholder, secureTextEntry } = props;

  const renderText = () => {
    if (label && label.length > 0) {
      return <Text style={labelStyle}>{label}</Text>;
    }
  };

  return (
    <View style={[containerStyle, style]}>
      {renderText()}
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        multiline
        autoCorrect={false}
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = {
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 15,
    lineHeight: 23,
    flex: 2,
  },
  labelStyle: {
    fontSize: 16,
    paddingLeft: 20,
    color: '#333',
    flex: 1,
  },
  containerStyle: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  }
};

export { Input };
