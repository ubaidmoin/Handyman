import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  Switch,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform
} from 'react-native';
import * as geolib from 'geolib';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Icon from 'react-native-vector-icons/Octicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';
import StarRating from 'react-native-star-rating';
import FontIcon from 'react-native-vector-icons/MaterialIcons';
import Communications from 'react-native-communications';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

import { Input, Button, Header, Card, CardSection } from '../common';
import RenderService from './RenderService';
import Services from './Services';

class HomeScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Home',
    headerLeft: (<IoniconsIcon
      style={{ marginLeft: 10 }}
      name='ios-menu'
      size={30}
      color='#000'
      onPress={() => navigation.toggleDrawer()}
    />),
    headerRight: (<TouchableOpacity onPress={() => navigation.navigate('Settings')}>
      <AntDesignIcon
        style={{ marginRight: 10 }}
        name='setting'
        size={30}
        color='#000'
      />
    </TouchableOpacity>)
  });

  constructor(props) {
    super(props);
    this.state = {
      checkCanceled: false,
      switchDisabled: false,
      google_api_key: 'AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk',
      isModalVisible: false,
      switchValue: false,
      dialogVisible: false,
      latitude: 30.3753,
      longitude: 69.3451,
      origin: null,
      newRequest: [],
      directionCalc: false,
      checkNewRequest: false,
      handymanData: [],
      askedServices: [],
      activeHandymanModal: false
    };

  }

  sendNotificationImmediately = async (title, body) => {
    let notificationId = await Notifications.presentLocalNotificationAsync({
      title: title,
      body: body,
      ios: {
        sound: true,
        _displayInForeground: true
      }
    });
    console.log(notificationId); // can be saved in AsyncStorage or send to server
  };

  async componentDidMount() {
    // AsyncStorage.removeItem('userData')
    // AsyncStorage.removeItem('booking')
    let value = await AsyncStorage.getItem('userData')
    let data = JSON.parse(value)
    if (data !== null) {
      this.setState({
        handymanData: data
      })
    }
    // AsyncStorage.removeItem('userData')
    AsyncStorage.removeItem('booking')
    let booking = await AsyncStorage.getItem('booking')
    let bookingData = JSON.parse(booking)
    if (bookingData !== null) {
      this.setState({ directionCalc: true, isModalVisible: false, switchValue: false, switchDisabled: true })
    }
    let url = 'http://' + global.ip + '/HandymanAPI/api/checkStatus?id=' + this.state.handymanData.id
    fetch(url)
      .then(response => response.json().then(data => {
        if (data !== true) {
          this.setState({
            activeHandymanModal: true
          })
        } else {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.setState({
                origin: {
                  latitude: 30.3753,
                  longitude: 69.3451,
                  latitudeDelta: 5,
                  longitudeDelta: 5,
                }
              })
            })
        }
      }))
      .catch((error) => {
        alert('Error.')
      });

    let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (Constants.isDevice && result.status === 'granted') {
      console.log('Notification permissions granted.')
    }
    Notifications.addListener(this.handleNotification);
  }

  onArrivedClick = () => {
    let data = {
      sid: this.state.newRequest.sid,
      arrived: true
    }
    this.setState({ directionCalc: false, switchDisabled: false })
    let url = 'http://' + global.ip + '/HandymanAPI/api/onArrive'
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json().then(data => {
        //console.warn(data)
      }))
      .catch((error) => {
        alert('Error.')
      });
    this.props.navigation.navigate('Direction', {
      newRequest: this.state.newRequest,
      askedServices: this.state.askedServices,
      handymanData: this.state.handymanData
    })
  }

  renderDirection = () => {
    let coords = []
    coords.push({ latitude: this.state.latitude, longitude: this.state.longitude })
    coords.push({ latitude: this.state.newRequest.lat, longitude: this.state.newRequest.long })
    if (this.state.directionCalc === true) {
      return (
        <View>
          <MapViewDirections
            origin={coords[0]}
            destination={coords[1]}
            apikey={this.state.google_api_key}
            strokeWidth={3}
            strokeColor="blue"
          />
          <Marker
            coordinate={{ latitude: this.state.newRequest.lat, longitude: this.state.newRequest.long }}
            title={this.state.newRequest.name}
            description={this.state.newRequest.rating.toFixed(2) + "★"}
          />
        </View>
      )
    }
    else
      return null
  }

  renderButton() {
    if (this.state.directionCalc === true) {
      return (
        <View style={styles.bottomButton}>
          <TouchableOpacity style={{ marginLeft: '8%', justifyContent: 'center', alignItems: 'center' }}
            onPress={this.onCancelBooking.bind()}>
            <MaterialIcon
              name='cancel'
              size={30}
              color='#000'
            />
            <Text style={{ marginLeft: '8%', color: 'grey', fontSize: 12 }}>Cancel</Text>
            <Text style={{ marginLeft: '8%', color: 'grey', fontSize: 12 }}>Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
            onPress={this.onArrivedClick.bind()}>
            <FontAwesomeIcon
              name='walking'
              size={30}
              color='#000'
            />
            <Text style={{ color: 'grey', fontSize: 12 }}>Reached</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: '8%', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => Communications.phonecall(this.state.newRequest.contact, true)}
          >
            <FontIcon
              name='phone'
              size={30}
              color='#000'
            />
            <Text style={{ marginRight: '8%', color: 'grey', fontSize: 12 }}>Contact</Text>
          </TouchableOpacity>
        </View>

      )
    }
    else
      return null
  }

  onCancelBooking = () => {
    this.removeItemValue('booking')
    let url = 'http://' + global.ip + '/HandymanAPI/api/OnCancelBookingHandyman?id=' + this.state.newRequest.sid
    fetch(url)
      .then(response => response.json().then(data => {
        //console.warn(data)
        this.setState({ checkNewRequest: true, newRequest: [], checkCanceled: true, directionCalc: false });
      }))
      .catch((error) => {
        alert('Error.')
      });
  }

  _storeData = async (value) => {
    try {
      await AsyncStorage.setItem('booking', value);
      // console.warn(value)
    } catch (error) {
      console.warn(error)
    }
  };

  btnAccept() {
    let data = []
    data = {
      sid: this.state.newRequest.sid,
      status: 'Accepted'
    }
    let url = 'http://' + global.ip + '/HandymanAPI/api/ResponseRequest/' + this.state.handymanData.id
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json().then(data => {
        // console.warn(data)        
        this.setState({ directionCalc: true, isModalVisible: false, switchValue: false, switchDisabled: true })
      }))
      .catch((error) => {
        alert('Error.')
      });
  }

  async removeItemValue(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch (exception) {
      return false;
    }
  }

  onCancelClick = () => {
    this.removeItemValue('booking')
    let data = []
    data = {
      sid: this.state.newRequest.sid,
      status: 'Rejected'
    }
    let url = 'http://' + global.ip + '/HandymanAPI/api/ResponseRequest/' + this.state.handymanData.id
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json().then(data => {
        console.warn(data)
        this.setState({ isModalVisible: !this.state.isModalVisible, checkNewRequest: true, newRequest: [], checkCanceled: true });
      }))
      .catch((error) => {
        alert('Error.')
      });
  }

  setAsAvailable() {
    let data = []
    if (this.state.switchValue === true) {
      data = {
        id: this.state.handymanData.id,
        lat: parseFloat(this.state.latitude),
        long: parseFloat(this.state.longitude),
        available: true
      }
    } else {
      data = {
        id: this.state.handymanData.id,
        lat: 0,
        long: 0,
        available: false
      }
    }
    // console.warn(data)
    let url = 'http://' + global.ip + '/HandymanAPI/api/OnAvailableChange'
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json().then(data => {
        // console.warn(data)
      }))
      .catch((error) => {
        alert('Error.')
      });
  }

  async newRequest() {
    let url = 'http://' + global.ip + '/HandymanAPI/api/OnNewRequest/' + this.state.handymanData.id
    //console.warn(url)
    return fetch(url)
      .then(response => response.json().then(data => {
        // console.warn(data)
        if (data != null) {
          this.sendNotificationImmediately("New Booking", "You have received a booking request.")
          this.setState({
            newRequest: data,
            checkNewRequest: false,
            isModalVisible: !this.state.isModalVisible
          })
          //console.warn(data)
          this._storeData(JSON.stringify(data))
          let url = 'http://' + global.ip + '/HandymanAPI/api/getBookingDetails/' + this.state.newRequest.sid
          fetch(url)
            .then(response => response.json().then(data => {
              //console.warn(data)
              if (data != null) {
                this.setState({
                  askedServices: data
                })
              }
            }))
            .catch((error) => {
              alert('Error.')
            });
        }
      }))
      .catch((error) => {
        alert('Check your internet connection.')
      });
  }

  // async onCanceled() {
  //   let url = 'http://' + global.ip + '/HandymanAPI/api/OnCancelBooking?id=' + this.state.newRequest.sid
  //   return fetch(url)
  //     .then(response => response.json().then(data => {
  //       //console.warn(data)
  //       if (data === "Canceled") {
  //         this.props.navigation.navigate('Home')
  //       }
  //     }))
  //     .catch((error) => {
  //       alert('Check your internet connection.')
  //     });
  // }

  toggleSwitch() {
    this.setState({
      switchValue: !this.state.switchValue,
      checkNewRequest: !this.state.checkNewRequest
    })
    this.timer = setInterval(() => {
      if (this.state.checkNewRequest) {
        this.newRequest()
      } else {
        clearInterval()
      }
    }, 1000)
    setTimeout(() => {
      if (this.state.switchValue) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              origin: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }
            })
            this.mapView.animateToRegion(
              {
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
              },
              1000
            )
            this.setAsAvailable()
            this.timer = setInterval(() => {
              if (this.state.checkNewRequest) {
                this.newRequest()
              } else {
                clearInterval()
              }
            }, 1000)
          })
      } else {
        this.setAsAvailable()
      }
    }, 100);
    // console.warn(this.state.latitude)
  }

  renderService() {
    return this.state.askedServices.map(service =>
      <RenderService key={service.sub_service} service={service} />)
  }

  _onMapReady = () => this.setState({ marginBottom: 0 })

  render() {
    return (
      <View >
        <MapView
          style={{
            height: (this.state.isModalVisible === true || this.state.activeHandymanModal === true) ? Dimensions.get('window').height * .40 : Dimensions.get('window').height,
            width: Dimensions.get('window').width
          }}
          ref={(ref) => this.mapView = ref}
          onMapReady={this._onMapReady}
          showsMyLocationButton={true}
          showsUserLocation={true}
          region={this.state.origin}
        >
          {this.renderDirection()}
        </MapView>

        <View style={{ flexDirection: 'row', alignItems: 'center', height: '7%', position: 'absolute', top: 5, left: 15, backgroundColor: 'white', borderRadius: 5, paddingHorizontal: 10, opacity: 0.85 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginRight: 5 }}>Available</Text>
          <Switch
            disabled={this.state.switchDisabled}
            onValueChange={() => this.toggleSwitch()}
            value={this.state.switchValue} />
        </View>
        <Modal isVisible={this.state.activeHandymanModal}
          style={{
            borderRadius: 10,
            marginTop: Dimensions.get('screen').height * .50,
            width: '100%',
            marginLeft: 0,
            backgroundColor: 'white',
            height: '100%',
          }}
          hasBackdrop={false}

          scrollHorizontal
          propagateSwipe
          swipeDirection={["down"]}
          onSwipeComplete={() => this.setState({ activeHandymanModal: false })}
        >
          <View style={{ height: '100%', flexDirection: 'column' }}>
            <View style={{ height: '15%', flexDirection: 'row' }}>
              <Text style={{ marginTop: 18, fontSize: 20, fontWeight: 'bold', marginLeft: 25 }}>Your account is currently inactive.</Text>
              <TouchableOpacity style={{ marginTop: 18, marginLeft: '27%', backgroundColor: 'grey', height: 30, width: 30, borderRadius: 60, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ isModalVisible: false })}>
                <Icon
                  name='x'
                  size={30}
                  color='white'
                />
              </TouchableOpacity>
            </View>
            <View style={{ height: '85%', flexDirection: 'row', paddingHorizontal: 10 }}>
              <Text>
                Your account is currently inactive. We will check your profile and set your account as active.
                Please login later. Thanks for your patience.
              </Text>
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalVisible}
          style={styles.modalStyle}
          scrollHorizontal
          propagateSwipe
          swipeDirection={["down"]}
          onSwipeComplete={() => this.onSearchClick()}
        >
          <View style={{ flexDirection: 'column' }}>
            <View style={{ height: '15%', flexDirection: 'row' }}>
              <Text style={{ marginTop: 10, fontSize: 20, fontWeight: 'bold', marginLeft: 25 }}>New Request</Text>
              <TouchableOpacity style={{ marginTop: 10, marginLeft: '45%', backgroundColor: 'grey', height: 30, width: 30, borderRadius: 60, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.onCancelClick()}>
                <Icon
                  name='x'
                  size={30}
                  color='white'
                />
              </TouchableOpacity>
            </View>
            <View style={{ height: '85%', flexDirection: 'column' }}>
              <View style={{
                flexDirection: 'row',
                height: 80,
                alignItems: 'center',
                marginHorizontal: 20,
                marginVertical: 5,
                backgroundColor: 'white',
                borderRadius: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
              }}>
                <View>
                  <Image
                    style={styles.displayPicStyle}
                    source={{ uri: `data:image/png;base64,${this.state.newRequest.image}` }} />
                </View>
                <View style={styles.detailContainer}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{this.state.newRequest.name}</Text>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={this.state.newRequest.rating}
                    starSize={20}
                    emptyStarColor="grey"
                    containerStyle={{ width: 30 }}
                    starStyle={{ flexDirection: 'row', justifyContent: 'flex-start' }}
                  />
                  <Text style={{ fontWeight: 'bold' }}>{this.state.newRequest.contact}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={{ height: 30, backgroundColor: 'lightgreen', width: 100, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                    this.btnAccept()
                  }}>
                    <Text>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text style={{ marginTop: 10, fontSize: 20, fontWeight: 'bold', marginLeft: 25 }}>Asked Services</Text>
                {this.renderService()}
                <Text style={{ marginTop: 10, fontSize: 15, marginLeft: 25 }}>{this.state.newRequest.detail}</Text>
              </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: "100%",
    paddingTop: 250
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: 'lightgrey',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: '80%',
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 5,
    marginLeft: 15,
    height: 25,
    flexDirection: 'row',
    width: '40%',
    borderRadius: 30,
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0E1E1',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E0E1E1',
  },
  detailContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '45%'
  },
  displayPicStyle: {
    width: 80,
    height: 80,
    borderRadius: 10
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  modalStyle: {
    borderRadius: 10,
    marginTop: Dimensions.get('screen').height * .30,
    width: '100%',
    marginLeft: 0,
    backgroundColor: 'white',
    height: '100%',
  },
  buttonContainer: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 5,
    position: 'relative',
  },
  bottomButton: {
    position: 'absolute',
    top: '75%',
    left: '5%',
    bottom: 10,
    right: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 7
  }
});


export default HomeScreen;