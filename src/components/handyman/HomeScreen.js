import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Switch,
  TouchableOpacity,
  Dimensions,
  Image
} from "react-native";
import * as geolib from "geolib";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Icon from "react-native-vector-icons/Octicons";
import Modal from "react-native-modal";

import { Input, Button, Header, Card, CardSection } from "../common";
import Services from "./Services";

const calculateDistance = (lat, long, coords) =>
  geolib.getDistance(
    { latitude: lat, longitude: long },
    {
      latitude: coords.latitude,
      longitude: coords.longitude
    }
  ) / 1000;

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Home",
    headerLeft: (
      <Icon
        style={{ marginLeft: 10 }}
        name="three-bars"
        size={30}
        color="#000"
        onPress={() => navigation.toggleDrawer()}
      />
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      switchDisabled: false,
      google_api_key: "AIzaSyDNA9nURgVDmwVFFOatLwYS-mGtOsGelqY",
      isModalVisible: false,
      switchValue: false,
      dialogVisible: false,
      latitude: 30.3753,
      longitude: 69.3451,
      origin: null,
      newRequest: {
        name: "",
        mobileno: "",
        rating: "",
        category: "",
        coords: { latitude: 0, longitude: 0 }
      },
      directionCalc: false
    };
  }
  componentDidMount() {
    console.warn(this.props.navigation);
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        origin: {
          latitude: 30.3753,
          longitude: 69.3451,
          latitudeDelta: 5,
          longitudeDelta: 5
        }
      });
    });
  }

  onSubmitClick = () => {
    this.setState({ directionCalc: false, switchDisabled: false });
    this.props.navigation.navigate("Direction", {
      lat: this.state.newRequest.coords.latitude,
      lng: this.state.newRequest.coords.longitude
    });
  };

  renderDirection() {
    if (this.state.directionCalc === true) {
      return (
        <View>
          <Marker
            coordinate={this.state.newRequest.coords}
            title="Ubaid"
            description="4.5 ★"
          />
        </View>
      );
    } else return null;
  }

  renderButton() {
    if (this.state.directionCalc === true) {
      return (
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={this.onSubmitClick.bind()}
        >
          <Text style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>
            Arrived
          </Text>
        </TouchableOpacity>
      );
    } else return null;
  }

  btnAccept() {
    this.setState({
      directionCalc: true,
      isModalVisible: false,
      switchValue: false,
      switchDisabled: true
    });
  }

  onCancelClick = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  toggleSwitch() {
    this.setState({ switchValue: !this.state.switchValue });
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        origin: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        }
      });
    });
    setTimeout(() => {
      this.setState({
        newRequest: {
          name: "Ubaid",
          mobileno: "03325426789",
          rating: "4.5",
          category: "Electrician",
          coords: { latitude: 33.5856, longitude: 73.0675 }
        },
        isModalVisible: !this.state.isModalVisible
      });
    }, 1000);
  }

  render() {
    return (
      <View>
        <MapView
          style={styles.mapStyle}
          showsUserLocation={true}
          region={this.state.origin}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 200,
              height: "7%"
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginRight: 5,
                color: "#383F3F"
              }}
            >
              Available
            </Text>
            <Switch
              disabled={this.state.switchDisabled}
              onValueChange={() => this.toggleSwitch()}
              value={this.state.switchValue}
            />
          </View>
          {this.renderDirection()}
        </MapView>
        <Modal
          isVisible={this.state.isModalVisible}
          style={styles.modalStyle}
          scrollHorizontal
          propagateSwipe
          swipeDirection={["down"]}
          onSwipeComplete={() => this.onSearchClick()}
        >
          <View
            style={{ height: 350, flexDirection: "column", marginTop: "90%" }}
          >
            <View style={{ height: "15%", flexDirection: "row" }}>
              <Text
                style={{
                  marginTop: 18,
                  fontSize: 20,
                  fontWeight: "bold",
                  marginLeft: 25
                }}
              >
                New Request
              </Text>
              <TouchableOpacity
                style={{
                  marginTop: 18,
                  marginLeft: "45%",
                  backgroundColor: "grey",
                  height: 30,
                  width: 30,
                  borderRadius: 60,
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onPress={() => this.onCancelClick()}
              >
                <Icon name="x" size={30} color="white" />
              </TouchableOpacity>
            </View>
            <View style={{ height: "85%", marginTop: "-15%" }}>
              <Card>
                <CardSection>
                  <View>
                    <Image
                      style={styles.displayPicStyle}
                      source={require("../assets/user.jpg")}
                    />
                  </View>
                  <View style={styles.detailContainer}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      {this.state.newRequest.name}
                    </Text>
                    <Text>{this.state.newRequest.rating} ★</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {this.state.newRequest.mobileno}
                    </Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {this.state.newRequest.category}
                    </Text>
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={{
                        height: 30,
                        backgroundColor: "lightgreen",
                        width: 100,
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                      onPress={() => {
                        this.btnAccept();
                      }}
                    >
                      <Text>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </CardSection>
              </Card>
            </View>
          </View>
        </Modal>
        {this.renderButton()}
      </View>
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
    marginTop: 30,
    marginBottom: 5,
    marginLeft: 15,
    height: 25,
    flexDirection: "row",
    width: "40%",
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
    borderColor: "#E0E1E1"
  },
  detailContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    width: "40%"
  },
  displayPicStyle: {
    width: 100,
    height: 100,
    borderRadius: 10
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  modalStyle: {
    borderRadius: 10,
    marginTop: "120%",
    width: "100%",
    marginLeft: 0,
    backgroundColor: "white",
    height: "100%"
  },
  buttonContainer: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "25%",
    borderRadius: 5,
    position: "relative"
  },
  bottomButton: {
    position: "absolute",
    top: "83%",
    left: 0,
    right: 0,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  }
});

export default HomeScreen;
