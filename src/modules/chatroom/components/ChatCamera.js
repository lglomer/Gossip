import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import Camera from 'react-native-camera';

export class ChatCamera extends Component {
  constructor(props) {
    super(props);
    this.camera = null;
  }

  render() {
    return (
      <KeyboardAvoidingView behavior={'padding'} style={styles.camera}>
        <Camera
          style={{ flex: 1 }}
          ref={(cam) => {
            this.camera = cam;
          }}
          aspect={Camera.constants.Aspect.fill}
          type={Camera.constants.Type.front}
          flashMode={Camera.constants.FlashMode.off}
        />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  camera: {
    position: 'absolute',
    opacity: 0.4,
    backgroundColor: 'black',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});
