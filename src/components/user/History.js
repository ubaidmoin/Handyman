import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

import { Input, Button, Header, Card, Collection } from '../common';
import RenderHistory from './RenderHistory';

class History extends Component {

  state = { historyRecords: [] }

    static navigationOptions = ({ navigation }) => ({
        title: 'History',
        headerLeft: (<Icon 
          style= {{marginLeft:10}}
          name='three-bars' 
          size={30} 
          color='#000' 
          onPress={() => navigation.toggleDrawer()}
      />),  
      });


      renderHistory(){
        return this.state.historyRecords.map(history =>       
          <RenderHistory key={history.name} history={history}/>      
        );
      }

    componentDidMount(){
      this.setState({
        historyRecords: [{"name":"Irfan", "rating": "4.5", "bill": "1500", "category":"Electrician"},
        {"name":"Zain", "rating": "5", "bill": "2000", "category":"Electrician"},
        {"name":"Zubair", "rating": "4", "bill": "3500", "category":"Plumber"},
        {"name":"Imran", "rating": "3.5", "bill": "500", "category":"Electrician"}]
      })
    }

    render(){
        return (          
          <View style={{width:'100%', height:'100%'}}>
          <Text style={{marginTop:30, marginLeft:15, fontWeight:'bold', fontSize:30}}>History</Text>
          <ScrollView>
            {this.renderHistory()}
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
  

export default History;