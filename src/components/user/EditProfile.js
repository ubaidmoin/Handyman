import React, { Component } from 'react';
import { DatePickerAndroid, DatePickerIOS, View, StyleSheet, ImageBackground, Platform, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

import { Input, Button } from '../common';

class EditProfile extends Component {  

  state = { name: '', email: '', dob: new Date(), pNumber: '', image: null };
    static navigationOptions = ({ navigation }) => ({
        title: 'Edit Profile',
        headerLeft: (<Icon 
          style= {{marginLeft:10}}
          name='three-bars' 
          size={30} 
          color='#000' 
          onPress={() => navigation.toggleDrawer()}
      />),  
      });

      onButtonPress(){
    
      }
  
    render(){
        return (          
          <KeyboardAvoidingView behavior="padding" style={{width:'100%', height:'100%'}}>
          <ImageBackground source={require("../assets/login.jpg")} style={{width:'100%', height:'100%'}}>
          <ScrollView >
            <View style={styles.container}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom:20 }}>
              <Image source={require('../assets/user.jpg')} style={{width:100, height:100}} />
            </View>
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
              >Update</Button>
              </View>                          
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
    flexDirection: 'column',
    alignItems: 'center',
    width:'100%',
    height:"100%",
    paddingTop: 20    
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
    width:'60%',
    borderRadius:30,
  },
  detailContainer: {
      flexDirection: 'column',
      justifyContent:'space-around',     
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