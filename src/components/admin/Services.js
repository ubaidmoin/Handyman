import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, Text, FlatList, SafeAreaView, Image, TouchableHighlight, TextInput, TouchableOpacity } from 'react-native';

import { Input, Button, Header, Card, CardSection } from '../common';

class Services extends Component {

  state = {dataArray: [], addItem: ''}

  getListViewItem = (item) => {  
    alert(item.key);  
  }  

  componentDidMount(){
    this.setState({
      dataArray: [
        {'title': 'Electrician', 'thumbnail': './assets/forwardIcon.png'},{'title': 'A/C Technician', 'thumbnail': './assets/forwardIcon.png'},
        {'title': 'Plumber', 'thumbnail': './assets/forwardIcon.png'},{'title': 'Mechanic', 'thumbnail': './assets/forwardIcon.png'},  
        {'title': 'Painter', 'thumbnail': './assets/forwardIcon.png'},{'title': 'Refregrator Mechanic', 'thumbnail': './assets/forwardIcon.png'}
      ]
    })
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 2,
          width: "95%",
          backgroundColor: "#CED0CE",
          marginLeft: 10,          
        }}
      />
    );
  };

  actionOnRow(item) {
    alert(item.title)
 }

 onAddPress(){
   
 }

  render(){
    return(
      <ImageBackground source={require("../assets/login.jpg")} style = {{width:'100%', height:'100%'}}>
        <Header headerText="Services Panel" />
        <View style={{justifyContent:'center', alignItems:'center'}}>
        <Text style={{marginTop:20, fontWeight:'bold', fontSize:30, marginBottom:10}}>All Services</Text>
        </View>
        <SafeAreaView style={styles.container}>
        <View style={{justifyContent:'center', alignItems:'center', flexDirection: 'column'}}>
        <TextInput value={this.state.addItem} style={{width:'80%'}} placeholder="Enter value to add" onChangeText={(value) => this.setState({addItem: value})}/>
        <View style = {styles.buttonContainer}>
          <Button onPress={this.onAddPress.bind()}>Add to List</Button>
        </View>
        </View>
        <FlatList
          data={this.state.dataArray}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) =>                  
            <TouchableHighlight onPress={ () => this.actionOnRow(item)}>
              <View style={styles.flatview}>
              <Text style={styles.name}>{item.title}</Text>                        
              <Image source={require('../assets/forwardIcon.png')} style={{width:15, height:15}}/>
              </View>
            </TouchableHighlight>
          
          }
          keyExtractor={item => item.title}
          ItemSeparatorComponent={this.renderSeparator}
        />
        </SafeAreaView>
      </ImageBackground>                       
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,   
    justifyContent: 'center',
    alignItems:'center' 
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
    width:'90%'
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
  buttonContainer: {
    marginTop: 10,
    height: 30,
    alignSelf: 'stretch',    
  }
  });
  

export default Services;