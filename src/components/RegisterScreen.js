import React, { Component } from 'react';
import {  
  ScrollView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Platform,
  Vibration,
  TextInput,
  FlatList
} from 'react-native';
import { 
  Container, 
  Header, 
  Content, 
  ListItem, 
  Text, 
  Radio, 
  Right, 
  Left 
} from 'native-base';
import DatePicker from 'react-native-datepicker';
import SwitchSelector from "react-native-switch-selector";
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Input, Button } from './common';

class RegisterScreen extends Component {

  state = { rdbOptions: [] };

  constructor() {
    super()
    this.state = {
      rdbOptions: [
        { label: "Customer", value: "Customer" },
        { label: "Handyman", value: "Handyman" }
      ],
      rdbGender: [
        { label: "Male", value: "M" },
        { label: "Female", value: "F" }
      ],
      passHide: true,
      gender: '',
      name: '',
      email: '',
      password: '',
      dob: new Date(),
      contact: '',
      selectedOption: '',
      onFocusName: true,
      onFocusEmail: true,
      onFocusPassword: true,
      onFocusContact: true,  
      isModalVisible: false,
      categories: [],
      selectedCategory: 0
    }
  }

  componentDidMount() {
    this.setState({
      selectedOption: this.state.rdbOptions[0].value,
    })
  }

  showCategories(){
    if (this.state.selectedOption === "Handyman"){
      let url = 'http://' + global.ip + '/HandymanAPI/api/getCategoriesNames'
    fetch(url)
      .then(response => response.json().then(data => {
        this.setState({
          categories: data
        })
        // console.warn(data)
      }))
      .catch((error) => {
        alert('Error.')
      });
    this.setState({isModalVisible: true})
    } else {
      this.onButtonPress()
    }
  }
  onButtonPress() {
    let data = []
    let url = ''
    if (this.state.selectedOption === "Customer") {
      url = 'http://' + global.ip + '/HandymanAPI/api/clientSignup'
      data = JSON.stringify({
        client: {
          id: 0,
          name: this.state.name,
          contact: this.state.contact,
          gender: this.state.gender,
          dob: this.state.dob,
          rating: 5,
          bookings: 1,
          image: null
        },
        user: {
          email: this.state.email,
          password: this.state.password,
          type: "Client",
          status: true
        }
      })
    } else {
      url = 'http://' + global.ip + '/HandymanAPI/api/handymanSignup'
      data = JSON.stringify({
        handyman: {
          id: 0,
          name: this.state.name,
          contact: this.state.contact,
          gender: this.state.gender,
          dob: this.state.dob,
          rating: 5,
          bookings: 1,
          image: null,
          available: 0,
          range: 10
        },
        user: {
          email: this.state.email,
          password: this.state.password,
          type: "Handyman",
          status: false
        },
        handymanType:{
          cid: this.state.selectedCategory,
          hid: 0
        }
      })
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: data
    })
      .then(response => response.json().then(data => {
        // console.warn(data)
        if (data === "User already exists.") {
          alert('User already exists.')
        } else {
          alert('Account successfully registered.')
        }
      }))
      .catch((error) => {
        alert('Error.')
      });
      this.setState({isModalVisible: false})
  }

  onClickListener() {
    this.props.navigation.navigate('Login');
  }

  onRadioChange(index){
    let categories = [...this.state.categories]
    let item = categories[index]
    item.checked = true
    this.setState({
      selectedCategory: index + 1
    })
    categories.forEach(element => {
      (element.name !== item.name) ? 
      element.checked = false :
      null
    })
    this.setState({categories})
  }

  renderHandyman = () => {
    return (
      <FlatList
        data={this.state.categories}
        keyExtractor={item => item.name}
        renderItem={({ item, index }) =>
          <ListItem
            onPress={() => {
              this.onRadioChange(index)
            }}>            
            <Left>
              <Text>{item.name}</Text>
            </Left>
            <Right>
              <Radio selected={item.checked} />
            </Right>
          </ListItem>          
        }
      />
    );
  }

  onDone(){

  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={{ width: '100%', height: '100%' }}>
        <View style={{ width: '100%', height: '100%', paddingTop: 100 }}>
          <ScrollView >
            <View style={styles.container}>
              <View style={{
                width: '80%',
                height: 55,
                marginBottom: 20,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text>Sign in as</Text>
                <SwitchSelector
                  initial={0}
                  onPress={value => {this.setState({ selectedOption: value }); }}
                  textColor='grey'
                  selectedColor='black'
                  buttonColor='lightgrey'
                  borderColor='#F5FCFF'
                  backgroundColor='#F5FCFF'
                  hasPadding
                  options={this.state.rdbOptions}
                />
              </View>
              <View style={(this.state.onFocusName) ? styles.inputContainerOnFocus : styles.inputContainer}>
                {/* <MaterialIcon
                  style={{ marginLeft: 15, marginTop: 3 }}
                  name='person'
                  size={30}
                  color='#000'
                /> */}
                {
              (this.state.onFocusName) ?
                <Text style={(this.state.onFocusName !== true) ? { marginLeft: 5, backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 60 } : { marginLeft: 5, backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 60 }}>
                  Full Name
            </Text> :
                null
            }
            {/* <View style={(this.state.onFocusName) ? {flexDirection: 'row', justifyContent:'center', marginTop: -13} :{flexDirection: 'row', justifyContent:'center', }}>
            <MaterialIcon
                  style={{ marginLeft: 5, marginTop: 7}}
                  name='person'
                  size={30}
                  color='#000'
                /> */}
                <TextInput
                  style={styles.inputs}
                  secureTextEntry={false}
                  value={this.state.name}
                  onChangeText={name => this.setState({ name })}
                  autoCapitalize='words'
                  placeholder={(this.state.onFocusName) ? '' : 'Full Name'}
                  onFocus={() => this.setState({onFocusName: true})}
                  onBlur={() => this.setState({onFocusName: false})}
                />
            {/* </View> */}
                
              </View>

              <View style={(this.state.onFocusEmail) ? styles.inputContainerOnFocus : styles.inputContainer}>
                {/* <Icon
                  style={{ marginLeft: 15, marginTop: 3 }}
                  name='email'
                  size={30}
                  color='#000'
                /> */}
                {
              (this.state.onFocusEmail) ?
                <Text style={(this.state.onFocusEmail !== true) ? { marginLeft: 5, backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 32 } : { marginLeft: 5, backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 32 }}>
                  Email
            </Text> :
                null
            }
                <TextInput
                  style={styles.inputs}
                  secureTextEntry={false}
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
                  autoCapitalize='none'
                  placeholder={(this.state.onFocusEmail) ? '' : 'Email'}
                  onFocus={() => this.setState({onFocusEmail: true})}
                  onBlur={() => this.setState({onFocusEmail: false})}
                />
              </View>

              <View style={(this.state.onFocusPassword) ? styles.inputContainerOnFocus : styles.inputContainer}>
                {/* <Icon
                  style={{ marginLeft: 15, marginTop: 3 }}
                  name='lock'
                  size={30}
                  color='#000'
                /> */}
                {
              (this.state.onFocusPassword) ?
                <Text style={(this.state.onFocusPassword !== true) ? { marginLeft: 5, backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 55 } : { marginLeft: 5, backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 55 }}>
                  Password
            </Text> :
                null
            }
                <TextInput
                  style={styles.inputs}
                  secureTextEntry={this.state.passHide}
                  value={this.state.password}
                  onChangeText={password => this.setState({ password })}
                  autoCapitalize='none'
                  autoCorrect={false}
                  placeholder={(this.state.onFocusPassword) ? '' : 'Password'}
                  onFocus={() => this.setState({onFocusPassword: true})}
                  onBlur={() => this.setState({onFocusPassword: false})}
                />
                <TouchableOpacity onPress={() => this.setState({ passHide: !this.state.passHide })}
                  style={(this.state.onFocusPassword !== true) ? { position: 'absolute', right: 8 } : { position: 'absolute', right: 8, top: 2.5 }}>
                  <Icon
                    name='eye'
                    size={30}
                    color='#000'
                  />
                </TouchableOpacity>
              </View>

              <View style={(this.state.onFocusContact) ? styles.inputContainerOnFocus : styles.inputContainer}>
                {/* <Icon
                  style={{ marginLeft: 15, marginTop: 3 }}
                  name='phone'
                  size={30}
                  color='#000'
                /> */}
                {
              (this.state.onFocusContact) ?
                <Text style={(this.state.onFocusContact !== true) ? { marginLeft: 5, backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 68 } : { marginLeft: 5, backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 68 }}>
                  Contact No.
            </Text> :
                null
            }
                <TextInput
                  style={styles.inputs}
                  secureTextEntry={false}
                  value={this.state.contact}
                  onChangeText={contact => this.setState({ contact })}
                  autoCapitalize='none'
                  placeholder={(this.state.onFocusContact) ? '' : 'Contact No.'}
                  keyboardType='numeric'
                  onFocus={() => this.setState({onFocusContact: true})}
                  onBlur={() => this.setState({onFocusContact: false})}
                />
              </View>

              <View style={styles.inputContainer}>
                {/* <FontAwesomeIcon
                  style={{ marginLeft: 15, marginTop: 3 }}
                  name='transgender'
                  size={30}
                  color='#000'
                /> */}                            
                <View style={{ marginLeft: 15, marginTop: 2 }}>
                  <RNPickerSelect
                    onValueChange={(value) => this.setState({ gender: value })}
                    items={this.state.rdbGender}
                    placeholder={{ label: 'Select Gender', value: null }}
                    placeholderTextColor='grey'                    
                  />
                </View>

              </View>

              <View style={styles.container}>
                <DatePicker
                  style={{ width: '75%', marginBottom: 20, marginLeft: '-6%' }}
                  date={this.state.dob}
                  mode="date"
                  format="YYYY-MM-DD"
                  minDate="1947-01-01"
                  maxDate="2020-02-01"
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
                  onDateChange={(dob) => { this.setState({ dob: dob }) }}
                >
                  {/* <Text>Select Date of Birth</Text> */}
                </DatePicker>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  onPress={() => this.showCategories()}
                >Register</Button>
              </View>

              <TouchableOpacity style={styles.textButtonContainer} onPress={() => this.onClickListener()}>
                <Text>Already have an account?</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <Modal isVisible={this.state.isModalVisible}
          style={styles.modalStyle}
          scrollHorizontal
          propagateSwipe
          swipeDirection={["down"]}
          onSwipeComplete={() => this.setState({isModalVisible: false})}
        >
          <View style={{ flexDirection: 'column', height: '100%', }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ marginTop: 30, fontSize: 20, fontWeight: 'bold', marginLeft: 25 }}>You want to work as?</Text>              
            </View>
            <View style={{ flexDirection: 'column', marginTop: 30 }}>   
              {this.renderHandyman()}
            </View>
            <View style={{ flexDirection: 'row', marginLeft: Dimensions.get('window').width * .60, marginTop: 15 }}>
            <TouchableOpacity style={styles.doneButton} onPress={() => this.onButtonPress()}>
                <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold' }}>Done</Text>
              </TouchableOpacity>          
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: '10%',
    width: '100%',
    height: "100%",
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
    width: '80%',
    borderRadius: 30,
  },
  modalStyle: {
    borderRadius: 10,
    marginTop: Dimensions.get('screen').height * .20,
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
    borderRadius: 7,
    marginLeft: 10,
  }
});

export default RegisterScreen;