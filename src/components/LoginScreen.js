import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableOpacity,
  Icon
} from "react-native";

import { Input, Button } from "./common";

class LoginScreen extends Component {
  state = { email: "taimur@gmail.com", password: "asdf" };

  static navigationOptions = {
    headerLeft: null,
    gesturesEnabled: false
  };

  onButtonPress() {
    let url =
      "http://192.168.1.116/HandymanAPI/api/login?email=" +
      this.state.email +
      "&password=" +
      this.state.password;
    /*fetch(url, {
            method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
          .then(response => response.json().then(data => { 
            if(data[0].range == null){
              this.props.navigation.navigate('User', {
                record: data[0]
              })
            }
            else{              
              this.props.navigation.navigate('Handyman', {
                record: data[0]
              })
            }                 
          }))           
          .catch((error) =>{
            alert('Invalid email or password.')
          });*/
    if (this.state.email == "taimur@gmail.com") {
      this.props.navigation.navigate("Handyman", {
        name: "Ubaid"
      });
    }
  }

  onClickListener() {
    this.props.navigation.navigate("Register");
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={{ width: "100%", height: "100%" }}
      >
        <ImageBackground
          source={require("../assets/login.jpg")}
          style={styles.container}
        >
          <View style={styles.inputContainer}>
            <Input
              style={styles.inputs}
              label="Email"
              secureTextEntry={false}
              placeholder="user@gmail.com"
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Input
              style={styles.inputs}
              label="Password"
              placeholder="********"
              secureTextEntry
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button onPress={this.onButtonPress.bind(this)}>Log in</Button>
          </View>

          <TouchableOpacity
            style={styles.textButtonContainer}
            onPress={() => this.onClickListener()}
          >
            <Text>Don't have an account?</Text>
          </TouchableOpacity>
        </ImageBackground>
      </KeyboardAvoidingView>
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
    paddingTop: 250
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "lightgrey",
    borderRadius: 30,
    borderBottomWidth: 1,
    width: "80%",
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "80%",
    borderRadius: 30
  },
  textButtonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "60%",
    borderRadius: 30
  }
});

export default LoginScreen;
