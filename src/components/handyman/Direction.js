import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Container, Content, ListItem, CheckBox, Body } from 'native-base';
import  MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Octicons';
import Modal from 'react-native-modal';
import { Rating } from 'react-native-elements';
import MapViewDirections  from 'react-native-maps-directions';

import RenderBill from './RenderBill';
import Services from './Services';

class Direction extends Component {
    static navigationOptions = {
        title: 'Directions',
        headerLeft: null
      };

    state = { services: [], providedServices: [], isModalVisible1: false, isModalVisible2: false, google_api_key: 'AIzaSyDNA9nURgVDmwVFFOatLwYS-mGtOsGelqY', latitude: null, longitude: null, error: null, coords: {latitude:33.5856, longitude:73.0675}, origin: null}

    onWorkDone = () => {
      this.setState({
        isModalVisible1: true
      })
    }

    onSubmitClick = () => {
      this.setState({ isModalVisible2: false })
      this.props.navigation.navigate('Home', {available: true})
    }

    onDoneClick = () => {
      this.setState({ isModalVisible1: false })
      this.timeoutHandle = setTimeout(()=>{
        this.setState({ isModalVisible2: true })
      }, 500);      
    }

    componentDidMount() {
      const lat = this.props.navigation.getParam('lat','')
      const lng = this.props.navigation.getParam('lng','')
      this.setState({        
        origin: {
         latitude:lat,
         longitude: lng,
         latitudeDelta: 0.005,
         longitudeDelta: 0.005,
        }
      });

      this.setState({
        providedServices: [{"name":"TV Repair", "price": 500},
        {"name":"AC Installment", "price": 1500},
        {"name":"Breaker Installment", "price": 200}],
        services: [{"name":"TV Repair","checked":false},
        {"name":"AC Installment","checked":false},
         {"name":"Breaker Installment","checked":false},
          {"name":"Switch Repair","checked":false}]
      })
     }


    renderBill (){
      return this.state.providedServices.map(service =>
        <RenderBill key={service.name} service={service} />)
    }

    renderService (){
      return this.state.services.map(service =>
        <ListItem key={service.name} onPress={() => {this.setState({checked: !checked})}}>            
            <CheckBox checked={service.checked} color="green" />
            <Body>
              <Text>{'   '+service.name}</Text>
            </Body>            
          </ListItem>
      )
    }

    render(){
        return (          
            <View style = {{width:'100%', height:'100%'}}>
            <MapView 
              style={styles.mapStyle}              
              region={this.state.origin}             
            >            
            <Marker
                coordinate={this.state.origin}
                title="Ubaid"
                description="4.5 ★"
              />    
              </MapView>
              <TouchableOpacity style={styles.bottomButton} onPress={this.onWorkDone.bind()}>
                <Text style={{color:'white', fontSize:30, fontWeight: 'bold'}}>Work Done</Text>
              </TouchableOpacity>
              <Modal isVisible={this.state.isModalVisible1} 
            style={{borderRadius:10,
              marginTop:'20%',
              marginBottom:'20%',
              width:'100%',
              marginLeft:0,
              backgroundColor:'white',
              height:'100%',}}                        
            scrollHorizontal
            propagateSwipe
            swipeDirection={["down"]}  
            onSwipeComplete={() => this.setState({isModalVisible1:false})}      
            >
            <View style={{ height:350, flexDirection: 'column'}}>   
              <View style={{ height:'15%', flexDirection: 'row'}}>
              <Text style={{fontSize:20, fontWeight:'bold',marginLeft:25}}>Select Provided Services</Text>              
              </View>  
              <View style = {{ height: '121%', marginTop: '5%' }}>
              <ScrollView>
                {this.renderService()}
              </ScrollView>
            <TouchableOpacity style={{position: 'absolute',
      bottom:0,
      left:0,
      right: 0,
      backgroundColor: 'black',    
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      borderRadius: 10,   }} onPress={() => this.onDoneClick()}>
                <Text style={{color:'white', fontSize:30, fontWeight: 'bold'}}>Done</Text>
            </TouchableOpacity>    
              </View>
              </View>               
            </Modal> 
              <Modal isVisible={this.state.isModalVisible2} 
            style={styles.modalStyle}                        
            scrollHorizontal
            propagateSwipe
            swipeDirection={["down"]}  
            onSwipeComplete={() => this.setState({isModalVisible2:false})}      
            >
            <View style={{ height:350, flexDirection: 'column', marginTop:180}}>   
              <View style={{ height:'15%', flexDirection: 'row'}}>
              <Text style={{marginTop:18, fontSize:20, fontWeight:'bold',marginLeft:25}}>Bill & Feedback</Text>
              <TouchableOpacity style={{marginTop:18, marginLeft:'40%', backgroundColor:'grey', height:30, width:30, borderRadius:60, alignItems:'center', justifyContent:'center'}} onPress={() => this.setState({isModalVisible2:false})}>
              <Icon                   
                name='x' 
                size={30} 
                color='white'                 
                />
                </TouchableOpacity>
              </View>  
              <View style = {{ height: '90%', marginTop: '5%' }}>
                {this.renderBill()}
                <View style={{flexDirection: 'row',
                  justifyContent:'space-between',    
                  width: '95%',
                  paddingLeft: 20,
                  paddingTop: 15}}>
                  <Text style={{ fontSize: 15}}>Total</Text>                            
                  <Text style={{ fontSize: 15}}>2200</Text>                            
                </View>
                <Rating
            type='star'                        
            ratingCount={5}            
            onFinishRating={this.ratingCompleted}            
            />
            <TouchableOpacity style={styles.bottomButton} onPress={() => this.onSubmitClick()}>
                <Text style={{color:'white', fontSize:30, fontWeight: 'bold'}}>Submit</Text>
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
    flex: 1,
    width:'100%',
    height: 30
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
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
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
  

export default Direction;