const Sound = require('react-native-sound');

const sounds = [];
const prepareSound = (path) => {
  sounds[path] = new Sound(path, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
    }
  });
};

function prepareSounds() {
  prepareSound('message_send.wav');
  prepareSound('notification_received.mp3');
  prepareSound('typing_key_press.wav');
  prepareSound('user_left.wav');
}

function playSound(path) {
  sounds[path].play();
}

export default {
  prepareSounds,
  playSound
};
