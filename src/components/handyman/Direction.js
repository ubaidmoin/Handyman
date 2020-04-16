import React, { Component } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import { CheckBox, ListItem } from 'native-base';
import Icon from 'react-native-vector-icons/Octicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import StarRating from 'react-native-star-rating';
import Spinner from 'react-native-numeric-input';
import { SearchBar } from 'react-native-elements';
import Dialog from 'react-native-dialog';
import DialogInput from 'react-native-dialog-input';
import DatePicker from 'react-native-datepicker';
import UIStepper from 'react-native-ui-stepper';

import { Input, Button, Header, Card, CardSection } from '../common';
import RenderBill from './RenderBill';
import RenderService from './RenderService';
import Services from './Services';

var moment = require('moment');
class Direction extends Component {
  static navigationOptions = {
    title: 'Work in Progress',
    headerLeft: null
  };

  constructor(props) {
    super(props)
    this.state = {
      checkCanceled: false,
      newRequest: this.props.navigation.getParam('newRequest', 0),
      total: 0,
      checked: [],
      services: [],
      providedServices: [],
      isModalVisible1: false,
      isModalVisible2: false,
      google_api_key: 'AIzaSyDNA9nURgVDmwVFFOatLwYS-mGtOsGelqY',
      error: null,
      markerValue: { latitude: 0, longitude: 0 },
      origin: null,
      coords: null,
      askedServices: this.props.navigation.getParam('askedServices', 0),
      data: [],
      totalBill: 0,
      rating: 0,
      itemPrice: '',
      itemQuantity: 0,
      itemName: '',
      onFocusPrice: true,
      onFocusService: true,
      onFocusEST: true,
      timeLeft: {
        "h": 0,
        "m": 0,
        "s": 0
      },
      dialogVisible: false,
      handymanData: this.props.navigation.getParam('handymanData', null),
      time: new Date(),
      seconds: 0,
      isDialogVisible: false,
      paidAmount: 0,
      onFocuspaidAmount: true
    }
    this.timerTicker = 0
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  handleNo = () => {
    this.setState({
      dialogVisible: false
    });
  };

  handleYes = () => {
    this.setState({ dialogVisible: false })
    this.timeoutHandle = setTimeout(() => {
      this.setState({ isDialogVisible: true })
    }, 500);
  }

  addTimeForAvailability(time) {
    this.setState({ isDialogVisible: false, isModalVisible1: true })
    this.timeoutHandle = setTimeout(() => {
      this.setAsAvailable()
    }, parseInt(time) * 60);
  }

  onWorkDone = () => {
    this.setState({
      isModalVisible1: !this.state.isModalVisible1
    })
  }

  onSubmitClick = () => {
    this.removeItemValue('booking')
    this.setState({ isModalVisible2: false })
    let data = []
    this.state.services.map(service =>
      service.checked === true ? data = [...data, { "sub_service": service.sub_service, "price": service.price, "quantity": service.quantity }] : null
    )

    data = [...data, { "sub_service": "Total", "price": parseInt(this.state.totalBill), "quantity": 0 }]

    // console.warn(data)
    let url = 'http://' + global.ip + '/HandymanAPI/api/generateBill/' + this.state.newRequest.sid + '/' + this.state.rating + '/' + this.state.paidAmount + '/' + this.state.totalBill
    //console.warn(url)
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
        this.props.navigation.navigate('Home', { available: true })
      }))
      .catch((error) => {
        alert('Error.')
      });
  }

  onDoneClick = () => {
    //console.warn(this.state.services)
    let url = 'http://' + global.ip + '/HandymanAPI/api/getCredits?sid=' + this.state.newRequest.sid
    fetch(url)
      .then(response => response.json().then(data => {
        //console.warn(data)
        if (data.customer > 0) {
          this.state.services.push({
            sub_service: 'Customer Credit',
            price: data.customer,
            checked: true
          })
          this.setState({
            totalBill: parseInt(this.state.totalBill) + (-data.customer)
          })
        } else if (data.customer < 0) {
          this.state.services.push({
            sub_service: 'Customer Credit',
            price: data.customer,
            checked: true
          })
          this.setState({
            totalBill: parseInt(this.state.totalBill) + (data.customer)
          })
        }
        if (data.handyman > 0) {
          this.state.services.push({
            sub_service: 'Handyman Credit',
            price: data.handyman,
            checked: true
          })
          this.setState({
            totalBill: parseInt(this.state.totalBill) + data.handyman
          })
        } else if (data.handyman < 0) {
          this.state.services.push({
            sub_service: 'Handyman Credit',
            price: data.handyman,
            checked: true
          })
          this.setState({
            totalBill: parseInt(this.state.totalBill) + (data.handyman)
          })
        }
        this.setState({
          paidAmount: this.state.totalBill
        })
      }))
      .catch((error) => {
        console.warn(error)
      });
    this.setState({ isModalVisible1: false })
    this.timeoutHandle = setTimeout(() => {
      this.setState({ isModalVisible2: true })
    }, 500);
  }

  async onCanceled() {
    let url = 'http://' + global.ip + '/HandymanAPI/api/OnCancelBooking?id=' + this.state.newRequest.sid
    return fetch(url)
      .then(response => response.json().then(data => {
        //console.warn(data)
        if (data === "Canceled") {
          this.props.navigation.navigate('Home')
        }
      }))
      .catch((error) => {
        alert('Check your internet connection.')
      });
  }

  getSubServices() {
    let url = 'http://' + global.ip + '/HandymanAPI/api/getSubServices?hid=' + this.state.handymanData.id
    return fetch(url)
      .then(response => response.json().then(data => {
        this.setState({
          services: data
        })
        this.state.services.forEach(element => {
          element.checked = false,
            element.quantity = 0
        });

        this.state.services.forEach(element => {
          this.state.askedServices.forEach(ele => {
            if (element.sub_service === ele.sub_service) {
              element.quantity = ele.quantity
              element.checked = true
            }
          })
        })

        this.state.services.sort((a, b) => a.checked < b.checked)
        let total = 0
        this.state.services.forEach(element => {
          element.checked === true ?
            total += element.price * element.quantity :
            total += 0
        });
        this.setState({ totalBill: total + '' })
      }))
      .catch((error) => {
        alert(error)
      });
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          origin: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          markerValue: {
            latitude: this.state.newRequest.lat,
            longitude: this.state.newRequest.long
          }
        })
        // this.getDirections(`${this.state.origin.latitude, this.state.origin.longitude}`, `${this.state.markerValue.latitude, this.state.markerValue.longitude}`)
      })

    this.getSubServices()

    // this.setState({        
    //   services: [{"id": 1,"sub_service":"TV Repair", "price": 500,"checked":false},
    //   {"id": 2,"sub_service":"AC Installment", "price": 500,"checked":false},
    //    {"id": 3,"sub_service":"Breaker Installment", "price": 500,"checked":false},
    //     {"id": 4,"sub_service":"Switch Repair", "price": 500,"checked":false}]
    // })       
    // this.timer = setInterval(()=> {
    //   if (this.state.checkCanceled === false) {
    //     this.onCanceled()
    //   } else {
    //     clearInterval()
    //   }
    //   }, 1000)
  }

  renderBill = () => {
    return this.state.services.map(service =>
      service.checked === true ?
        <RenderBill key={service.sub_service} service={service} /> : null
    )
  }

  renderServices() {
    return this.state.askedServices.map(service =>
      <RenderService key={service.sub_service} service={service} />)
  }

  searchFilterFunction = text => {
    const newData = this.state.data.filter(item => {
      const itemData = `${item.sub_service.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      searchBar: text,
      services: newData
    });
  };

  onAddNewService() {
    let services = [...this.state.services];
    let newService = { "sub_service": this.state.itemName, "price": this.state.itemPrice, "quantity": this.state.itemQuantity, "checked": true }
    services = [...services, newService]
    services = services.sort((a, b) => a.sub_service < b.sub_service).sort((a, b) => a.checked < b.checked)
    let total = 0
    services.forEach(element => {
      element.checked === true ?
        total += element.price * element.quantity :
        total += 0
    });
    this.setState({
      totalBill: total,
      itemName: '',
      itemPrice: '',
      itemQuantity: 0,
      services: services
    })
  }

  handleCheckChange = (index) => {
    let subServices = [...this.state.services];
    let item = { ...subServices[index] };
    if (item.checked) {
      item.checked = false
      item.quantity = 0
    } else {
      item.checked = true
      item.quantity = 1
    }
    subServices[index] = item;
    let total = 0
    subServices.forEach(element => {
      if (element.checked) {
        // console.warn(element.price)
        total += element.price
      }
    });
    this.setState({ services: subServices, totalBill: total.toString() });
    // this.setState({ data: subServices })        
  }

  handleQuantityChange = (index, value) => {
    let services = [...this.state.services];
    let item = { ...services[index] };
    item.quantity = value;
    if (item.quantity == 0) {
      item.checked = false
    } else if (item.quantity == 1) {
      item.checked = true
    }
    services[index] = item;
    this.setState({ services });
    this.setState({ data: services })
    let total = 0
    services.forEach(element => {
      if (element.checked === true) {
        total += element.price * element.quantity
      }
    })
    this.setState({ totalBill: total.toString() })
  }

  handleQuantityChange1 = (value) => {
    this.setState({
      itemQuantity: value
    })
  }

  setAsAvailable() {
    let data = []
    data = {
      id: this.state.handymanData.id,
      lat: parseFloat(this.state.newRequest.lat),
      long: parseFloat(this.state.newRequest.long),
      available: true
    }
    //console.warn(data)
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
        //console.warn(data)
      }))
      .catch((error) => {
        alert('Error.')
      });
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  startTimer() {
    if (this.timerTicker == 0 && this.state.seconds > 0) {
      // console.warn("called")
      this.timerTicker = setInterval(() =>
        this.countDown(), 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      timeLeft: this.secondsToTime(seconds),
      seconds: seconds,
    });
    // console.warn(this.state.seconds)

    // Check if we're at zero.
    if (seconds == 0) {
      this.setState({
        dialogVisible: true
      })
      clearInterval(this.timerTicker);
    }
  }

  setAvailabilityTimer() {

    var start = moment(new Date(), "HH:mm:ss");
    var end = moment(this.state.time, "HH:mm:ss");
    var seconds = end.diff(start, 'seconds');
    this.setState({
      seconds: seconds
    })
    // console.warn(seconds)

    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ timeLeft: timeLeftVar });
    this.timeoutHandle = setTimeout(() => {
      this.startTimer()
    }, 100);
  }

  renderService = () => {
    return (
      <FlatList
        data={this.state.services}
        keyExtractor={item => item.sub_service}
        renderItem={({ item, index }) =>
          <ListItem
            onPress={() => {
              this.handleCheckChange(index)

            }}>
            <CheckBox
              key={item.cid}
              color='black'
              onPress={() => this.handleCheckChange(index)}
              checked={item.checked} />
            <View style={{ flexDirection: 'row', height: 30, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: Dimensions.get('window').width * .60 }}>
                <Text>   {item.sub_service}</Text>
                <Text>{item.price}</Text>
              </View>
              <View>
                {/* <Spinner
                  key={item.cid}
                  value={item.quantity}
                  onChange={value => this.handleQuantityChange(index, value)}
                  totalWidth={90}
                  totalHeight={30}
                  iconSize={25}
                  valueType='real'
                  rounded
                  textColor='black'
                  iconStyle={{ color: 'white' }}
                  upDownButtonsBackgroundColor='black'
                  minValue={0}
                  type="up-down"
                /> */}
                <UIStepper
                  key={item.cid}
                  value={item.quantity}
                  displayValue={true}
                  onValueChange={(value) => this.handleQuantityChange(index, value)}
                  tintColor='black'
                  borderColor='black'
                  textColor='black'
                  width={70}
                  height={25}
                  minValue={0}
                />
              </View>
            </View>
          </ListItem>
        }
      />
    );
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

  showTime() {
    return (this.state.timeLeft.h + ":" + this.state.timeLeft.m + ":" + this.state.timeLeft.s)
  }

  render() {
    return (
      <View style={{ width: '100%', height: '100%' }}>
        <View style={{ height: 350, flexDirection: 'column' }}>
          <View>
            <Text style={{ marginTop: 10, fontSize: 13, fontWeight: 'bold', marginLeft: 25 }}>Set estimated time to complete your work.</Text>
          </View>
          <View style={styles.container}>
            <DatePicker
              style={{ width: '75%', marginBottom: 20, marginLeft: '-6%' }}
              date={this.state.time}
              mode="time"
              is24Hour={false}
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
                  backgroundColor: '#F4F6F8',
                  borderRadius: 10,
                  borderColor: '#F4F6F8',
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(time) => { this.setState({ time: time }) }}
            >
            </DatePicker>
            <TouchableOpacity onPress={() => this.setAvailabilityTimer()} style={{ marginTop: -20 }}>
              <MaterialIcon
                name="done"
                size={30}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={{ marginTop: 10, fontSize: 15, fontWeight: 'bold', marginLeft: 25 }}>Customer Details</Text>
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
          </View>
          <View>
            <Text style={{ marginTop: 18, fontSize: 15, fontWeight: 'bold', marginLeft: 25 }}>Required Services Details</Text>
            {this.renderServices()}
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Text style={{ fontSize: 50, fontWeight: 'bold' }}>
              {this.showTime()}
            </Text>
            <Text>
              Time Left
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.bottomButton} onPress={this.onWorkDone.bind()}>
          <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>Work Done</Text>
        </TouchableOpacity>
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Work Done</Dialog.Title>
          <Dialog.Description>
            Are you done with your job?
                </Dialog.Description>
          <Dialog.Button label="No" onPress={() => this.handleNo()} />
          <Dialog.Button label="Yes" onPress={() => this.handleYes()} />
        </Dialog.Container>
        <DialogInput isDialogVisible={this.state.isDialogVisible}
          title={"Set Availability"}
          message={"Enter minutes, when you want to get available."}
          submitInput={(inputText) => {
            this.addTimeForAvailability(inputText)
          }}
          closeDialog={() => this.setState({ isDialogVisible: false, isModalVisible1: true })}>
        </DialogInput>
        <Modal isVisible={this.state.isModalVisible1}
          style={styles.modalStyle}
          scrollHorizontal
          propagateSwipe
          swipeDirection={["down"]}
          onSwipeComplete={() => this.setState({ isModalVisible1: false })}
        >
          <View style={{ flexDirection: 'column' }}>
            <View style={{ height: '10%', flexDirection: 'row' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 25, marginTop: 15 }}>Select Provided Services</Text>
            </View>
            <SearchBar
              placeholder="Search service..."
              value={this.state.searchBar}
              color="white"
              onChangeText={text => this.searchFilterFunction(text)}
              autoCorrect={false}
            />
            <ScrollView style={{ height: '45%' }}>
              {this.renderService()}
            </ScrollView>
            <View style={{ flexDirection: 'column' }}>
              <View>
                <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 25, marginTop: 15 }}>Add other services</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '5%' }}>
                <View style={(this.state.onFocusService) ? {
                  borderColor: 'grey',
                  borderWidth: 1,
                  width: Dimensions.get('window').width * .45,
                  height: 35,
                  borderRadius: 10,
                  backgroundColor: '#F4F6F8',
                  flexDirection: 'column'
                } : {
                    borderColor: '#F4F6F8',
                    borderWidth: 1,
                    width: Dimensions.get('window').width * .45,
                    height: 35,
                    borderRadius: 10,
                    backgroundColor: '#F4F6F8',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}>
                  {
                    (this.state.onFocusService) ?
                      <Text style={{ backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 80 }}>
                        Service Name
                    </Text> :
                      null
                  }
                  <TextInput
                    style={styles.inputs}
                    placeholder={(this.state.onFocusService ? null : "Service")}
                    autoCapitalize="words"
                    autoCorrect={true}
                    multiline={true}
                    value={this.state.itemName}
                    onChangeText={itemName => this.setState({ itemName })}
                    onFocus={() => this.setState({ onFocusService: true })}
                    onBlur={() => this.setState({ onFocusService: false })}
                  />
                </View>
                <View style={(this.state.onFocusPrice) ? {
                  borderColor: 'grey',
                  borderWidth: 1,
                  width: Dimensions.get('window').width * .15,
                  height: 35,
                  borderRadius: 10,
                  backgroundColor: '#F4F6F8',
                  flexDirection: 'column'
                } : {
                    borderColor: '#F4F6F8',
                    borderWidth: 1,
                    height: 35,
                    borderRadius: 10,
                    width: Dimensions.get('window').width * .15,
                    backgroundColor: '#F4F6F8',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}>
                  {
                    (this.state.onFocusPrice) ?
                      <Text style={{ backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 32 }}>
                        Price
                    </Text> :
                      null
                  }
                  <TextInput
                    style={styles.inputs}
                    placeholder={(this.state.onFocusPrice) ? null : "Price"}
                    autoCorrect={false}
                    keyboardType="number-pad"
                    value={this.state.itemPrice}
                    onChangeText={itemPrice => this.setState({ itemPrice })}
                    onFocus={() => this.setState({ onFocusPrice: true })}
                    onBlur={() => this.setState({ onFocusPrice: false })}
                  />
                </View>
                <Spinner
                  value={this.state.itemQuantity}
                  onChange={value => this.handleQuantityChange1(value)}
                  totalWidth={90}
                  totalHeight={30}
                  iconSize={25}
                  valueType='real'
                  rounded
                  textColor='black'
                  iconStyle={{ color: 'white' }}
                  upDownButtonsBackgroundColor='black'
                  minValue={0}
                  type="up-down"
                />
                <TouchableOpacity onPress={() => this.onAddNewService()}>
                  <Icon
                    name="plus-small"
                    size={30}
                    color="black"
                  />
                </TouchableOpacity>

              </View>
              <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginLeft: Dimensions.get('window').width * .48 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Total Bill</Text>
                <Text style={{
                  color: '#000',
                  paddingRight: 5,
                  paddingLeft: 5,
                  fontSize: 18,
                  lineHeight: 23,
                  flex: 2
                }}
                >{this.state.totalBill}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginLeft: Dimensions.get('window').width * .60, marginTop: 15 }}>
              <TouchableOpacity style={styles.doneButton} onPress={() => this.onDoneClick()}>
                <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalVisible2}
          style={{
            borderRadius: 10,
            marginTop: Dimensions.get('screen').height * .35,
            width: '100%',
            marginLeft: 0,
            backgroundColor: 'white',
            height: '100%'
          }}
          scrollHorizontal
          propagateSwipe
          hasBackdrop={false}
          swipeDirection={["down"]}
          onSwipeComplete={() => this.setState({ isModalVisible2: false })}
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
                <Text style={{ fontSize: 15 }}>{this.state.totalBill}</Text>
              </View>

              <View style={(this.state.onFocuspaidAmount) ? {
                borderColor: 'grey',
                borderWidth: 1,
                width: Dimensions.get('window').width * .90,
                height: 35,
                borderRadius: 10,
                backgroundColor: '#F4F6F8',
                flexDirection: 'column',
                marginTop: 25,
                marginLeft: 15,
                marginBottom: 15
              } : {
                  borderColor: '#F4F6F8',
                  borderWidth: 1,
                  width: Dimensions.get('window').width * .90,
                  height: 35,
                  borderRadius: 10,
                  backgroundColor: '#F4F6F8',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  marginTop: 25,
                  marginLeft: 15,
                  marginBottom: 15
                }}>
                {
                  (this.state.onFocuspaidAmount) ?
                    <Text style={{ backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 80 }}>
                      Paid Amount
                    </Text> :
                    null
                }
                <TextInput
                  style={styles.inputs}
                  placeholder={(this.state.onFocuspaidAmount ? null : "Paid Amount")}
                  keyboardType="number-pad"
                  value={this.state.paidAmount.toString()}
                  onChangeText={paidAmount => this.setState({ paidAmount })}
                  onFocus={() => this.setState({ onFocuspaidAmount: true })}
                  onBlur={() => this.setState({ onFocuspaidAmount: false })}
                />
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
    width: '100%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    flexDirection: 'row'
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
    marginTop: Dimensions.get('screen').height * .10,
    width: '100%',
    marginLeft: 0,
    backgroundColor: 'white',
    height: '100%'
  },
  doneButton: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 2,
    marginLeft: 5,
    paddingVertical: 5,
    paddingHorizontal: 15
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 5,
    borderColor: '#F4F6F8',
    borderWidth: 1,
    width: '80%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F4F6F8',
    justifyContent: 'center',
  },
  inputContainerOnFocus: {
    marginTop: 5,
    marginBottom: 5,
    borderColor: 'grey',
    borderWidth: 1,
    width: '80%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F4F6F8',
    flexDirection: 'column',
  },
  inputs: {
    height: 45,
    marginLeft: 15,
    flex: 1
  }
});


export default Direction;