import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Input, Button } from './common';

class LoginScreen extends Component {
  state = {
    email: '',
    password: '',
    passHide: true,
    onFocusEmail: true,
    onFocusPassword: true,
    showActivityIndicator: false
  };

  static navigationOptions = {
    headerLeft: null,
    gesturesEnabled: false,
  };

  constructor() {
    super()
    global.userData = []
    global.handymanData = []
    // global.ip = '192.168.1.107'
  }

  async componentDidMount(){
    await AsyncStorage.removeItem('userData')
    // let value = await AsyncStorage.getItem('userData') 
    // let data = JSON.parse(value)     
    //   if (data !== null) {        
    //     if (data.type == "Customer"){                   
    //       this.props.navigation.navigate('Customer')
    //     } else if (data.type == "Handyman"){
    //       this.props.navigation.navigate('Handyman')
    //     } else if (data.type == "Admin"){
    //       this.props.navigation.navigate('Admin')
    //     } 
    //   }
  }

  _storeData = async (value) => {
    try {
      await AsyncStorage.setItem('userData', value);
    } catch (error) {
      console.warn(error)
    }
  };

  onButtonPress() {
    this.setState({
      showActivityIndicator: true
    })
    let url = 'http://' + global.ip + '/HandymanAPI/api/login?email=' + this.state.email + '&password=' + this.state.password
    console.warn(url)
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
          showActivityIndicator: false
        })
        if (data.type == "Customer") {          
          this._storeData(JSON.stringify(data))
          this.props.navigation.navigate('Customer')
        }
        else if (data.type == "Handyman") {
          this._storeData(JSON.stringify(data))
          this.props.navigation.navigate('Handyman')
        } else if (data.type == "Admin") {
          this._storeData(JSON.stringify(data))
          this.props.navigation.navigate('Admin')
        }
        else {
          alert('Invalid email or password.')
        }
      }))
      .catch((error) => {
        alert(error)
      });

  }

  onClickListener() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={{ width: '100%', height: '100%' }}>
        <ImageBackground source={require("../assets/login.jpg")} style={styles.container}>        
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
              style={{ fontSize: 15, marginLeft: 15, flex:1 }}
              secureTextEntry={false}
              placeholder={(this.state.onFocusEmail) ? '' : 'Email'}
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
              autoCapitalize='none'
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
              style={{ fontSize: 15, marginLeft: 15, flex:1 }}
              placeholder={(this.state.onFocusPassword) ? '' : 'Password'}
              secureTextEntry={this.state.passHide}
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
              autoCapitalize='none'
              onFocus={() => this.setState({onFocusPassword: true})}
              onBlur={() => this.setState({onFocusPassword: false})}
            />
            <TouchableOpacity onPress={() => this.setState({ passHide: !this.state.passHide })}
              style={{ position: 'absolute', right: 8, top: 2.5}}>
              <Icon
                name='eye'
                size={30}
                color='#000'
              />
            </TouchableOpacity>
          </View>
          {(this.state.showActivityIndicator) ?
              <View style={{ padding: 10, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', position: 'absolute', left: Dimensions.get('window').width * .45, top: Dimensions.get('window').height * .50 }}>
                <ActivityIndicator
                  // style={{}} 
                  color="grey" size="large" />
              </View> : null}
          <View style={styles.buttonContainer}>
            <Button
              onPress={this.onButtonPress.bind(this)}
            >Log in</Button>
          </View>

          <TouchableOpacity style={styles.textButtonContainer} onPress={() => this.onClickListener()}>
            <Text>Don't have an account?</Text>
          </TouchableOpacity>
        </ImageBackground>
      </KeyboardAvoidingView>
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
    marginTop: 5,
    marginBottom: 5,
    borderColor: '#F4F6F8',
    borderWidth: 1,
    width: '80%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F4F6F8',
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
    flexDirection: 'column'
  },
  inputs: {
    height: 45,
    marginLeft: 16,        
    fontSize: 15,
    flex: 1,    
  },
  buttonContainer: {
    marginTop: 5,
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
  }
});


export default LoginScreen;