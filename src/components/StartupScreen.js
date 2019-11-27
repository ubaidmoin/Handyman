import React, { Component } from "react";
import {
  StyleSheet,
  ImageBackground,
  Text,
  View,
  ProgressBarAndroid,
  ProgressViewIOS,
  Platform
} from "react-native";

import LoginScreen from "./LoginScreen";

class StartupScreen extends Component {
  static navigationOptions = {
    drawerLabel: () => null
  };

  state = { progressValue: 0.0 };

  componentDidMount() {
    this.startProgress();
  }

  componentWillUnmount() {
    this.stopProgress();
  }

  startProgress = () => {
    this.value = setInterval(() => {
      if (this.state.progressValue <= 1) {
        this.setState({ progressValue: this.state.progressValue + 0.05 });
      } else this.props.navigation.navigate("Login");
    }, 100);
  };

  stopProgress = () => {
    clearInterval(this.value);
  };

  clearProgress = () => {
    this.setState({ progressValue: 0.0 });
  };

  render() {
    return (
      <ImageBackground
        source={require("../assets/login.jpg")}
        style={styles.container}
      >
        {Platform.OS === "android" ? (
          <ProgressBarAndroid
            progress={this.state.progressValue}
            styleAttr="Horizontal"
            indeterminate={false}
            style={styles.progressBarStyle}
            color="black"
          />
        ) : (
          <ProgressViewIOS
            progress={this.state.progressValue}
            style={styles.progressBarStyle}
            progressTintColor="black"
          />
        )}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingTop: 230
  },
  progressBarStyle: {
    width: "80%"
  }
});

export default StartupScreen;
