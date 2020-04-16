import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/Octicons';
import { Dropdown } from 'react-native-material-dropdown';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Input, Button, Header, Card, Collection } from '../common';


class Settings extends Component {

  static navigationOptions = ({ navigation }) => ({
    // title: 'Edit Profile',
    // headerLeft: (<Icon
    //   style={{ marginLeft: 10 }}
    //   name='three-bars'
    //   size={30}
    //   color='#000'
    //   onPress={() => navigation.toggleDrawer()}
    // />),
  });

  state = {
    handymanData: [],
    rdbGender: [
      { label: "2", value: "2" },
      { label: "5", value: "5" },
      { label: "7", value: "7" },
      { label: "10", value: "10" },
      { label: "12", value: "12" },
      { label: "15", value: "15" },
    ],
    distance: '',
    placeholderValue: { label: '', value: '' },
    serviceName: '',
    servicePrice: '',
    editServiceName: '',
    editServicePrice: '',
    services: [],
    refreshing: false
  }

  async componentDidMount() {
    let value = await AsyncStorage.getItem('userData')
    let data = JSON.parse(value)
    if (data !== null) {
      this.setState({
        handymanData: data
      })
    }
    this.getCurrentRange()
    this.getSubServices()
  }

  getCurrentRange() {
    let url = 'http://' + global.ip + '/HandymanAPI/api/GetRange?id=' + this.state.handymanData.id
    // console.warn(url)
    fetch(url)
      .then(response => response.json().then(data => {
        this.setState({
          placeholderValue: { label: data + '', value: data + '' }
        })
      }))
      .catch((error) => {
        alert(error)
      });
  }

  onButtonPress() {
    if (this.state.distance !== '') {
      let url = 'http://' + global.ip + '/HandymanAPI/api/UpdateRange?id=' + this.state.handymanData.id + '&range=' + this.state.distance
      // console.warn(url)
      fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json().then(data => {
          console.warn(data)
        }))
        .catch((error) => {
          alert(error)
        });
    } else {
      alert('Select range from picker.')
    }
  }

  getSubServices() {
    fetch('http://' + global.ip + '/HandymanAPI/api/getSubServices?hid=' + this.state.handymanData.id)
      .then(response => response.json().then(data => {
        // console.warn(data)
        this.setState({
          services: data.sort((a, b) => a.sub_service > b.sub_service)
        })
        var data = [...this.state.services]
        data.forEach(element =>
          element.edit = false
        )
        this.setState({ services: data })
      }))
      .catch((error) => {
        console.warn(error);
      });
  }

  onEditClick(index) {
    let data = [...this.state.services]
    let item = data[index]
    item.edit = !item.edit
    data.forEach(element => {
      if (element.id !== item.id) {
        item.edit = false
      }
    })
    this.setState({ services: data })
  }

  onDoneClick(index) {
    let data = [...this.state.services]
    let item = data[index]
    item.edit = !item.edit
    data.forEach(element => {
      if (element.id !== item.id) {
        item.edit = false
      }
    })
    this.setState({ services: data })

    let obj = []
    obj = {
      cid: item.cid,
      sub_service: item.sub_service,
      price: item.price,
      status: item.status,
      hid: item.hid,
      approval_status: "Pending"
    }
    fetch('http://' + global.ip + '/HandymanAPI/api/editSubServiceHandyman', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    })
      .then(response => response.json().then(data => {
        // console.warn(data)
        this.getSubServices()
      }))
      .catch((error) => {
        console.warn(error);
      });
  }

  onPriceChangeText(value, index) {
    let data = [...this.state.services]
    let item = data[index]
    item.price = value
    this.setState({ services: data })
  }

  refreshing() {
    this.setState({
        refreshing: true
    })
    this.componentDidMount()
    this.setState({
        refreshing: false
    })

}

  renderSubServices() {
    return (<FlatList
      data={this.state.services}
      keyExtractor={item => item.sub_service}
      onRefresh={() => this.refreshing()}
      refreshing={this.state.refreshing}
      renderItem={({ item, index }) => (
        <View key={item.cid} style={{ flexDirection: 'row', height: 80, alignItems: 'center', marginHorizontal: 15, marginVertical: 3, backgroundColor: 'white', borderRadius: 8 }}>

          {(item.edit === false) ?
            <TouchableOpacity
              style={{ position: 'absolute', right: 5, top: 5 }}
              onPress={() => this.onEditClick(index)}
            >
              <AntDesignIcon
                name="edit"
                size={20}
                color="black"
              />
            </TouchableOpacity> :
            <TouchableOpacity
              style={{ position: 'absolute', right: 5, top: 5 }}
              onPress={() => this.onDoneClick(index)}
            >
              <MaterialIcons
                name="done"
                size={20}
                color="black"
              />
            </TouchableOpacity>
          }
          {(item.edit === false) ?
            (<View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'space-between', width: '75%' }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.sub_service}</Text>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Rs. {(item.newPrice !== null) ? item.newPrice : item.price}</Text>
            </View>
            ) :
            (<View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'space-between', width: '75%' }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 16 }}>{item.sub_service}</Text>
              <View style={styles.flatListInputContainer}>
                <TextInput
                  style={styles.inputs}
                  secureTextEntry={false}
                  value={item.price + ''}
                  onChangeText={value => this.onPriceChangeText(value, index)}
                  keyboardType="number-pad"
                  placeholder='Price'
                />
              </View>
            </View>)
          }
          <View style={{ position: 'absolute', right: 25, top: 15, flexDirection: 'column' }}>
            {(item.approval_status !== "Rejected") ? <EntypoIcon
              name={(item.approval_status !== "Pending") ? (item.approval_status === null) ? null : "check" : "cross"}
              size={30}
              color={(item.approval_status !== "Pending") ? (item.approval_status === null) ? null : "green" : "red"}
            /> : null}
            <Text style={{ marginTop: (item.approval_status === "Rejected") ? 20 : null, fontSize: 10, color: (item.approval_status !== "Pending") ? (item.approval_status === null) ? null : "green" : "red" }}>
              {
                (item.approval_status !== "Pending") ? (item.approval_status === null) ? null : (item.approval_status !== "Rejected") ? 'Approved' : 'Rejected' : 'Pending'
              }
            </Text>
          </View>
        </View>
      )}
    />)
  }

  render() {
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: '#EBEFF3' }}>
        <View style={{ width: '80%', marginLeft: '10%' }}>
          {/* <Dropdown data={this.state.categories.sort((a, b) => a.value > b.value)} label='Available Categories' />
          <TouchableOpacity style={styles.buttonContainer}>
            <Button>
              Request new Category
                </Button>
          </TouchableOpacity> */}
          <View style={{ alignItems: 'center', marginTop: 20, flexDirection: 'row', paddingVertical: 30 }}>
            <Text>
              Set range distance
            </Text>
            <RNPickerSelect
              onValueChange={(value) => this.setState({ distance: value })}
              items={this.state.rdbGender}
              placeholder={{ label: 'Select range', value: '' }}
              placeholderTextColor='grey'
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              onPress={this.onButtonPress.bind(this)}
            >Update</Button>
          </View>
        </View>
        <View style={{ backgroundColor: 'white', opacity: 0.9, marginHorizontal: '20%', padding: 10, borderRadius: 10, alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            Sub Services
          </Text>
        </View>
        <View style={{ marginTop: 10, height: 380 }}>
          {this.renderSubServices()}
        </View>
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
    marginLeft: '10%',
    width: '70%',
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
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  flatListInputContainer: {
    marginTop: 5,
    marginBottom: 5,
    borderColor: '#F4F6F8',
    borderWidth: 1,
    width: '30%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F4F6F8',
    justifyContent: 'center'
  }
});


export default Settings;