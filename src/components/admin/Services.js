import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, Text, FlatList, Dimensions, Image, TouchableHighlight, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Swipeout from 'react-native-swipeout';

import { Input, Button, Header, Card, CardSection } from '../common';

class Services extends Component {

  state = { activeRow: null, services: [], addItem: '', isModalVisible: false, onFocusServiceName: false, serviceImage: null, serviceName: '' }

  componentDidMount() {
    this.getCategories()
  }

  getCategories(){
    fetch('http://'+ global.ip +'/HandymanAPI/api/getCategories')
      .then(response => response.json().then(data => {
        // console.warn(data)
        this.setState({
          services: data.sort((a, b) => a.name > b.name)
        })
      }))
      .catch((error) => {
        console.warn(error);
      });
  }

  removeCategory(id) {
    fetch('http://'+ global.ip +'/HandymanAPI/api/deleteCategory/' + id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json().then(data => {
        // console.warn(data)
        this.getCategories()
      }))
      .catch((error) => {
        console.warn(error);
      });
  }

  addNewService() {
    this.setState({
      isModalVisible: true
    })
  }

  onDoneClick() {
    let url = 'http://'+ global.ip +'/HandymanAPI/api/addNewCategory'
    let data = JSON.stringify({      
      name: this.state.serviceName,
      image: this.state.serviceImage
    })
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
        this.getCategories()
      }))
      .catch((error) => {
        alert(error)
      });
  }

  subServices(id){
    this.props.navigation.navigate('SubServices', {id: id})
  }

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
      // console.log(result);

      if (!result.cancelled) {
        this.setState({ serviceImage: result.base64 });
      }
    }
  };

  

  renderServices() {
    let swipeBtns = [{
      text: 'Delete',
      backgroundColor: 'red',      
      onPress: () => { this.removeCategory(this.state.activeRow) }
    }];
    return (      
    <FlatList
      data={this.state.services}
      keyExtractor={item => item.name}
      renderItem={({ item }) => (
        <Swipeout right={swipeBtns}
        
        onOpen={() => this.setState({activeRow: item.cid})}
        backgroundColor= 'transparent'>
        <View key={item.cid} style={{ flexDirection: 'row', height: 80, alignItems: 'center',  marginVertical: 3, backgroundColor: 'white', borderRadius: 8 }}>
          {/* <TouchableOpacity 
          style={{ position: 'absolute', right: 5, top: 5 }}
          onPress={() => this.removeCategory(item.cid)}
          >            
            <EntypoIcon            
                name="cross"
                size={20}
                color="red"
              />              
          </TouchableOpacity> */}
          <Image source={{ uri: `data:image/png;base64,${item.image}` }}
              style={{ height: 70, width: 70, marginBottom: 5, marginTop: 5, marginLeft: 10, borderRadius: 10 }} />
          <View style={{ flexDirection: 'column', marginLeft: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
          </View>
          <View style={{ position: 'absolute', right: 28, top: 28, flexDirection: 'row' }}>
            <TouchableOpacity
              style={{ justifyContent: 'center', alignItems: 'center' }}
              onPress={() => this.subServices(item.cid)}
            >
              <AntDesignIcon
              name="rightcircle"
              size={25}
              color="black"
            />
              
            </TouchableOpacity>
          </View>
        </View>
        </Swipeout>
      )}
    />)
  }

  render() {
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: '#EBEFF3' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15, flexDirection: 'row' }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', backgroundColor: 'white', paddingHorizontal: 5 }}>
            Services
          </Text>
        </View>
        <View style={{ right: 5, position: 'absolute', top: 15 }}>
          <TouchableOpacity
            style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => this.addNewService()}
          >
            <EntypoIcon
              name="plus"
              size={20}
              color="blue"
            />
            <Text style={{ fontSize: 10, color: 'blue' }}>
              Add Service
              </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ marginTop: 15 }}>
          {this.renderServices()}
        </ScrollView>
        <Modal isVisible={this.state.isModalVisible}
          style={styles.modalStyle}
          scrollHorizontal
          propagateSwipe
          swipeDirection={["down"]}
          onSwipeComplete={() => this.setState({ isModalVisible: false })}
        >          
            <View style={{ flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent:'center' }}>   
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>
              Add Service
            </Text>                   
            <View style={{ marginTop: 15, alignSelf: 'center', height: '50%' }}>
                {
                  (this.state.serviceImage !== null) ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', height: 180, marginBottom: 10 }}>
                      {this.state.serviceImage &&
                        <TouchableOpacity onPress={this.selectImage}>
                          <Image source={{ uri: `data:image/png;base64,${this.state.serviceImage}` }} style={{ width: 190, height: 190 }} />
                        </TouchableOpacity>}
                    </View> :
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', height: 180, marginBottom: 10 }}>
                      <TouchableOpacity onPress={this.selectImage}>
                        <Image source={require('../../assets/selectImage.png')} style={{ width: 190, height: 190 }} />
                      </TouchableOpacity>
                    </View>
                }
              </View>                       
              <View style={(this.state.onFocusServiceName) ? styles.inputContainerOnFocus : styles.inputContainer}>
                {/* <MaterialIcon
                  style={{ marginLeft: 15, marginTop: 3 }}
                  name='person'
                  size={30}
                  color='#000'
                /> */}
                {
              (this.state.onFocusServiceName) ?
                <Text style={(this.state.onFocusServiceName !== true) ? { marginLeft: 5, backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 60 } : { marginLeft: 5, backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -6, width: 80 }}>
                  Service Name
            </Text> :
                null
            }           
                <TextInput
                  style={styles.inputs}
                  secureTextEntry={false}
                  value={this.state.serviceName}
                  onChangeText={serviceName => this.setState({ serviceName })}
                  autoCapitalize='words'
                  placeholder={(this.state.onFocusServiceName) ? '' : 'Service Name'}
                  onFocus={() => this.setState({onFocusServiceName: true})}
                  onBlur={() => this.setState({onFocusServiceName: false})}
                />                                    
            </View>
            <View style={styles.doneButton}>
            <TouchableOpacity onPress={() => this.onDoneClick()}>
                <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold' }}>Add</Text>
              </TouchableOpacity>
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
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  flatview: {
    paddingTop: 30,
    borderRadius: 2,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  name: {
    fontFamily: 'Verdana',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
    width: '90%'
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
  buttonContainer: {
    marginTop: 10,
    height: 30,
    alignSelf: 'stretch',
  },
  displayPicStyle: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: 'center'
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
  modalStyle: {
    borderRadius: 10,
    marginVertical: Dimensions.get('screen').height * .20,
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
    width: '80%',
    marginTop: 10
  }
});


export default Services;