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
    this.faceMode = affdex.FaceDetectorMode.LARGE_FACES;
    this.detector = new affdex.FrameDetector(this.faceMode);

  }

  componentDidUpdate() {
    console.log("component updated");
    const canvas = this.canvas.current;
    const ctx = canvas.getContext("2d");
    ctx.backgroundColor = 'red';
    ctx.width = 100;
    ctx.height = 100;

    const image = new CanvasImage(canvas);
    image.src = this.state.imgPath;
    // console.log(image.src);
    
    image.addEventListener('load', () => {
      // console.log("image loaded");
      ctx.drawImage(image, 0, 0, ctx.width, ctx.height);
      ctx.getImageData(0, 0, ctx.width, ctx.height).then(imageData => {
        // this.setState({ imgData:  imageData });
        // console.log(imageData);
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
        {/* <Image source={{ uri: this.state.imgPath|| "https://reactnative.dev/img/tiny_logo.png" }}
              style={{width: 50, height: 50}}
              onLoad={this.handleImgLoad.bind(this)}></Image> */}
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  takePicture = async() => {
    // if (this.camera) {
    //   const options = { quality: 0.5, base64: true };
    //   const data = await this.camera.takePictureAsync(options);
    //   console.log(data.uri);
    //   console.log(data.base64);
    //   console.log(Object.keys(data));
    //   this.setState({ imgPath: "data:image/jpg;base64," + data.base64 });
    // }
    this.detector.start();
  };

  handleImgLoad = async() => {
    console.log("loaded");

    // const canvas = this.canvas.current;
    // const ctx = canvas.getContext("2d");
    // ctx.backgroundColor = 'red';
    // ctx.width = 100;
    // ctx.height = 100;

    // const image = new CanvasImage(canvas);
    // image.src = this.state.imgPath;
    // // console.log(image.src);
    
    // image.addEventListener('load', () => {
    //   console.log("image loaded");
    //   ctx.drawImage(image, 0, 0, ctx.width, ctx.height);
    //   ctx.getImageData(0, 0, ctx.width, ctx.height).then(imageData => {
    //     this.setState({ imgData:  imageData });
    //   });
    // });
  }

  loadPicture = (uri, w, h) => {
    this.setState({ imgPath: uri });
    
    // let image = new Image();
    // image.src = uri;
    // image.addEventListener('load', function() {
    //   this.setState({ img: image });
    //   console.log(this.state.img);
    // });
    
  }

  initializeDetector() {
    this.detector.addEventListener("onInitializeSuccess", this.detectorOnInitializeSuccess);
    this.detector.addEventListener("onInitializeFailure", this.detectorOnInitializeFailure);
    /* 
      onImageResults success is called when a frame is processed successfully and receives 3 parameters:
      - Faces: Dictionary of faces in the frame keyed by the face id.
              For each face id, the values of detected emotions, expressions, appearane metrics 
              and coordinates of the feature points
      - image: An imageData object containing the pixel values for the processed frame.
      - timestamp: The timestamp of the captured image in seconds.
    */
    this.detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {});

    /* 
      onImageResults success receives 3 parameters:
      - image: An imageData object containing the pixel values for the processed frame.
      - timestamp: An imageData object contain the pixel values for the processed frame.
      - err_detail: A string contains the encountered exception.
    */
    this.detector.addEventListener("onImageResultsFailure", function (image, timestamp, err_detail) {});
    this.detector.addEventListener("onResetSuccess", function() {});
    this.detector.addEventListener("onResetFailure", function() {});
    this.detector.addEventListener("onStopSuccess", function() {});
    this.detector.addEventListener("onStopFailure", function() {});
    this.detector.detectAllExpressions();
    this.detector.detectAllEmotions();
    this.detector.detectAllEmojis();
    this.detector.detectAllAppearance();
  }

  detectorOnInitializeSuccess() {
    console.log("detector initialize success");
  }

  detectorOnInitializeFailure() {
    console.log("detector initialize FAILURE");
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