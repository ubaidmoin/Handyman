import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, Text, FlatList, Dimensions, Image, TouchableHighlight, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

import { Input, Button, Header, Card, CardSection } from '../common';

class SubServices extends Component {

  state = { 
    services: [], 
    isModalVisible: false, 
    onFocusServiceName: false, 
    onFocusServicePrice: false, 
    id: this.props.navigation.getParam('id', 0), 
    serviceName: '',
    servicePrice: '',
    editServiceName: '',
    editServicePrice: ''
  }  

  componentDidMount() {
    this.getSubServices()
  }

  addNewSubService(){
    this.setState({
      isModalVisible: true
    })
  }

  getSubServices(){
    fetch('http://'+ global.ip +'/HandymanAPI/api/getSubServices?id='+this.state.id)
      .then(response => response.json().then(data => {
        // console.warn(data)
        this.setState({
          services: data.sort((a, b) => a.sub_service > b.sub_service)
        })
        var data = [...this.state.services]
        data.forEach(element =>
          element.edit = false 
          )
        this.setState({services: data})
      }))
      .catch((error) => {
        console.warn(error);
      });
  }

  onDoneClick(){
    let data = []
    let url = 'http://'+ global.ip +'/HandymanAPI/api/addNewSubService'
    data = {
      cid: this.state.id,
      sub_service: this.state.serviceName,
      price: this.state.servicePrice,
      status: true
    }
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json().then(data => {
        this.getSubServices()
      }))
      .catch((error) => {
        alert(error)
      });
  }

  changeSubServiceStatus(id, name){    
    let url = 'http://'+ global.ip +'/HandymanAPI/api/changeSubServiceStatus/'+id+'/'+name
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json().then(data => {
        this.getSubServices()
      }))
      .catch((error) => {
        alert(error)
      });
  }

  onEditClick(index){
    let data = [...this.state.services]
    let item = data[index]
    item.edit = !item.edit
    data.forEach(element => {
      if (element.id !== item.id){
        item.edit = false
      }
    })
    this.setState({services: data})
  }

  onDoneClick(index){
    let data = [...this.state.services]
    let item = data[index]
    item.edit = !item.edit
    data.forEach(element => {
      if (element.id !== item.id){
        item.edit = false
      }
    })
    this.setState({services: data})

    let obj = []
    obj = {
      cid: this.state.id,
      sub_service: item.sub_service,
      price: item.price,
      status: item.status
    }
    fetch('http://'+ global.ip +'/HandymanAPI/api/editSubService', {
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

  onNameChangeText(value, index){
    let data= [...this.state.services]
    let item = data[index]
    item.sub_service = value
    this.setState({services: data})
  }

  onPriceChangeText(value, index){
    let data= [...this.state.services]
    let item = data[index]
    item.price = value
    this.setState({services: data})
  }

  renderSubServices() {
    return (<FlatList
      data={this.state.services}
      keyExtractor={item => item.sub_service}
      renderItem={({ item, index }) => (
        <View key={item.cid} style={{ flexDirection: 'row', height: 80, alignItems: 'center', marginHorizontal: 15, marginVertical: 3, backgroundColor: 'white', borderRadius: 8 }}>          
        
          { (item.edit === false) ?
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
            { (item.edit === false) ?              
            (<View style={{ flexDirection: 'row', marginLeft: 10, justifyContent:'space-between', width: '75%' }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.sub_service}</Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Rs. {item.price}</Text>
            </View>
            ) :               
            (<View style={{ flexDirection: 'row', marginLeft: 10, justifyContent:'space-between', width: '75%' }}>            
            <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 16 }}>{item.sub_service}</Text>
            <View style={styles.flatListInputContainer}>              
            <TextInput
              style={styles.inputs}
              secureTextEntry={false}
              value={item.price+''}
              onChangeText={value => this.onPriceChangeText(value, index)}              
              keyboardType="number-pad"
              placeholder='Price'
            />                                    
        </View>
        </View>)        
            }          
          <View style={{ position: 'absolute', right: 25, top: 15, flexDirection: 'row' }}>
            <TouchableOpacity 
            style={{justifyContent:'center', alignItems:'center'}}
            onPress={() => this.changeSubServiceStatus(item.cid, item.sub_service)}
            >
              <EntypoIcon
                name={(item.status !== true) ? "check" : "cross"}
                size={30}
                color={(item.status !== true) ? "green" : "red"}
              />
              <Text style={{fontSize: 10, color: (item.status !== true) ? "green" : "red"}}>
                {
                  (item.status !== true) ? 'Enable' : 'Disable'
                }
              </Text>
            </TouchableOpacity>            
          </View>
        </View>
      )}
    />)
  }

  render() {
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: '#EBEFF3'  }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15, flexDirection: 'row' }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', backgroundColor: 'white', paddingHorizontal: 5 }}>
            Sub Services
          </Text>          
        </View>
        <View style={{right: 5, position: 'absolute', top: 15}}>
        <TouchableOpacity 
          style={{flexDirection:'column', justifyContent:'center', alignItems:'center'}}
          onPress={() => this.addNewSubService()}
          >
          <EntypoIcon
                name="plus"
                size={20}
                color="blue"
              />
              <Text style={{fontSize: 10, color:'blue'}}>
                Add Subservice
              </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{marginTop:5}}>
          {this.renderSubServices()}
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
              Add Sub Service
            </Text>                                 
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
            <View style={(this.state.onFocusServicePrice) ? styles.inputContainerOnFocus : styles.inputContainer}>
                {/* <MaterialIcon
                  style={{ marginLeft: 15, marginTop: 3 }}
                  name='person'
                  size={30}
                  color='#000'
                /> */}
                {
              (this.state.onFocusServicePrice) ?
                <Text style={(this.state.onFocusServicePrice !== true) ? { marginLeft: 5, backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 32 } : { marginLeft: 5, backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -6, width: 32 }}>
                  Price
            </Text> :
                null
            }           
                <TextInput
                  style={styles.inputs}
                  secureTextEntry={false}
                  value={this.state.servicePrice}
                  onChangeText={servicePrice => this.setState({ servicePrice })}
                  autoCapitalize='words'
                  placeholder={(this.state.onFocusServicePrice) ? '' : 'Price'}
                  onFocus={() => this.setState({onFocusServicePrice: true})}
                  onBlur={() => this.setState({onFocusServicePrice: false})}
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
  },
  inputs: {
    height: 45,
    marginLeft: 15,
    flex: 1,    
  },
  modalStyle: {
    borderRadius: 10,
    marginVertical: Dimensions.get('screen').height * .30,
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


export default SubServices;