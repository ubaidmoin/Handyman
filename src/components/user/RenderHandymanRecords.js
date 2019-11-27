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
import { withNavigation } from "react-navigation";
import * as geolib from "geolib";

import { Input, Button, Header, Card, CardSection } from "../common";

const calculateDistance = (lat, long, coords) =>
  geolib.getDistance(
    { latitude: lat, longitude: long },
    {
      latitude: coords.latitude,
      longitude: coords.longitude
    }
  ) / 1000;

const HandymanRecords = ({ handyman, clientLat, clientLong, navigation }) => {
  const { name, mobileno, rating, category, coords } = handyman;
  const distance = calculateDistance(clientLat, clientLong, coords);
  return distance <= 15 ? (
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
          <Text style={{ fontWeight: "bold" }}>{category}</Text>
          <Text>{distance} kilometers away.</Text>
        </View>
      </CardSection>
    </Card>
  ) : null;
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
    width: "80%",
    marginLeft: 15
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

export default withNavigation(HandymanRecords);
