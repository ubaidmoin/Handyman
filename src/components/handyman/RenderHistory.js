import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image
} from "react-native";
import { withNavigation } from "react-navigation";

import { Input, Button, Header, Card, CardSection } from "../common";

const RenderHistory = ({ history, navigation }) => {
  const { name, rating, category, bill } = history;

  return (
    <Card>
      <TouchableOpacity>
        <CardSection>
          <View>
            <Image
              style={styles.displayPicStyle}
              source={require("../assets/user.jpg")}
            />
          </View>
          <View style={styles.detailContainer}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>{name}</Text>
              <Text style={{ fontWeight: "bold" }}>Rs.{bill}</Text>
            </View>
            <Text>{rating} ★</Text>
            <Text style={{ fontWeight: "bold" }}>{category}</Text>
            <TouchableOpacity>
              <Text style={{ color: "grey", fontWeight: "bold", fontSize: 15 }}>
                Report a problem
              </Text>
            </TouchableOpacity>
          </View>
        </CardSection>
      </TouchableOpacity>
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
    width: "60%"
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

export default withNavigation(RenderHistory);
