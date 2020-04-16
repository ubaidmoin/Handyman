import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

import { Input, Button, Header, Card, Collection } from '../common';
import RenderHistory from './RenderHistory';

class History extends Component {

  state = {
    userData: [],
    historyRecords: [],
    showActivityIndicator: true
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'History',
    headerLeft: (<IoniconsIcon
      style={{ marginLeft: 10 }}
      name='ios-menu'
      size={30}
      color='#000'
      onPress={() => navigation.toggleDrawer()}
    />),
  });

  renderHistory = () => {
    return this.state.historyRecords.map(history =>
      <RenderHistory key={history.$id} history={history} />
    );
  }

  async componentDidMount() {
    let value = await AsyncStorage.getItem('userData')
    let data = JSON.parse(value)
    if (data !== null) {
      this.setState({
        userData: data
      })
      let url = 'http://' + global.ip + '/HandymanAPI/api/getCustomerHistory/' + this.state.userData.id
      // console.warn(url)
      fetch(url)
        .then(response => response.json().then(data => {
          //console.warn(data)      
          this.setState({
            historyRecords: data,
            showActivityIndicator: false
          });
        }))
        .catch((error) => {
          alert(error)
        });
    }

  }

  render() {
    return (
      <View style={{ width: '100%', height: '100%' }}>  
      {(this.state.showActivityIndicator) ?
          <View style={{padding: 10, backgroundColor: 'white', justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator 
        // style={{}} 
        color="grey" size="large" />
        </View> : null}       
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
    width: '100%',
    height: "100%",
    paddingTop: 250
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: 'lightgrey',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: '80%',
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
    borderRadius: 30,
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
  detailContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
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