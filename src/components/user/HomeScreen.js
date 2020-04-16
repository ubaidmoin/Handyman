import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  Platform,
  AsyncStorage,
  Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import Modal from 'react-native-modal';
import { CheckBox, ListItem } from 'native-base';
import Spinner from 'react-native-numeric-input'
import { SearchBar } from 'react-native-elements'
import UIStepper from 'react-native-ui-stepper';
import SegmentedControlTab from "react-native-segmented-control-tab";

import { Input, Button, Header, Card, Collection } from '../common';
import CollectionView from './CollectionView';

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Home',
    headerLeft: (<IoniconsIcon
      style={{ marginLeft: 10 }}
      name='ios-menu'
      size={30}
      color='#000'
      onPress={() => navigation.toggleDrawer()}
    />)
  });

  constructor() {
    super()
    this.state = {
      services: [],
      userData: [],
      isModalVisible: false,
      subServices: [],
      counterValue: 0,
      data: [],
      searchBar: '',
      totalBill: '0',
      name: '',
      otherDetail: '',
      switchSchedule: false,
      selectedIndex: 0
    }
  }

  async componentDidMount() {
    let value = await AsyncStorage.getItem('userData')
    let data = JSON.parse(value)
    // console.warn(data)
    if (data !== null) {
      this.setState({
        userData: data
      })
      // await AsyncStorage.removeItem('userData')
      await AsyncStorage.removeItem('booking')
      // console.warn(this.state.userData)
      let booking = await AsyncStorage.getItem('booking')
      let bookingData = JSON.parse(booking)
      // console.warn(bookingData)
      if (bookingData !== null) {
        if (bookingData.status == "Requested") {
          this.props.navigation.navigate('SearchHandyman', { bookingData: bookingData, userData: this.state.userData })
        } else if (bookingData.status == "Accepted" || bookingData.status == "Arrived") {
          this.props.navigation.navigate('ConfirmationView')
        }
      }
      
    }
    let url = 'http://' + global.ip + '/HandymanAPI/api/getServices'
      // console.warn(url)
      fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json().then(data => {
          this.setState({
            services: data
          })
        }))
        .catch((error) => {
          alert(error)
        });
    // await AsyncStorage.removeItem('userData')    
  }

  handleCheckChange = (index) => {
    let subServices = [...this.state.subServices];
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
    this.setState({ subServices: subServices, totalBill: total.toString() });
    // this.setState({ data: subServices })        
  }

  handleQuantityChange = (index, value) => {
    let subServices = [...this.state.subServices];
    let item = { ...subServices[index] };
    item.quantity = value;
    if (item.quantity == 0) {
      item.checked = false
    } else if (item.quantity == 1) {
      item.checked = true
    }
    subServices[index] = item;
    this.setState({ subServices });
    this.setState({ data: subServices })
    let total = 0
    subServices.forEach(element => {
      if (element.checked === true) {
        total += element.price * element.quantity
      }
    })
    this.setState({ totalBill: total.toString() })
  }

  renderSubService = () => {
    return (
      <FlatList
        data={this.state.subServices}
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
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: Dimensions.get('window').width * .60 }}>
                <Text>   {item.sub_service}</Text>
                <View>
                  <Text>Rs.{item.price}/</Text>
                  <Text style={{ fontSize: 12, alignSelf: 'flex-end' }}>{item.unit}</Text>
                </View>
              </View>
              <View style={{ marginLeft: 10 }}>
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

  getSubServices(id) {
    let url = 'http://' + global.ip + '/HandymanAPI/api/getSubServicesDistinct?id=' + id
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json().then(data => {
        // console.warn(data)
        this.setState({
          subServices: data
        })
        this.state.subServices.forEach(element => {
          element.checked = false,
            element.quantity = 0
        })
        this.setState({
          data: this.state.subServices
        })
      }))
      .catch((error) => {
        alert('Check your internet connection')
      });
  }

  renderCollectionView = () => {
    return this.state.services.sort((a, b) => a.name > b.name).map(service =>
      <TouchableOpacity key={service.cid} onPress={() => {
        this.getSubServices(service.cid)
        this.setState({
          isModalVisible: true,
          name: service.name
        })
      }
      }>
        <CollectionView key={service.cid} service={service} userData={this.state.userData} />
      </TouchableOpacity>
    );
  }

  searchFilterFunction = text => {
    const newData = this.state.data.filter(item => {
      const itemData = `${item.sub_service.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.state.subServices.forEach(element => {
      if (element.checked) {
        newData.forEach(e => {
          if (element.sub_service === e.sub_service) {
            e.checked = true
          }
        })
      }
    })
    this.setState({
      searchBar: text,
      subServices: newData
    });
  };

  billDone() {
    this.setState({
      isModalVisible: false
    })
    let data = []
    this.state.subServices.map(service =>
      service.checked === true ? data = [...data, {
        "sub_service": service.sub_service,
        "price": service.price,
        "quantity": service.quantity,
      }] : null
    )
    // console.warn(data)

    data = [...data, { "sub_service": "Total", "price": parseInt(this.state.totalBill), "quantity": 0 }]
    //console.warn(data)
    this.props.navigation.navigate('SearchHandyman', {
      userData: this.state.userData,
      category: this.state.name,
      billDetails: data,
      totalBill: this.state.totalBill,
      otherDetail: this.state.otherDetail,
      scheduled: (this.state.selectedIndex === 0) ? false : true
    })
  }

  billSkip() {
    this.setState({
      isModalVisible: false
    })
    this.props.navigation.navigate('SearchHandyman', {
      userData: this.state.userData,
      category: this.state.name,
      billDetails: null,
      totalBill: this.state.totalBill,
      otherDetail: this.state.otherDetail
    })
  }

  toggleSwitch() {
    this.setState({
      switchSchedule: !this.state.switchSchedule
    })
  }

  handleSegmentChange = index => {
    this.setState({      
      selectedIndex: index
    });
  };

  

  render() {
    return (
      <View style={{ width: '100%', height: '100%', marginTop: 5 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: '7%', position: 'absolute', top: 15, left: 15, backgroundColor: 'white', borderRadius: 5, paddingHorizontal: 10, opacity: 0.85 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginRight: 5 }}>Scheduled Booking?</Text>
          {/* <Switch
            value={this.state.switchSchedule}
            onValueChange={() => this.toggleSwitch()}
          /> */}
          <SegmentedControlTab
          tabsContainerStyle={{width:80}}
          values={["No", "Yes"]}
          selectedIndex={this.state.selectedIndex}
          onTabPress={this.handleSegmentChange}
        />
        </View>
        {/* <Text style={{ marginTop: 30, marginLeft: 15, fontWeight: 'bold', fontSize: 30 }}>Provided Services</Text> */}
        <ScrollView style={{ marginTop: 55 }}>
          <View style={styles.collectionStyle}>
            {this.renderCollectionView()}
          </View>
        </ScrollView>
        <Modal isVisible={this.state.isModalVisible}
          style={styles.modalStyle}
          hasBackdrop={false}
          coverScreen={false}
          scrollHorizontal
          propagateSwipe
          swipeDirection={["up", "down"]}
          onSwipeComplete={() => this.setState({ isModalVisible: false })}
        >
          <View style={{ flexDirection: 'column' }}>
            <View style={{ height: '15%', flexDirection: 'row' }}>
              <Text style={{ marginTop: 15, fontSize: 20, fontWeight: 'bold', marginLeft: 25 }}>Available Services</Text>
              <TouchableOpacity style={{ marginTop: 15, marginLeft: '27%', backgroundColor: 'grey', height: 30, width: 30, borderRadius: 60, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ isModalVisible: false })}>
                <Icon
                  name='x'
                  size={30}
                  color='white'
                />
              </TouchableOpacity>
            </View>
            <SearchBar
              placeholder="Search service..."
              value={this.state.searchBar}
              color="white"
              onChangeText={text => this.searchFilterFunction(text)}
              autoCorrect={false}
            />
            <ScrollView style={{ height: '50%' }}>
              {this.renderSubService()}
            </ScrollView>
            <View style={{ flexDirection: 'column' }}>
              <View>
                <TextInput
                  style={{ height: 60, width: Dimensions.get('window').width * .95, backgroundColor: 'lightgrey', borderRadius: 5, marginHorizontal: '2.5%', marginTop: 5 }}
                  placeholder="Others..."
                  autoCorrect={false}
                  multiline={true}
                  value={this.state.otherDetail}
                  onChangeText={otherDetail => this.setState({ otherDetail })}
                />
              </View>
              <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginLeft: Dimensions.get('window').width * .48 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Estimated Bill</Text>
                <TextInput
                  value={this.state.totalBill}
                  editable={false}
                  style={{
                    color: '#000',
                    paddingRight: 5,
                    paddingLeft: 5,
                    fontSize: 18,
                    lineHeight: 23,
                    flex: 2
                  }}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginLeft: Dimensions.get('window').width * .50, marginTop: 15 }}>
              {(this.state.selectedIndex === 1) ? null : <TouchableOpacity style={styles.skipButton} onPress={() => this.billSkip()}>
                <Text style={{ fontSize: 22 }}>Skip</Text>
              </TouchableOpacity>}
              <TouchableOpacity style={styles.doneButton} onPress={() => {
                this.billDone()
              }
              }>
                <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Done</Text>
              </TouchableOpacity>
            </View>
            <View>
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
    justifyContent: 'center',
    flexDirection: 'column',
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
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
    borderRadius: 30,
  },
  textButtonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '60%',
    borderRadius: 30,
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
  collectionStyle: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  modalStyle: {
    borderRadius: 10,
    marginTop: (Platform.OS === 'ios') ? Dimensions.get('screen').height * .05 : Dimensions.get('screen').height * .05,
    width: '100%',
    marginLeft: 0,
    backgroundColor: 'white',
    height: '100%',
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
  skipButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingVertical: 5,
    paddingHorizontal: 15
  }
});


export default HomeScreen;