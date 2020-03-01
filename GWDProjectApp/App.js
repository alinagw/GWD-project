/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';

import { RNCamera } from 'react-native-camera';
import Canvas from 'react-native-canvas';

import affdex from './src/plugins/affdex';

class App extends Component {
  render() {
    return (
      <Canvas ref={this.handleCanvas}/>
      // <View style={styles.container}>
      //   <RNCamera
      //     ref={ref => {
      //       this.camera = ref;
      //     }}
      //     style={styles.preview}
      //     type={RNCamera.Constants.Type.back}
      //     captureAudio={false}
      //   />
      //   <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
      //     <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
      //       <Text style={{ fontSize: 14 }}> SNAP </Text>
      //     </TouchableOpacity>
      //   </View>
      // </View>
    );
  }

  takePicture = async() => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  };

  handleCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'purple';
    ctx.fillRect(0, 0, 100, 100);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

AppRegistry.registerComponent('App', () => ExampleApp);

export default App;