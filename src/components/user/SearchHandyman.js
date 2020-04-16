import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  Dimensions,
  TouchableOpacity,
  Switch,
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import Dialog from 'react-native-dialog';
import DialogInput from 'react-native-dialog-input';
import DatePicker from 'react-native-datepicker';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

import HandymanRecords from './RenderHandymanRecords';
import RenderBill from './RenderBill';
import { Input, Header, Card, CardSection } from '../common';
import { Platform } from '@unimodules/core';

class SearchHandyman extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Search Handyman',
    }
  };

  constructor(props) {
    super(props)
    this.state = {
      searchHandyman: true,
      requesting: false,
      checkAcceptOrReject: true,
      bookingId: null,
      bookedHandyman: [],
      userData: this.props.navigation.getParam('userData', null),
      dialogVisible: false,
      availableHandyman: [],
      isModalVisible: false,
      category: this.props.navigation.getParam('category', ''),
      latitude: null,
      longitude: null,
      error: null,
      origin: null,
      address: null,
      billDetails: this.props.navigation.getParam('billDetails', ''),
      totalBill: this.props.navigation.getParam('totalBill', ''),
      otherDetail: this.props.navigation.getParam('otherDetail', ''),
      scheduled: this.props.navigation.getParam('scheduled', false),
      scheduledDate: null,
      scheduledTime: null,
      predictions: [],
      position: { latitude: 0, longitude: 0 },
      places: [],
      destination: '',
      isDialogVisible: false,
      newFavoritePlace: '',
      favLat: null,
      favLong: null,
      bookingData: this.props.navigation.getParam('bookingData', null),
      isListingSelected: false,
      showActivityIndicator: false,
      hideLocationButton: false,
      onLongPressModal: false,
      onLongPressServices: [],
      onLongPressBill: 0,
      name: ''
    }
  }

  goToInitialLocation() {
    let initialRegion = Object.assign({}, this.state.position);
    initialRegion["latitudeDelta"] = 0.005;
    initialRegion["longitudeDelta"] = 0.005;
    this.mapView.animateToRegion(initialRegion, 2000);
  }

  async onSearchHandyman() {
    let url = 'http://' + global.ip + '/HandymanAPI/api/getAvailableHandyman?category=' + this.state.category
    // console.warn(url)    
    fetch(url)
      .then(response => response.json().then(data => {
        // console.warn(data)
        if (data != []) {
          this.setState({ availableHandyman: data, isModalVisible: true, searchHandyman: false });
          // this.getHandymanSubServices()
        }
      }))
      .catch((error) => {

      });
  }

  renderBill = () => {
    return this.state.onLongPressServices.map(service =>
      <RenderBill key={service.sub_service} service={service} />)
  }

  getHandymanSubServices(hid) {    
      let url = 'http://' + global.ip + '/HandymanAPI/api/getSubServices?hid=' + hid
      let total = 0
      // console.warn(url)
      fetch(url)
        .then(response => response.json().then(data => {
          // console.warn(data)
          this.setState({
            onLongPressServices: data,
            onLongPressModal: true
          })
          this.state.billDetails.forEach(element => {
            data.forEach(ele => {
              if (element.sub_service === ele.sub_service) {
                total += (element.quantity * ele.price)
              }              
            })
          })
          this.setState({
            onLongPressBill: total
          })
        })
        )
        .catch((error) => {
          console.warn(error)
        });    
  }

  getLocation(lat, lng) {
    let myApiKey = 'AIzaSyDNA9nURgVDmwVFFOatLwYS-mGtOsGelqY'
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + lng + '&key=' + myApiKey)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          destination: responseJson.results[0].formatted_address
        })
      })
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  async onAcceptOrReject() {
    let url = 'http://' + global.ip + '/HandymanAPI/api/GetRequestResponse/' + this.state.bookingId
    // console.warn(url)
    //console.warn(this.state.bookedHandyman)
    return fetch(url)
      .then(response => response.json().then(data => {
        // console.warn(data)
        if (data === "Accepted") {
          this.sendNotificationImmediately("Request Accepted", "Handyman is on his way.")
          //console.warn(data)
          this.setState({
            checkAcceptOrReject: false,
            requesting: false,
            showActivityIndicator: false
          })
          this.timeoutHandle = setTimeout(() => {
            this.props.navigation.navigate('ConfirmationView', {
              bookingId: this.state.bookingId,
              bookedHandyman: this.state.bookedHandyman,
              bookingData: this.state.bookingData
            })
          }, 1000);
        }
        else if (data === "Rejected") {
          this.sendNotificationImmediately("Request Rejected", "Your request has been rejected.")
          this.setState({
            checkAcceptOrReject: false,
            requesting: false
          })
          //console.warn(data)
        }
        else {
          //console.warn(data)
        }
      }))
      .catch((error) => {
        alert('Check your internet connection.')
      });
  }

  _storeData = async (value) => {
    try {
      await AsyncStorage.setItem('booking', value);
      // console.warn(value)
    } catch (error) {
      // console.warn(error)
    }
  };

  handleConfirm = () => {
    this.setState({ dialogVisible: false, isModalVisible: false, searchHandyman: false })
    let subservices = []
    let url = 'http://' + global.ip + '/HandymanAPI/api/getSubServices?hid=' + this.state.bookedHandyman.hid
    // console.warn(url)
    fetch(url)
      .then(response => response.json().then(data => {
        // console.warn(data)        
        this.state.billDetails.forEach(element => {
          data.forEach(ele => {
            if (element.sub_service === ele.sub_service) {
              subservices.push({ "id": 0, "sub_service": ele.sub_service, "price": ele.price, "quantity": element.quantity })
            }
          })
        })
        let data1 = {
          cid: this.state.userData.id,
          hid: this.state.bookedHandyman.hid,
          type: this.state.category,
          clat: this.state.position.latitude,
          clong: this.state.position.longitude,
          status: 'Requested',
          detail: this.state.otherDetail
        }
        // console.warn(JSON.stringify({ sb: data1, ss: subservices }))
        url = 'http://' + global.ip + '/HandymanAPI/api/onRequestGenerate'
        fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sb: data1, ss: subservices })
        })
          .then(response => response.json().then(res => {
            // console.warn(res)
            // this._storeData(JSON.stringify(res))
            this.setState({
              bookingId: res.sid
            })
          }))
          .catch((error) => {
            console.warn(error)
          });

        this.timer = setInterval(() => {
          if (this.state.checkAcceptOrReject) {
            this.onAcceptOrReject()
          } else {
            clearInterval()
          }
        }, 1000)
        // console.warn(subservices)        
      })
      )
      .catch((error) => {
        console.warn(error)
      });
    // this.timeoutHandle = setTimeout(()=>{
    //   this.setState({ requesting: true, showActivityIndicator: true })
    //   // this.props.navigation.navigate('ConfirmationView', { 
    //   //   bookingId: this.state.bookingId,
    //   //   bookedHandyman: this.state.bookedHandyman
    //   //  })
    // }, 1000);

  }

  selectLocation() {
    // console.warn('called')
    this.props.navigation.navigate('PickLocation', {
      address: this.state.address,
      userId: this.state.userData.id
    })
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
    if (this.state.scheduled) {
      // this.getCurrentPosition()
    } else {
      if (this.state.bookingData !== null) {
        this.setState({
          bookingId: this.state.bookingData.sid
        })
        // let lat = parseFloat(this.state.bookingData.clat)
        // let long = parseFloat(this.state.bookingData.clong)
        // console.warn(lat)
        // this.setState({
        //   origin: new AnimatedRegion({
        //     latitude: lat,
        //     longitude: long,
        //     latitudeDelta: 0.005,
        //     longitudeDelta: 0.005
        //   })
        // })
        let url = 'http://' + global.ip + '/HandymanAPI/api/getBookedHandyman/' + this.state.bookingData.hid
        // console.warn(url)    
        fetch(url)
          .then(response => response.json().then(data => {
            // console.warn(data)
            this.setState({ bookedHandyman: data });
          }))
          .catch((error) => {
            alert(error)
          });
        this.timer = setInterval(() => {
          if (this.state.checkAcceptOrReject) {
            this.onAcceptOrReject()
          } else {
            clearInterval()
          }
        }, 1000)
      } else {
        this.getCurrentPosition()
        // navigator.geolocation.getCurrentPosition(
        //   (position) => {
        //     this.setState({
        //       latitude: position.coords.latitude,
        //       longitude: position.coords.longitude,
        //       error: null,
        //       origin: new AnimatedRegion({
        //         latitude: position.coords.latitude,
        //         longitude: position.coords.longitude,
        //         latitudeDelta: 0.005,
        //         longitudeDelta: 0.005,
        //       }),
        //       position: { latitude: position.coords.latitude, longitude: position.coords.longitude }
        //     })
        //     this.getLocation()
        //     this.goToInitialLocation()
        this.timer = setInterval(() => {
          if (this.state.searchHandyman) {
            this.onSearchHandyman()
          } else {
            clearInterval()
          }
        }, 1000)
        //   },
        //   (error) => this.setState({ error: error.message }),
        // );
      }
    }

    let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (Constants.isDevice && result.status === 'granted') {
      console.log('Notification permissions granted.')
    }
    Notifications.addListener(this.handleNotification);
  }

  handleNotification() {
    // console.warn('ok! got your notif');
  }

  renderElements = () => {
    return this.state.availableHandyman.sort((a, b) => a.rating < b.rating).map(available =>
      <TouchableOpacity key={available.hid} onPress={() => {
        this.setState({
          bookedHandyman: available
        })
        this.showDialog()
      }}>
        <HandymanRecords key={available.hid}
          handyman={available}
          clientLat={this.state.latitude}
          clientLong={this.state.longitude}
        />
      </TouchableOpacity>
    );
  }

  onSetScheduledBooking() {
    if (this.state.destination === '') {
      alert('Pick location')
    } else if (this.state.scheduledDate === null) {
      alert('Pick Date')
    } else if (this.state.scheduledTime === null) {
      alert('Pick Time')
    } else {
      let data = {
        cid: this.state.userData.id,
        hid: 0,
        type: this.state.category,
        clat: this.state.position.latitude,
        clong: this.state.position.longitude,
        status: 'Scheduled',
        detail: this.state.otherDetail,
        date: this.state.scheduledDate,
        time: this.state.scheduledTime
      }
      let url = 'http://' + global.ip + '/HandymanAPI/api/GenerateScheduledRequest'
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sb: data, ss: this.state.billDetails })
      })
        .then(response => response.json().then(res => {
          if (res === "Done") {
            alert('Your booking has been scheduled.')
            this.props.navigation.pop();
          }
        }))
        .catch((error) => {
          alert(error)
        });
    }
  }

  async onChangeDestination(destination) {
    this.setState({ destination })
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk&input=${this.state.destination}&location=${this.state.latitude}, ${this.state.longitude}&radius=2000`
    try {
      const result = await fetch(apiUrl)
      const json = await result.json()
      // console.warn(json)
      this.setState({
        predictions: json.predictions
      })
    } catch (err) {
      console.warn(err)
    }
  }

  async getLatLong(placeid) {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk`
    try {
      const result = await fetch(apiUrl)
      const json = await result.json()

      this.setState({
        favLat: json.result.geometry.location.lat,
        favLong: json.result.geometry.location.lng,
      })
      // console.warn(json.result.geometry.location.lat)
    } catch (err) {
      console.warn(err)
    }
  }

  async getLatLong(placeid, description) {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk`
    try {
      const result = await fetch(apiUrl)
      const json = await result.json()

      this.setState({
        position: {
          latitude: json.result.geometry.location.lat,
          longitude: json.result.geometry.location.lng,
        },
        destination: description,
        predictions: []
      })
      this.goToInitialLocation()
      if (!this.state.scheduled) {
        this.setState({ searchHandyman: true })
        this.timer = setInterval(() => {
          if (this.state.searchHandyman) {
            this.onSearchHandyman()
          } else {
            clearInterval()
          }
        }, 1000)
      }
    } catch (err) {
      console.warn(err)
    }
  }

  getFavoriteLocations() {
    let url = 'http://' + global.ip + '/HandymanAPI/api/getFavoritePlaces/' + this.state.userData.id
    //console.warn(url)    
    fetch(url)
      .then(response => response.json().then(data => {
        // console.warn(data)      
        this.setState({ places: data });
      }))
      .catch((error) => {
        alert(error)
      });
  }

  getFavoritePlaceLatLong(place) {
    this.setState({
      position: {
        latitude: place.lat,
        longitude: place.long
      }
    })
    this.goToInitialLocation()
    this.setState({ searchHandyman: true })
    this.timer = setInterval(() => {
      if (this.state.searchHandyman) {
        this.onSearchHandyman()
      } else {
        clearInterval()
      }
    }, 1000)
    // console.warn(this.state.position)
  }

  async addFavoritePlace(placeid) {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk`
    try {
      const result = await fetch(apiUrl)
      const json = await result.json()

      this.setState({
        favLat: json.result.geometry.location.lat,
        favLong: json.result.geometry.location.lng,
      })
      // console.warn(json.result.geometry.location.lat)
    } catch (err) {
      console.warn(err)
    }
    this.setState({
      isDialogVisible: true
    })
  }

  postFavoriteData(name) {
    this.setState({ isDialogVisible: false })
    let url = 'http://' + global.ip + '/HandymanAPI/api/addFavoritePlace'
    let data = {
      id: this.state.userData.id,
      name: name,
      lat: this.state.favLat,
      long: this.state.favLong
    }
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json().then(res => {
        // console.warn(res)
      }))
      .catch((error) => {
        //console.warn('error')
      });
  }

  removeFavoritePlace(id, name) {
    let url = 'http://' + global.ip + '/HandymanAPI/api/removeFavoritePlace/' + id + '/' + name
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json().then(res => {
        // console.warn(res)
      }))
      .catch((error) => {
        //console.warn('error')
      });
  }

  onRegionChange = region => {
    this.setState({
      position: region
    })
    this.getLocation(region.latitude, region.longitude)
    // console.warn(this.state.position)
  }

  getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        })
        this.getLocation(position.coords.latitude, position.coords.longitude)
        this.mapView.animateToRegion(
          {
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          },
          1000
        )
      },
      error => {
        console.log(error)
      }
    )
    if (!this.state.scheduled) {
      this.setState({ searchHandyman: true })
      this.timer = setInterval(() => {
        if (this.state.searchHandyman) {
          this.onSearchHandyman()
        } else {
          clearInterval()
        }
      }, 1000)
    }
  }

  renderShowLocationButton = () => {
    if (!this.state.isListingSelected) {
      return (
        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={() => {
            this.getCurrentPosition()
          }}
        >
          <MaterialCommunityIcons name='crosshairs-gps' size={25} />
        </TouchableOpacity>
      )
    }
    return
    // Should add error handling if needed too
  }

  _onMapReady = () => this.setState({ marginBottom: 0 })

  render() {
    const handymans = this.state.availableHandyman.sort((a, b) => a.rating < b.rating).map(available =>
      <TouchableOpacity key={available.hid} onPress={() => {
        this.setState({
          bookedHandyman: available
        })
        this.showDialog()
      }} onLongPress={() => {
        this.setState({
          name: available.name
        })
        this.getHandymanSubServices(available.hid)
      }}>
        <HandymanRecords key={available.hid}
          handyman={available}
          clientLat={this.state.position.latitude}
          clientLong={this.state.position.longitude}
        />
      </TouchableOpacity>
    )

    const predictions = this.state.predictions.map(prediction =>
      <View key={prediction.id} style={{ justifyContent: 'space-between', height: 40, flexDirection: 'row', top: 40, left: 0, right: 10, width: Dimensions.get('window').width * .95, backgroundColor: 'white' }}>
        <TouchableOpacity style={{ width: '90%' }} onPress={() => this.getLatLong(prediction.place_id, prediction.description)}>
          <Text style={styles.suggestionStyle}>{prediction.description}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '10%' }} onPress={() => this.addFavoritePlace(prediction.place_id)}>
          <AntDesignIcon
            name="heart"
            size={30}
            color="grey"
          />
        </TouchableOpacity>
      </View>
    )
    const places = this.state.places.map(place =>
      <View key={place.$id} style={{ justifyContent: 'space-between', height: 40, flexDirection: 'row', top: 40, left: 0, right: 10, width: Dimensions.get('window').width * .95, backgroundColor: 'white' }}>
        <TouchableOpacity style={{ width: '90%' }} onPress={() => this.getFavoritePlaceLatLong(place)}>
          <Text style={styles.suggestionStyle}>{place.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '10%' }} onPress={() => this.removeFavoritePlace(place.id, place.name)}>
          <AntDesignIcon
            name="heart"
            size={30}
            color="red"
          />
        </TouchableOpacity>
      </View>
    )
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => this.mapView = ref}
          onMapReady={this._onMapReady}
          style={{
            paddingTop: 50,
            height: (
              this.state.isModalVisible === true
            ) ? Dimensions.get('window').height * .40 :
              Dimensions.get('window').height,
            width: Dimensions.get('window').width
          }}
          showsUserLocation={true}
          region={this.state.origin}
          showsMyLocationButton={false}
          onRegionChange={this.onRegionChange}
          onPress={() => this.setState({ places: [], hideLocationButton: false })}

        >
          {
            (this.state.position !== null) ?
              <Marker
                style={{
                  left: Dimensions.get('screen').width * .50,
                  marginLeft: -24,
                  marginTop: -48,
                  position: 'absolute',
                  top: Dimensions.get('screen').height * .50
                }}
                coordinate={this.state.position}

              >
              </Marker> :
              null
          }
        </MapView>
        {this.renderShowLocationButton()}
        {(this.state.scheduled) ?
          <View style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }}>
            <View style={{ flexDirection: 'column', position: 'absolute', top: 15, left: Dimensions.get('window').width * .025 }}>
              <View style={{ flexDirection: 'column', marginBottom: 7 }}>
                <TextInput style={styles.input}
                  value={this.state.destination}
                  onTouchStart={() => this.getFavoriteLocations()}
                  autoCorrect={false}
                  placeholder="Seacrh location..."
                  onFocus={() => this.setState({ hideLocationButton: true })}
                  onEndEditing={() => this.setState({ hideLocationButton: false })}
                  onSubmitEditing={this.onSubmit}
                  onChangeText={destination =>
                    this.onChangeDestination(destination)
                  } />
              </View>
              <View style={{ flexDirection: 'column' }}>
                {(this.state.destination === '') ? places : predictions}
              </View>
            </View>
            <View style={{ flexDirection: 'column', position: 'absolute', bottom: 50, left: Dimensions.get('window').width * .025, width: '95%' }}>
              <View style={{
                flex: 1,
                justifyContent: 'center',
                marginHorizontal: '10%',
                width: '100%',
                height: "100%",
              }}>
                <DatePicker
                  style={{ width: '90%', marginBottom: 10, marginLeft: '-6%' }}
                  date={this.state.scheduledDate}
                  mode="date"
                  format="YYYY-MM-DD"
                  minDate={new Date()}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0,
                      bottom: 2
                    },
                    dateInput: {
                      marginLeft: 36,
                      backgroundColor: 'white',
                      borderRadius: 10,
                      borderColor: '#F4F6F8',
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => { this.setState({ scheduledDate: date }) }}
                />
              </View>
              <View style={{
                flex: 1,
                justifyContent: 'center',
                marginHorizontal: '10%',
                width: '100%',
                height: "100%",
              }}>
                <DatePicker
                  style={{ width: '90%', marginBottom: 10, marginLeft: '-6%' }}
                  date={this.state.scheduledTime}
                  mode="time"
                  format="hh:mm"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0,
                      bottom: 2
                    },
                    dateInput: {
                      marginLeft: 36,
                      backgroundColor: 'white',
                      borderRadius: 10,
                      borderColor: '#F4F6F8',
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(time) => { this.setState({ scheduledTime: time }) }}
                />
              </View>
              <TouchableOpacity style={styles.bottomButton} onPress={() => this.onSetScheduledBooking()}>
                <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>Schedule Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
          :
          <View style={{ flexDirection: 'column', position: 'absolute', top: 15, left: Dimensions.get('window').width * .025 }}>
            <View style={{ flexDirection: 'column', marginBottom: 7 }}>
              <TextInput style={styles.input}
                value={this.state.destination}
                onTouchStart={() => this.getFavoriteLocations()}
                autoCorrect={false}
                placeholder="Seacrh location..."
                onFocus={() => this.setState({ hideLocationButton: true })}
                onEndEditing={() => this.setState({ hideLocationButton: false })}
                onChangeText={destination =>
                  this.onChangeDestination(destination)
                } />
            </View>
            <View style={{ flexDirection: 'column' }}>
              {(this.state.destination === '') ? places : predictions}
            </View>
            {(this.state.showActivityIndicator) ?
              <View style={{ padding: 10, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', position: 'absolute', left: Dimensions.get('window').width * .40, top: Dimensions.get('window').height * .35 }}>
                <ActivityIndicator
                  // style={{}} 
                  color="grey" size="large" />
              </View> : null}
          </View>
        }
        <Modal isVisible={this.state.isModalVisible}
          style={styles.modalStyle}
          hasBackdrop={false}
          coverScreen={false}
          scrollHorizontal
          propagateSwipe
          swipeDirection={["down"]}
          onSwipeComplete={() => this.setState({ isModalVisible: false })}
        >
          <View style={{ flexDirection: 'column' }}>
            <View style={{ height: '15%', flexDirection: 'row' }}>
              <Text style={{ marginTop: 10, fontSize: 20, fontWeight: 'bold', marginLeft: 25 }}>Available Handyman</Text>
              <TouchableOpacity style={{ marginTop: 18, marginLeft: '27%', backgroundColor: 'grey', height: 30, width: 30, borderRadius: 60, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ isModalVisible: false })}>
                <Icon
                  name='x'
                  size={30}
                  color='white'
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ height: '65%' }}>
              {handymans}
            </ScrollView>
            <View style={{ height: '10%' }}>
              <Text
                style={{ height: 40, fontSize: 20, fontWeight: 'bold', paddingRight: 10, alignSelf: 'flex-end' }} >
                {'Estimated Bill: ' +
                  this.state.totalBill}
              </Text>
            </View>
          </View>
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>Confirm Booking</Dialog.Title>
            <Dialog.Description>
              Do you want to book him?
                </Dialog.Description>
            <Dialog.Button label="Cancel" onPress={() => this.handleCancel()} />
            <Dialog.Button label="Confirm" onPress={() => {
              this.handleConfirm()
              this.timeoutHandle = setTimeout(() => {
                this.setState({ requesting: true, showActivityIndicator: true })
              }, 1000);
            }} />
          </Dialog.Container>
        </Modal>
        <Modal isVisible={this.state.onLongPressModal}
          style={{
            borderRadius: 10,
            marginVertical: (Platform.OS === "ios") ? Dimensions.get('window').height * .20 : Dimensions.get('screen').height * .20,
            width: '100%',
            marginLeft: 0,
            backgroundColor: 'white',
            height: '100%',
          }}
          scrollHorizontal
          propagateSwipe
          swipeDirection={["down", "up"]}
          onSwipeComplete={() => this.setState({ onLongPressModal: false })}
        >
          <View style={{ flexDirection: 'column' }}>
            <View style={{ height: '15%', flexDirection: 'row' }}>
              <Text style={{ marginTop: 10, fontSize: 20, fontWeight: 'bold', marginLeft: 25 }}>{this.state.name} - Rates</Text>
            </View>
            <ScrollView style={{ height: '65%' }}>
              {this.renderBill()}
            </ScrollView>
            <View style={{ height: '10%' }}>
            <Text
                style={{ height: 40, fontSize: 20, fontWeight: 'bold', paddingRight: 10, alignSelf: 'flex-end' }} >
                {'Estimated Bill: ' +
                  this.state.onLongPressBill}
              </Text>
            </View>
          </View>
        </Modal>
        <DialogInput isDialogVisible={this.state.isDialogVisible}
          title={"Add Favorite Place"}
          message={"Enter name for favorite location"}
          submitInput={(inputText) => {
            this.postFavoriteData(inputText)
          }}
          closeDialog={() => this.setState({ isDialogVisible: false })}>
        </DialogInput>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  suggestionStyle: {
    fontSize: 18,
    padding: 10,
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  detailContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '40%'
  },
  displayPicStyle: {
    width: 100,
    height: 100,
    borderRadius: 10
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 5,
    marginLeft: 15,
    height: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
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
    marginRight: 10
  },
  bottomButton: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 7,
    width: '90%',
    marginLeft: "5%",
    padding: 5
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  input: {
    position: 'absolute',
    height: 45,
    fontSize: 18,
    borderWidth: 1,
    // top: (Platform.OS === "ios") ? 15 : 50,
    // left: Dimensions.get('window').width * .025,
    borderRadius: 5,
    width: Dimensions.get('window').width * .95,
    alignItems: 'center',
    borderColor: '#F4F6F8',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 5,
    shadowOpacity: 0.5,
  },
  modalStyle: {
    borderRadius: 10,
    marginTop: (Platform.OS === "ios") ? Dimensions.get('window').height * .40 : Dimensions.get('screen').height * .40,
    width: '100%',
    marginLeft: 0,
    backgroundColor: 'white',
    height: '100%',
  },
  myLocationButton: {
    backgroundColor: 'white',
    opacity: 0.7,
    position: 'absolute',
    top: 70,
    right: 10,
    padding: 10,
    elevation: 3,
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    borderRadius: 5
  }
});


export default SearchHandyman;