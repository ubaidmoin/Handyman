import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
  AsyncStorage
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { CheckBox, ListItem } from 'native-base';
import Dialog from 'react-native-dialog';
import Icon from 'react-native-vector-icons/Octicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import { Rating } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import Communications from 'react-native-communications';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

import { Input, Button, CardSection, Card } from '../common';
import RenderBill from './RenderBill';

class ConfirmationView extends Component {
  static navigationOptions = {
    title: 'Handyman Location',
    headerLeft: null
  };

  state = {
    total: 0,
    bookedHandyman: this.props.navigation.getParam('bookedHandyman', null),
    checkArrived: true,
    checkBill: false,
    bookingId: this.props.navigation.getParam('bookingId', 0),
    isModalVisibleWork: false,
    isModalVisible: false,
    isModalVisibleWait: false,
    dialogVisible: false,
    coordinates: [],
    google_api_key: 'AIzaSyDNA9nURgVDmwVFFOatLwYS-mGtOsGelqY',
    latitude: null,
    longitude: null,
    error: null,
    coords: { latitude: 33.5856, longitude: 73.0675 },
    origin: null,
    services: [],
    rating: 0,
    neverComeBack: false,
    bookingData: this.props.navigation.getParam('bookingData', null),
    paidAmount: ''
  }

  onCancelClick = () => {
    let url = 'http://' + global.ip + '/HandymanAPI/api/OnCancelBookingClient?id=' + this.state.bookingId
    return fetch(url)
      .then(response => response.json().then(data => {
        //console.warn(data)
        this.props.navigation.pop()
      }))
      .catch((error) => {
        alert('Check your internet connection.')
      });
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleConfirm() {
    this.setState({ dialogVisible: false });
    this.timeoutHandle = setTimeout(() => {
      this.setState({ isModalVisible: !this.state.isModalVisible })
    }, 1000);
  };

  async onArrival() {
    let url = 'http://' + global.ip + '/HandymanAPI/api/Arrived/' + this.state.bookingId
    return fetch(url)
      .then(response => response.json().then(data => {
        if (data === "Arrived") {
          this.sendNotificationImmediately("Handyman", "Handyman arrived at your place.")
          this.setState({
            checkArrived: false,
            checkBill: true,
            isModalVisibleWait: false,
            isModalVisibleWork: !this.state.isModalVisibleWork
          })
          this.timer = setInterval(() => {
            if (this.state.checkBill) {
              this.getBill()
            } else {
              clearInterval()
            }
          }, 1000)
        } else if (data === "Canceled") {
          this.props.navigation.pop()
        }
      }))
      .catch((error) => {
        alert('Check your internet connection.')
      });
  }

  async getBill() {
    let url = 'http://' + global.ip + '/HandymanAPI/api/getBill?id=' + this.state.bookingId
    return fetch(url)
      .then(response => response.json().then(data => {
        if (data === "Waiting") {
          //console.warn('Waiting for work to complete.')
        }
        else {
          console.warn(data)
          this.sendNotificationImmediately("Work Done", "Give ratings to the handyman.")
          this.setState({
            checkBill: false,
            services: data,
            isModalVisibleWork: !this.state.isModalVisibleWork,
            isModalVisible: !this.state.isModalVisible,
            paidAmount: data[0].paid,
            total: data[0].total
          })
        }
      }))
      .catch((error) => {
        alert('Check your internet connection.')
      });
  }

  sendNotificationImmediately = async (title, body) => {
    let notificationId = await Notifications.presentLocalNotificationAsync({
      title: title,
      body: body,
      ios:{
        sound: true,
        _displayInForeground: true        
      }    
    });
    console.log(notificationId); // can be saved in AsyncStorage or send to server
  };

  componentDidMount() {
    if (this.state.bookingData !== null) {
      this.setState({
        coords: {
          latitude: this.state.bookedHandyman.lat,
          longitude: this.state.bookedHandyman.long
        },
        origin: {
          latitude: this.state.bookingData.clat,
          longitude: this.state.bookingData.clong,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }
      })
    } else {
      this.setState({
        coords: {
          latitude: (this.state.bookedHandyman.latitude === null) ? this.state.bookedHandyman.lat : this.state.bookedHandyman.latitude,
          longitude: (this.state.bookedHandyman.longitude === null) ? this.state.bookedHandyman.long : this.state.bookedHandyman.longitude
        },
        origin: {
          latitude: this.state.bookedHandyman.latitude,
          longitude: this.state.bookedHandyman.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }
      })
    }
    // console.warn(this.state.coords)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          origin: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );

    this.setState({
      isModalVisibleWait: true
    })

    this.timer = setInterval(() => {
      if (this.state.checkArrived) {
        this.onArrival()
      } else {
        clearInterval()
      }
    }, 1000)
    //    this.setState({
    //     services: [{"name":"TV Repair", "price": 500},
    //     {"name":"AC Installment", "price": 1500},
    //     {"name":"Breaker Installment", "price": 200}],
    // })

    //    this.timeoutHandle = setTimeout(()=>{
    //     this.setState({ isModalVisibleWork: !this.state.isModalVisibleWork,
    //       handyman: {"name":"Ubaid", "mobileno":"03325426789", "rating":"4.5", "category":"Electrician", "coords": {"latitude":33.5856,"longitude":73.0675}},
    //     })
    //   }, 5000);
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

  onVisibleChange() {
    this.setState({
      isModalVisible: false
    })
  }

  renderBill = () => {
    return this.state.services.map(service =>
      <RenderBill key={service.name} service={service} />)
  }

  onSubmitClick = () => {
    //console.warn(data)
    let url = 'http://' + global.ip + '/HandymanAPI/api/giveRating/' + this.state.bookingId
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.rating)
    })
      .then(response => response.json().then(data => {
        // console.warn(data)
      }))
      .catch((error) => {
        alert('Error.')
      });
    this.removeItemValue('booking')
    this.setState({ isModalVisible: false })
    this.props.navigation.navigate('Home')
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

  // onRegionChange = region => {
  //   this.setState({
  //     position: region
  //   })    
  // }

  // _onMapReady = () => this.setState({marginBottom: 0})

  render() {
    return (
      <View style={{ width: '100%', height: '100%' }}>
        <MapView
          // ref={(ref) => this.mapView = ref}
          // onMapReady={this._onMapReady}
          style={{
            height: (
              this.state.isModalVisible === true ||
              this.state.isModalVisibleWait === true ||
              this.state.isModalVisibleWork === true
            ) ? Dimensions.get('window').height * .40 :
              Dimensions.get('window').height,
            width: Dimensions.get('window').width
          }}
          showsUserLocation={true}
          region={this.state.origin}
          showsMyLocationButton={true}
        >

          {(this.state.origin != null) ? <Marker
            coordinate={this.state.coords}
            title={this.state.bookedHandyman.name}
          /> : null}
        </MapView>
        <Modal isVisible={this.state.isModalVisibleWait}
          style={styles.modalStyle}
          scrollHorizontal
          propagateSwipe
          hasBackdrop={false}
          coverScreen={false}
          swipeDirection={["up"]}
        >
          <View style={{ height: 350, flexDirection: 'column' }}>
            <View style={{ height: '15%', flexDirection: 'row' }}>
              <Text style={{ marginTop: 18, fontSize: 20, fontWeight: 'bold', marginLeft: 25 }}>Handyman is on his way.</Text>

            </View>
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
                  source={{ uri: `data:image/png;base64,${this.state.bookedHandyman.image}` }} />
              </View>
              <View style={styles.detailContainer}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{this.state.bookedHandyman.name}</Text>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={this.state.bookedHandyman.rating}
                  starSize={20}
                  emptyStarColor="grey"
                  containerStyle={{ width: 30 }}
                  starStyle={{ flexDirection: 'row', justifyContent: 'flex-start' }}
                />
                <Text style={{ fontWeight: 'bold' }}>{this.state.bookedHandyman.contact}</Text>
                <Text style={{ fontWeight: 'bold' }}>{this.state.bookedHandyman.category}</Text>
              </View>
            </View>
            {/* <TouchableOpacity style={styles.bottomButton} onPress={() => this.onCancelClick()}>
                <Text style={{color:'white', fontSize:30, fontWeight: 'bold'}}>Cancel Booking</Text>
              </TouchableOpacity> */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
              }}
                onPress={() => this.onCancelClick()}
              >
                <MaterialIcon
                  name='cancel'
                  size={30}
                  color='red'
                />
                <Text style={styles.textStyle}>Cancel Booking</Text></TouchableOpacity>
              <TouchableOpacity style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
              }}
                onPress={() => Communications.phonecall(this.state.bookedHandyman.contact, true)}
              >
                <FontIcon
                  name='phone'
                  size={30}
                  color='#000'
                />
                <Text style={styles.textStyle}>Contact</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* <TouchableOpacity style={styles.bottomButton} onPress={() => this.onCancelClick()}>
                <Text style={{color:'white', fontSize:30, fontWeight: 'bold'}}>Cancel Booking</Text>
            </TouchableOpacity>*/}
        <Modal isVisible={this.state.isModalVisibleWork}
          style={styles.modalStyle}
          scrollHorizontal
          propagateSwipe
          hasBackdrop={false}
          coverScreen={false}
          swipeDirection={["up"]}
        >
          <View style={{ height: 350, flexDirection: 'column' }}>
            <View style={{ height: '15%', flexDirection: 'row' }}>
              <Text style={{ marginTop: 18, fontSize: 20, fontWeight: 'bold', marginLeft: 25 }}>Work in progess</Text>
            </View>
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
                  source={{ uri: `data:image/png;base64,${this.state.bookedHandyman.image}` }} />
              </View>
              <View style={styles.detailContainer}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{this.state.bookedHandyman.name}</Text>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={this.state.bookedHandyman.rating}
                  starSize={20}
                  emptyStarColor="grey"
                  containerStyle={{ width: 30 }}
                  starStyle={{ flexDirection: 'row', justifyContent: 'flex-start' }}
                />
                <Text style={{ fontWeight: 'bold' }}>{this.state.bookedHandyman.contact}</Text>
                <Text style={{ fontWeight: 'bold' }}>{this.state.bookedHandyman.category}</Text>
              </View>
            </View>
          </View>
        </Modal>
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Generate Bill</Dialog.Title>
          <Dialog.Description>
            Handyman has submitted the bill. Show bill?
                </Dialog.Description>
          <Dialog.Button label="Cancel" onPress={() => this.handleCancel()} />
          <Dialog.Button label="Confirm" onPress={() => this.handleConfirm()} />
        </Dialog.Container>
        <Modal isVisible={this.state.isModalVisible}
          style={styles.modalStyle}
          scrollHorizontal
          propagateSwipe
          hasBackdrop={false}
          coverScreen={false}
          swipeDirection={["up"]}
        >
          <View style={{ flexDirection: 'column' }}>
            <View style={{ height: '15%', flexDirection: 'row' }}>
              <Text style={{ marginTop: 18, fontSize: 20, fontWeight: 'bold', marginLeft: 25 }}>Bill & Feedback</Text>
              {/* <TouchableOpacity style={{ marginTop: 18, marginLeft: '40%', backgroundColor: 'grey', height: 30, width: 30, borderRadius: 60, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ isModalVisible: false })}>
                <Icon
                  name='x'
                  size={30}
                  color='white'
                />
              </TouchableOpacity> */}
            </View>
            <View style={{ height: '85%', marginTop: '5%', justifyContent: 'center' }}>
              {this.renderBill()}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '95%',
                paddingLeft: 20,
                paddingTop: 15
              }}>
                <Text style={{ fontSize: 15 }}>Total</Text>
                <Text style={{ fontSize: 15 }}>{this.state.total}</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '95%',
                paddingLeft: 20,
                paddingTop: 15
              }}>
                <Text style={{ fontSize: 15 }}>You paid</Text>
                <Text style={{ fontSize: 15 }}>{this.state.paidAmount}</Text>
              </View>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={this.state.rating}
                starSize={50}
                emptyStarColor="grey"
                containerStyle={{ width: 200, flex: 1, marginLeft: '15%' }}
                starStyle={{ flexDirection: 'row' }}
                selectedStar={(rating) => this.setState({ rating: rating })}
              />
              {/* <View style={{ marginTop: '5%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <TextInput value={this.state.totalBill} editable={false} style={{
                  color: '#000',
                  paddingRight: 5,
                  paddingLeft: 5,
                  fontSize: 18,
                  lineHeight: 23,
                  flex: 2,
                  width: '90%',
                  height: 60
                }}
                />
                <ListItem
                  onPress={() => this.setState({ neverComeBack: !this.state.neverComeBack })}>
                  <CheckBox
                    color='black'
                    onPress={() => this.setState({ neverComeBack: !this.state.neverComeBack })}
                    checked={this.state.neverComeBack} />
                  <View>
                    <Text>Never Come Back.</Text>
                  </View>
                </ListItem>
              </View> */}
              <TouchableOpacity style={styles.bottomButton} onPress={() => this.onSubmitClick()}>
                <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: 30
  },
  detailContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '60%',
    marginLeft: 10
  },
  displayPicStyle: {
    width: 80,
    height: 80,
    borderRadius: 30
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
    marginLeft: 10,
    width: '80%',
    borderRadius: 30,
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButton: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    right: 5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 7
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  modalStyle: {
    borderRadius: 10,
    marginTop: Dimensions.get('window').height * .30,
    width: '100%',
    marginLeft: 0,
    backgroundColor: 'white',
    height: '100%',
  },
  textStyle: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  }
});


export default ConfirmationView;