import React from 'react';
import { Text, Image, View } from 'react-native';
import { CardSection } from './CardSection';

const CardHeader = (props) => {
  const { cardHeader, title, subtitle, image, imageContainer, titlesContainer } = styles;
  return (
    <CardSection style={[cardHeader, props.style]}>
      <View style={imageContainer}>
        <Image style={image} source={props.image} />
      </View>
      <View style={titlesContainer}>
        <Text style={title}>
          {props.title}
        </Text>
        <Text style={subtitle}>
          {props.subtitle}
        </Text>
      </View>
    </CardSection>
  );
};

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

export { CardHeader };
