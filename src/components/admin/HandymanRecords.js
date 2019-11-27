import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableOpacity,
  Icon,
  Image
} from "react-native";

import { Input, Button, Header, Card, CardSection } from "../common";

const HandymanRecords = ({ handyman }) => {
  const { name, mobileno, rating, displayPic, blocked } = handyman;

  renderButton = () => {
    if (blocked === "True") {
      return <Text>Unblock</Text>;
    } else {
      return <Text>Block</Text>;
    }
  };

  onClickListener = () => {};
  return (
    <Card>
      <CardSection>
        <View>
          <Image
            style={styles.displayPicStyle}
            source={require("../assets/user.jpg")}
          />
        </View>
        <View style={styles.detailContainer}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{name}</Text>
          <Text>{rating} ★</Text>
          <Text style={{ fontWeight: "bold" }}>{mobileno}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              this.onClickListener();
            }}
          >
            {this.renderButton()}
          </TouchableOpacity>
        </View>
      </CardSection>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: 30
  },
  detailContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    width: "40%"
  },
  displayPicStyle: {
    width: 80,
    height: 80,
    borderRadius: 10
  },
  buttonContainer: {
    marginTop: 20,
    justifyContent: "flex-start",
    flexDirection: "column",
    width: "30%",
    height: 40,
    borderRadius: 30
  },
  buttonStyle: {
    flex: 1,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#0590DA",
    backgroundColor: "#0590DA",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default HandymanRecords;
