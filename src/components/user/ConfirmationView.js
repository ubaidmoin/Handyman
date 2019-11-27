import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Dialog from "react-native-dialog";
import Icon from "react-native-vector-icons/Octicons";
import Modal from "react-native-modal";
import { Rating } from "react-native-elements";

import { Input, Button, CardSection, Card } from "../common";
import RenderBill from "./RenderBill";

class ConfirmationView extends Component {
  static navigationOptions = {
    title: "Handyman Location",
    headerLeft: null
  };

  state = {
    isModalVisibleWork: false,
    isModalVisible: false,
    dialogVisible: false,
    coordinates: [],
    google_api_key: "AIzaSyDNA9nURgVDmwVFFOatLwYS-mGtOsGelqY",
    latitude: null,
    longitude: null,
    error: null,
    coords: { latitude: 33.5856, longitude: 73.0675 },
    origin: null,
    services: [],
    handyman: {
      name: "",
      mobileno: "",
      rating: "",
      category: "",
      coords: { latitude: 0, longitude: 0 }
    }
  };

  onCancelClick = () => {
    this.props.navigation.pop();
  };

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleConfirm() {
    this.setState({ dialogVisible: false });
    this.timeoutHandle = setTimeout(() => {
      this.setState({ isModalVisible: !this.state.isModalVisible });
    }, 1000);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          origin: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }
        });
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
    );
    this.setState({
      services: [
        { name: "TV Repair", price: 500 },
        { name: "AC Installment", price: 1500 },
        { name: "Breaker Installment", price: 200 }
      ]
    });

    this.timeoutHandle = setTimeout(() => {
      this.setState({
        isModalVisibleWork: !this.state.isModalVisibleWork,
        handyman: {
          name: "Ubaid",
          mobileno: "03325426789",
          rating: "4.5",
          category: "Electrician",
          coords: { latitude: 33.5856, longitude: 73.0675 }
        }
      });
    }, 5000);
  }

  onVisibleChange() {
    this.setState({
      isModalVisible: false
    });
  }

  renderBill() {
    return this.state.services.map(service => (
      <RenderBill key={service.name} service={service} />
    ));
  }

  onSubmitClick = () => {
    this.setState({ isModalVisible: false });
    this.props.navigation.navigate("Home");
  };

  render() {
    return (
      <View style={{ width: "100%", height: "100%" }}>
        <MapView
          style={styles.mapStyle}
          showsUserLocation={true}
          region={this.state.origin}
        >
          <Marker
            coordinate={this.state.coords}
            title="Basit"
            description="5 ★"
          />
        </MapView>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => this.onCancelClick()}
        >
          <Text style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>
            Cancel Booking
          </Text>
        </TouchableOpacity>
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Generate Bill</Dialog.Title>
          <Dialog.Description>
            Handyman has submitted the bill. Show bill?
          </Dialog.Description>
          <Dialog.Button label="Cancel" onPress={() => this.handleCancel()} />
          <Dialog.Button label="Confirm" onPress={() => this.handleConfirm()} />
        </Dialog.Container>
        <Modal
          isVisible={this.state.isModalVisibleWork}
          style={styles.modalStyle}
          scrollHorizontal
          propagateSwipe
          swipeDirection={["down"]}
          onSwipeComplete={() => {
            this.setState({ isModalVisibleWork: false });
            this.timeoutHandle = setTimeout(() => {
              this.setState({ dialogVisible: !this.state.dialogVisible });
            }, 5000);
          }}
        >
          <View
            style={{ height: 350, flexDirection: "column", marginTop: 180 }}
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
                Work in progess
              </Text>
              <TouchableOpacity
                style={{
                  marginTop: 18,
                  marginLeft: "40%",
                  backgroundColor: "grey",
                  height: 30,
                  width: 30,
                  borderRadius: 60,
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onPress={() => {
                  this.setState({ isModalVisibleWork: false });
                  this.timeoutHandle = setTimeout(() => {
                    this.setState({ dialogVisible: !this.state.dialogVisible });
                  }, 5000);
                }}
              >
                <Icon name="x" size={30} color="white" />
              </TouchableOpacity>
            </View>
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
                    {this.state.handyman.name}
                  </Text>
                  <Text>{this.state.handyman.rating} ★</Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {this.state.handyman.mobileno}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {this.state.handyman.category}
                  </Text>
                </View>
              </CardSection>
            </Card>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.isModalVisible}
          style={styles.modalStyle}
          scrollHorizontal
          propagateSwipe
          swipeDirection={["down"]}
          onSwipeComplete={() => this.setState({ isModalVisible: false })}
        >
          <View
            style={{ height: 350, flexDirection: "column", marginTop: 180 }}
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
                Bill & Feedback
              </Text>
              <TouchableOpacity
                style={{
                  marginTop: 18,
                  marginLeft: "40%",
                  backgroundColor: "grey",
                  height: 30,
                  width: 30,
                  borderRadius: 60,
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onPress={() => this.setState({ isModalVisible: false })}
              >
                <Icon name="x" size={30} color="white" />
              </TouchableOpacity>
            </View>
            <View style={{ height: "85%", marginTop: "5%" }}>
              {this.renderBill()}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "95%",
                  paddingLeft: 20,
                  paddingTop: 15
                }}
              >
                <Text style={{ fontSize: 15 }}>Total</Text>
                <Text style={{ fontSize: 15 }}>2200</Text>
              </View>
              <Rating
                type="star"
                ratingCount={5}
                onFinishRating={this.ratingCompleted}
              />
              <TouchableOpacity
                style={styles.bottomButton}
                onPress={() => this.onSubmitClick()}
              >
                <Text
                  style={{ color: "white", fontSize: 30, fontWeight: "bold" }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

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
    width: 100,
    height: 100,
    borderRadius: 10
  },
  buttonContainer: {
    height: 45,
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "80%",
    borderRadius: 30
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center"
  },
  bottomButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  modalStyle: {
    borderRadius: 10,
    marginTop: "70%",
    width: "100%",
    marginLeft: 0,
    backgroundColor: "white",
    height: "100%"
  }
});

export default ConfirmationView;
