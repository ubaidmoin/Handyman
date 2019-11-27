import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput
} from "react-native";

import { Input, Button } from "../common";

class ReportProblem extends Component {
  static navigationOptions = {
    title: "Report a Problem"
  };
  state = { title: "", description: "" };

  onButtonPress() {}

  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={{ width: "100%", height: "60%" }}
      >
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={{ fontSize: 15 }}>Title</Text>
            <TextInput
              style={{ height: "75%", fontSize: 15 }}
              placeholder="Description"
              secureTextEntry={false}
              value={this.state.description}
              onChangeText={description => this.setState({ description })}
              autoCapitalize="none"
              multiline={true}
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputDescripContainer}>
            <Text style={{ fontSize: 15 }}>Description</Text>
            <TextInput
              style={{ height: "90%", fontSize: 15 }}
              placeholder="Description"
              secureTextEntry={false}
              value={this.state.description}
              onChangeText={description => this.setState({ description })}
              autoCapitalize="none"
              multiline={true}
              autoCorrect={false}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button onPress={this.onButtonPress.bind(this)}>Submit</Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
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
  inputDescripContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "lightgrey",
    borderRadius: 30,
    borderBottomWidth: 1,
    width: "80%",
    height: "50%",
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

export default ReportProblem;
