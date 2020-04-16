import React, { Component } from 'react';
import {
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  View,
  ProgressBarAndroid,
  ProgressViewIOS,
  AsyncStorage
} from 'react-native';

import LoginScreen from './LoginScreen';

class StartupScreen extends Component {

  static navigationOptions = {
    drawerLabel: () => null
  }

  constructor(props){
    super(props)
    this.state = { progressValue: 0.00 };
    // global.ip = '192.168.1.120'
    global.ip = '10.211.55.3'
  }  

  async componentDidMount() {
    let value = await AsyncStorage.getItem('userData') 
    let data = JSON.parse(value)     
      if (data !== null) {        
        if (data.type == "Customer"){                   
          this.props.navigation.navigate('Customer')
        } else if (data.type == "Handyman"){
          this.props.navigation.navigate('Handyman')
        } else if (data.type == "Admin"){
          this.props.navigation.navigate('Admin')
        } 
      } else {
        this.timeoutHandle = setTimeout(() => {
          this.props.navigation.navigate('Login')
        }, 2000);
      }    
    // this.startProgress();
  }

  componentWillUnmount() {
    // this.stopProgress();
  }

  startProgress = () => {
    this.value = setInterval(() => {
      if (this.state.progressValue <= 1) {
        this.setState({ progressValue: this.state.progressValue + .05 })
      }
      else
        this.props.navigation.navigate('Login');
    }, 100);
  }

  stopProgress = () => {
    clearInterval(this.value);
  }

  clearProgress = () => {

    this.setState({ progressValue: 0.0 })
  }

  render() {
    return (
      <ImageBackground source={require("../assets/login.jpg")} style={styles.container}>
        {/* {
          (Platform.OS === 'android')
            ?
            (<ProgressBarAndroid
              progress={this.state.progressValue}
              styleAttr="Horizontal"
              indeterminate={false}
              style={styles.progressBarStyle}
              color='black'
            />)
            :
            (<ProgressViewIOS
              progress={this.state.progressValue}
              style={styles.progressBarStyle}
              progressTintColor='black'
            />)
        } */}
        <ActivityIndicator
          style={{alignSelf: 'center', marginTop: '70%'}} 
          color="grey" size="large" />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: "100%",
    paddingTop: 230
  },
  progressBarStyle: {
    width: '80%',
  }
});

export default StartupScreen;
