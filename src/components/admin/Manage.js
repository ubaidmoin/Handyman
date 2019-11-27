import React, { Component } from "react";
import {
  Modal,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView
} from "react-native";

import { Input, Button, Header, Card, CardSection } from "../common";
import HandymanRequests from "./HandymanRequests";
import HandymanRecords from "./HandymanRecords";

class Manage extends Component {
  state = {
    email: "",
    password: "",
    newReqs: [],
    newReqPage: true,
    allRecords: []
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentDidMount() {
    fetch("http://192.168.1.121/Handyman/api/handyman?status=0", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response =>
        response.json().then(data => {
          this.setState({
            newReqs: data
          });
        })
      )
      .catch(error => {
        console.warn(error);
      });

    fetch("http://192.168.43.41/Handyman/api/handyman?status=0")
      .then(response =>
        response.json().then(data => {
          this.setState({
            allRecords: data
          });
        })
      )
      .catch(error => {
        console.warn(error);
      });

    fetch("http://192.168.43.41/Handyman/api/handyman?status=1", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response =>
        response.json().then(data => {
          this.setState({
            allRecords: data
          });
        })
      )
      .catch(error => {
        console.warn(error);
      });
  }

  renderTitle() {
    if (this.state.newReqPage) {
      return (
        <Text
          style={{
            marginTop: 20,
            marginLeft: 15,
            fontWeight: "bold",
            fontSize: 30
          }}
        >
          New Requests
        </Text>
      );
    } else {
      return (
        <Text
          style={{
            marginTop: 20,
            marginLeft: 15,
            fontWeight: "bold",
            fontSize: 30
          }}
        >
          Handyman
        </Text>
      );
    }
  }

  renderRequests() {
    return this.state.newReqs.map(newReqs => (
      <HandymanRequests key={newReqs.name} handyman={newReqs} />
    ));
  }

  renderRecords() {
    return this.state.allRecords.map(allRecords => (
      <HandymanRecords key={allRecords.name} handyman={allRecords} />
    ));
  }

  renderElements() {
    if (this.state.newReqPage) {
      return this.renderRequests();
    } else {
      return this.renderRecords();
    }
  }
  render() {
    return (
      <ImageBackground
        source={require("../assets/login.jpg")}
        style={{ width: "100%", height: "100%" }}
      >
        <Header headerText="Manage Panel" />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.buttonStyle,
              this.state.newReqPage ? { backgroundColor: "black" } : {}
            ]}
            onPress={() => {
              this.setState({
                newReqPage: true
              });
            }}
          >
            <Text style={this.state.newReqPage ? { color: "white" } : {}}>
              New requests
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonStyle,
              ,
              this.state.newReqPage ? {} : { backgroundColor: "black" }
            ]}
            onPress={() => {
              this.setState({
                newReqPage: false
              });
            }}
          >
            <Text style={this.state.newReqPage ? {} : { color: "white" }}>
              Handyman
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {this.renderTitle()}
          {this.renderElements()}
        </ScrollView>
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
    height: "100%"
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
    marginTop: 30,
    marginBottom: 5,
    marginLeft: 15,
    height: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    borderRadius: 30
  },
  buttonStyle: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0E1E1",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E0E1E1",
    marginRight: 10
  }
});

export default Manage;
