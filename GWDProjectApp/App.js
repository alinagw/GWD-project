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
  TouchableOpacity,
  Image
} from 'react-native';

import { RNCamera } from 'react-native-camera';
import Canvas, { Image as CanvasImage, ImageData } from 'react-native-canvas';

import affdex from './src/plugins/affdex';

class App extends Component {

  constructor() {
    super();
    this.canvas = React.createRef();
    this.state = {
      imgPath: "",
      imgData: null
    }
  }

  componentDidUpdate() {
    const canvas = this.canvas.current;
    const ctx = canvas.getContext("2d");
    ctx.width = 100;
    ctx.height = 100;

    const image = new CanvasImage(canvas);
    image.src = this.state.imgPath;
    
    image.addEventListener('load', () => {
      console.log("yeet");
      ctx.drawImage(image, 0, 0, ctx.width, ctx.height);
      ctx.getImageData(0, 0, ctx.width, ctx.height).then(imageData => {
        this.setState({ imgData:  imageData });
      });
    });
  }

  render() {
    return (
      // <Canvas ref={this.handleCanvas}/>
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          captureAudio={false}
        />
        <Canvas ref={this.canvas}/>
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  takePicture = async() => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      this.loadPicture(data.uri);
    }
  };

  handleImgLoad() {

  }

  loadPicture = (uri, w, h) => {
    this.setState({ imgPath: uri.substring(8) });
    
    // let image = new Image();
    // image.src = uri;
    // image.addEventListener('load', function() {
    //   this.setState({ img: image });
    //   console.log(this.state.img);
    // });
    
  }

  handleCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.width = 100;
    ctx.height = 100;
    ctx.fillStyle = 'purple';
    ctx.fillRect(0, 0, 100, 100);

    const image = new CanvasImage(canvas);
    image.src = this.state.imgPath;

    image.addEventListener('load', () => {
      console.log("yeet");
      ctx.drawImage(image, 0, 0, ctx.width, ctx.height);
      ctx.getImageData(0, 0, ctx.width, ctx.height).then(imageData => {
        console.log(imageData);
        this.setState({ imgData:  imageData });
      });
    });
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