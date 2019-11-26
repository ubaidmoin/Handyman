import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground, SafeAreaView, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import { Dropdown } from 'react-native-material-dropdown';

import { Input, Button, Header, Card, Collection } from '../common';


class Settings extends Component {  

  static navigationOptions = ({ navigation }) => ({
    title: 'Settings',
    headerLeft: (<Icon 
      style= {{marginLeft:10}}
      name='three-bars' 
      size={30} 
      color='#000' 
      onPress={() => navigation.toggleDrawer()}
  />),  
  });

  state = { categories: [{value: 'Electrician'}, {value: 'Plumber'}, {value: 'Carpenter'}], data: [{title: 'Painter'}] }

   Item({ title }) {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  }

    render(){
        return (          
          <View style={{width:'100%', height:'100%'}}>
            <Header headerText="Settings"/>
            <View style={{width:'80%', marginLeft:'10%'}}>                
                <Dropdown data={this.state.categories.sort((a,b) => a.value > b.value)} label='Available Categories'/>
                <TouchableOpacity style={styles.buttonContainer}>
                <Button>
                    Request new Category
                </Button>
                </TouchableOpacity>
            </View>            
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
    marginLeft:'10%',
    width:'70%',
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
   item: {
     backgroundColor: '#f9c2ff',
     padding: 20,
     marginVertical: 8,
     marginHorizontal: 16,
   },
   title: {
     fontSize: 32,
   } 
  });
  

export default Settings;