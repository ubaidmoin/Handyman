import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import { DrawerNavigatorItems } from 'react-navigation-drawer';

import { Input, Button, Header, Card, Collection } from '../common';
import CollectionView from './CollectionView';


class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Home',
    headerLeft: (<Icon 
      style= {{marginLeft:10}}
      name='three-bars' 
      size={30} 
      color='#000' 
      onPress={() => navigation.toggleDrawer()}
  />)
  });

  state = { services: []}

  componentDidMount(){
    this.setState({
      services: [{"name": "Electrician", "logo": "../assets/electricianLogo.jpg"},{"name": "Plumber", "logo": "../assets/electricianLogo.jpg"},{"name": "Carpenter", "logo": "../assets/beauticianLogo.png"},{"name": "Mechanic", "logo": "../assets/beauticianLogo.png"},{"name": "Painter", "logo": "../assets/painter.png"},]
    })
  }

  renderCollectionView(){
    return this.state.services.sort((a,b)=>a.name > b.name).map(service =>       
        <CollectionView key={service.name} service={service}/>      
      );
  }
  
    render(){
        return (          
          <View style={{width:'100%', height:'100%'}}>
          <Text style={{marginTop:30, marginLeft:15, fontWeight:'bold', fontSize:30}}>Provided Services</Text>
          <ScrollView>
            <View style={styles.collectionStyle}>
            {this.renderCollectionView()}
            </View>
          </ScrollView>
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
    width:'100%',
    height:"100%",
    paddingTop: 250    
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
   } 
  });
  

export default HomeScreen;