import React, { Component } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  Platform,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import { Input, Button } from '../common';

class EditProfile extends Component {

  state = {
    profileImage: null,    
    dob: new Date(),        
    onFocusName: false,
    onFocusPassword: false,
    onFocusContact: false,
    userData: [],
    contact: '',
    name: ''
  };
  static navigationOptions = ({ navigation }) => ({
    title: 'Edit Profile',
    headerLeft: (<IoniconsIcon
      style={{ marginLeft: 10 }}
      name='ios-menu'
      size={30}
      color='#000'
      onPress={() => navigation.toggleDrawer()}
    />),
  });

  selectImage = async () => {
    const permissions = Permissions.CAMERA_ROLL;
    const { status } = await Permissions.askAsync(permissions);

    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1
      });
      console.log(result);

      if (!result.cancelled) {
        this.setState({ profileImage: result.base64 });
      }
    }
  };  

  onButtonPress() {
    let data = []
    let url = 'http://' + global.ip + '/HandymanAPI/api/editCustomerProfile'
    data = {
        image: this.state.profileImage,
        id: this.state.userData.id,
        name: this.state.name,
        contact: this.state.contact,        
        dob: this.state.dob.split('T')[0],        
      }
    console.warn(data)

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
      }))
      .catch((error) => {
        alert(error)
      });
  }

  async componentDidMount(){
    let value = await AsyncStorage.getItem('userData') 
    let data = JSON.parse(value)     
      if (data !== null) {        
        this.setState({
          userData: data
        })        
      }
    this.setState({
      name: this.state.userData.name,
      contact: this.state.userData.contact,
      dob: this.state.userData.dob,
      profileImage: this.state.userData.image
    })
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={{ width: '100%', height: '100%' }}>
        
          <ScrollView >
            <View style={styles.container}>
              <View style={{ width: '90%', flex: 1, alignSelf: 'center' }}>
                {
                  (this.state.profileImage !== null) ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', height: 180, marginBottom: 10 }}>
                      {this.state.profileImage &&
                        <TouchableOpacity onPress={this.selectImage}>
                          <Image source={{ uri: `data:image/png;base64,${this.state.profileImage}` }} style={{ width: 190, height: 190 }} />
                        </TouchableOpacity>}
                    </View> :
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', height: 180, marginBottom: 10 }}>
                      <TouchableOpacity onPress={this.selectImage}>
                        <Image source={require('../assets/user.jpg')} style={{ width: 190, height: 190 }} />
                      </TouchableOpacity>
                    </View>
                }
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
                    <Text style={(this.state.onFocusName !== true) ? { marginLeft: 5, backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 60 } : { marginLeft: 5, backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -6, width: 60 }}>
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
                  onFocus={() => this.setState({ onFocusName: true })}
                  onBlur={() => this.setState({ onFocusName: false })}
                />
                {/* </View> */}

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
                    <Text style={(this.state.onFocusContact !== true) ? { marginLeft: 5, backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 68 } : { marginLeft: 5, backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -6, width: 68 }}>
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
                  onFocus={() => this.setState({ onFocusContact: true })}
                  onBlur={() => this.setState({ onFocusContact: false })}
                />
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
                  onPress={this.onButtonPress.bind(this)}
                >Update</Button>
              </View>
            </View>
          </ScrollView>
        
      </KeyboardAvoidingView>
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
    paddingTop: 20
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
});


export default EditProfile;