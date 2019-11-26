import React, { Component } from 'react';
import { Button, Text, View, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Image, ScrollView, TextInput} from 'react-native';
import  MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/Octicons';
import Modal from 'react-native-modal';
import Dialog from 'react-native-dialog';

import HandymanRecords from './RenderHandymanRecords';
import { Input, Header, Card, CardSection } from '../common';

class SearchHandyman extends Component {
    static navigationOptions = {
        title: 'Search Handyman',
      };

      constructor(props){
        super(props)
      }

    state = { dialogVisible:false, availableHandyman:[], isModalVisible: false, category: this.props.navigation.getParam('category', ''), latitude: null, longitude: null, error: null, origin: null, address: null,}    

    onSearchClick = () => {
      let url = 'http://192.168.1.115/HandymanAPI/api/getAvailableHandyman?category='+this.state.category
      fetch(url, {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      })
      .then(response => response.json().then(data => { 
        this.setState({
          availableHandyman: data
        })
        this.setState({ isModalVisible: true });
      }))           
      .catch((error) =>{
        alert('No handyman available.')
      });           
    }

    getLocation(){
      let myApiKey = 'AIzaSyDNA9nURgVDmwVFFOatLwYS-mGtOsGelqY'
      fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.latitude + ',' + this.state.longitude + '&key=' + myApiKey)
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
              address: responseJson.results[0].formatted_address
            })
      })      
    }

    showDialog = () => {
      this.setState({ dialogVisible: true });
    };
   
    handleCancel = () => {
      this.setState({ dialogVisible: false });
    };
   
    handleConfirm = () => {  
                      
    };


    selectLocation(){
      this.props.navigation.navigate('PickLocation', {
        address: this.state.address
      })
    }

    componentDidMount() {       
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,             
            error: null,            
            origin: {
             latitude:position.coords.latitude,
             longitude: position.coords.longitude,
             latitudeDelta: 0.005,
             longitudeDelta: 0.005,
            }
          })
        },
        (error) => this.setState({ error: error.message }),        
      );      

      this.setState({
        availableHandyman: [{"name":"Imran", "mobileno":"03325426789", "rating":"4.5", "category":"Electrician", "coords": {"latitude":33.5856,"longitude":73.0675}},
        {"name":"Raheel", "mobileno":"03325426789", "rating":"4.5", "category":"Electrician", "coords": {"latitude":33.6298,"longitude":73.0420}},
        {"name":"Anees", "mobileno":"03325426789", "rating":"5", "category":"Electrician", "coords": {"latitude":33.6600,"longitude":73.0833}},
        {"name":"Basit", "mobileno":"03325426789", "rating":"5", "category":"Plumber", "coords": {"latitude":33.6298,"longitude":73.0420}},
        {"name":"Asad", "mobileno":"03325426789", "rating":"4", "category":"Plumber", "coords": {"latitude":33.5856,"longitude":73.0675}},
        {"name":"Aseef", "mobileno":"03325426789", "rating":"4.5", "category":"Carpanter", "coords": {"latitude":33.6600,"longitude":73.0833}},
        {"name":"Irfan", "mobileno":"03325426789", "rating":"4.5", "category":"Carpanter", "coords": {"latitude":33.5856,"longitude":73.0675}},
        {"name":"Zain", "mobileno":"03325426789", "rating":"4.5", "category":"Carpanter", "coords": {"latitude":33.6298,"longitude":73.0420}},
        {"name":"Nadeem", "mobileno":"03325426789", "rating":"4.5", "category":"Mechanic", "coords": {"latitude":33.5856,"longitude":73.0675}},
        {"name":"Jamal", "mobileno":"03325426789", "rating":"4.5", "category":"Mechanic", "coords": {"latitude":33.6600,"longitude":73.0833}}]
    })
  }

     renderElements(){       
      return this.state.availableHandyman.sort((a,b)=>a.rating < b.rating).map(available => 
        available.category === this.state.category ?
        <TouchableOpacity key={available.name} onPress={() => this.showDialog()}>
        <HandymanRecords key={available.name} 
        handyman={available}
        clientLat={this.state.latitude}
        clientLong={this.state.longitude}
        />
        </TouchableOpacity>
        : null
        );
    }

    render(){
        return (          
            <View style={styles.container}>
            <MapView.Animated 
              style={styles.mapStyle}
              showsUserLocation={true}
              region = {this.state.origin}
            >
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>              
            <TouchableOpacity style={styles.input} onPress={() => this.selectLocation()}>
            <TextInput pointerEvents="none"  value={this.state.address} />
            </TouchableOpacity>            
            <Icon   
                style={{marginTop:18}}              
                name='location' 
                size={30} 
                color='#000' 
                onPress={() => this.getLocation()}
            />
            </View>
              </MapView.Animated>
              
            <TouchableOpacity style={styles.bottomButton} onPress={() => this.onSearchClick()}>
                <Text style={{color:'white', fontSize:30, fontWeight: 'bold'}}>Search Handyman</Text>
            </TouchableOpacity>
            <Modal isVisible={this.state.isModalVisible} 
            style={styles.modalStyle}                        
            scrollHorizontal
            propagateSwipe
            swipeDirection={["down"]}  
            onSwipeComplete={()=>this.onSearchClick()}      
            >
            <View style={{ height:350, flexDirection: 'column', marginTop:180}}>   
              <View style={{ height:'15%', flexDirection: 'row'}}>
              <Text style={{marginTop:18, fontSize:20, fontWeight:'bold',marginLeft:25}}>Available Handyman</Text>
              <TouchableOpacity style={{marginTop:18, marginLeft:'27%', backgroundColor:'grey', height:30, width:30, borderRadius:60, alignItems:'center', justifyContent:'center'}} onPress={() => this.onSearchClick()}>
              <Icon                   
                name='x' 
                size={30} 
                color='white'                 
                />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ height:'85%'}}>                
                {this.renderElements()}                
              </ScrollView>              
              </View>
              <Dialog.Container visible={this.state.dialogVisible}>
                <Dialog.Title>Confirm Booking</Dialog.Title>
                <Dialog.Description>
                Do you want to book him?
                </Dialog.Description>
                <Dialog.Button label="Cancel" onPress={() => this.handleCancel()} />
                <Dialog.Button label="Confirm" onPress={() => {
                  this.setState({ dialogVisible: false, isModalVisible:false })  
                  this.timeoutHandle = setTimeout(()=>{
                    this.props.navigation.navigate('ConfirmationView')
                  }, 1000);                  
                }} />
            </Dialog.Container>         
            </Modal>            
            </View>                     
             
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    height: '100%'
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
    buttonContainer: {
      marginTop: 30,
      marginBottom: 5,
      marginLeft: 15,
      height:25,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width:'60%',
      borderRadius:30,
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
      bottom:0,
      left:0,
      right: 0,
      backgroundColor: 'black',    
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,    
    },
    mapStyle: {
      flex: 1
    },
    input: {
      height: 36,
      paddingLeft: 5,
      marginLeft: 15,
      marginTop: 15,
      marginRight: 10,
      fontSize: 18,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: '#000',
      backgroundColor: 'rgba(0,0,0,0)',
      width: '85%',
      justifyContent:'center',
      alignItems:'center'
  },
  modalStyle:{
    borderRadius:10,
    marginTop:'70%',
    width:'100%',
    marginLeft:0,
    backgroundColor:'white',
    height:'100%',
  }
  });
  

export default SearchHandyman;