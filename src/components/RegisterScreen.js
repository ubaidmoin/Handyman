import React, { Component } from 'react';
import { Text, ScrollView, View, StyleSheet, DatePickerIOS, KeyboardAvoidingView, ImageBackground, TouchableOpacity, DatePickerAndroid, Platform } from 'react-native';

import { Input, Button } from './common';

class RegisterScreen extends Component {

  state = { userName: '', name: '', email: '', password: '', dob: new Date(), pNumber: '' };

  onButtonPress() {

  }

  onClickListener() {
    this.props.navigation.navigate('Login');
  }

    render(){
        return (
          <KeyboardAvoidingView behavior="padding" style={{width:'100%', height:'100%'}}>
          <ImageBackground source={require("../assets/login.jpg")} style={{width:'100%', height:'100%', paddingTop:100}}>
          <ScrollView >
            <View style={styles.container}>
          <View style = {styles.inputContainer}>
              <Input 
                style = {styles.inputs}
                label = 'Full Name'
                secureTextEntry = {false}                
                value = {this.state.name}
                onChangeText = {name => this.setState({name})}
                autoCapitalize='words'
              />
              </View>

              <View style = {styles.inputContainer}>
              <Input 
                style = {styles.inputs}
                label = 'User Name'               
                secureTextEntry = {false}                                        
                value = {this.state.userName}
                onChangeText = {userName => this.setState({userName})}
                autoCapitalize = 'none'                  
              />
              </View>

              <View style = {styles.inputContainer}>
              <Input 
                style = {styles.inputs}
                label = 'Password'               
                secureTextEntry
                value = {this.state.password}
                onChangeText = {password => this.setState({password})}
                autoCapitalize = 'none'                  
              />
              </View>

              <View style = {styles.inputContainer}>
              <Input 
                style = {styles.inputs}
                label = 'Mobile No.'               
                secureTextEntry = {false}                                        
                value = {this.state.pNumber}
                onChangeText = {pNumber => this.setState({pNumber})}
                autoCapitalize = 'none'                  
              />
              </View>

              <View style = {styles.inputContainer}>
              <Input 
                style = {styles.inputs}
                label = 'Email'               
                secureTextEntry = {false}                                        
                value = {this.state.email}
                onChangeText = {email => this.setState({email})}
                autoCapitalize = 'none'                  
              />
              </View>
              
            {
              ( Platform.OS === 'android' )
              ?
              ( <DatePickerAndroid 
                date = {this.state.dob}
                onDateChange = {dob => this.setState({dob})}
                mode='date'                
                /> )
              :
              ( <DatePickerIOS style={{width:'80%'}}
                date = {this.state.dob}
                onDateChange = {dob => this.setState({dob})}
                mode='date'                
                /> )
              }
              <View style = {styles.buttonContainer}>
              <Button                   
                onPress= {this.onButtonPress.bind(this)}
              >Register</Button>
              </View>
              
              <TouchableOpacity style={styles.textButtonContainer} onPress={() => this.onClickListener()}>
                  <Text>Already have an account?</Text>
              </TouchableOpacity>
              </View>
              </ScrollView>
              </ImageBackground>       
              </KeyboardAvoidingView>     
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: '10%',
    width:'100%',
    height:"100%",                     
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: 'lightgrey',
      borderRadius:30,
      borderBottomWidth: 1,
      width:'80%',
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center',      
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:'80%',
    borderRadius:30,
  },
  textButtonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:'80%',
    borderRadius:30,
  }
  });

export default RegisterScreen;