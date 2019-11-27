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

const HandymanRequests = ({ handyman }) => {
  const { name, mobileno, status, dob, displayPic } = handyman;

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
          <Text>{mobileno}</Text>
          <Text>DOB: {dob}</Text>
          <Text style={{ fontWeight: "bold" }}>
            Status: {status === "True" ? "True" : "False"}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.approveButtonStyle}
            onPress={() => {}}
          >
            <Text>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.denyButtonStyle} onPress={() => {}}>
            <Text>Deny</Text>
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
    marginTop: 5,
    justifyContent: "flex-start",
    flexDirection: "column",
    width: "25%",
    borderRadius: 5,
    position: "relative"
  },
  approveButtonStyle: {
    flex: 1,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "green",
    backgroundColor: "#11A025",
    alignItems: "center",
    justifyContent: "center"
  },
  denyButtonStyle: {
    flex: 1,
    marginTop: 5,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "red",
    backgroundColor: "#DA1F05",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default HandymanRequests;
