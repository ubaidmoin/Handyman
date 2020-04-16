import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { Rating } from 'react-native-elements';

import { Input, Button, Header, Card, Collection, CardSection } from '../common';
import RenderBill from './RenderBill';

class Feedback extends Component {
  static navigationOptions = {
    title: 'Feedback',
    headerLeft: null
  };

  state = { services: [], total: 0 }

  calculateTotal() {

  }

  onSubmitClick = () => {
    this.props.navigation.navigate('Home')
  }

  componentDidMount() {
    this.setState({
      services: [{ "name": "TV Repair", "price": 500 },
      { "name": "AC Installment", "price": 1500 },
      { "name": "Breaker Installment", "price": 200 }],
      total: this.calculateTotal()
    })
  }

  renderBill = () => {
    return this.state.services.map(service =>
      <RenderBill key={service.name} service={service} />)
  }

  render() {
    return (
      <ImageBackground source={require("../assets/login.jpg")} style={{ width: '100%', height: '100%' }}>
        <View style={{ width: '100%', height: '100%' }}>
          <Text style={{ marginTop: 30, marginLeft: 15, paddingBottom: 30, fontWeight: 'bold', fontSize: 30 }}>Bill & Feedback</Text>
          <Card>
            <CardSection>
              <View>
                <Text style={{ marginLeft: 10, fontSize: 25, fontWeight: 'bold' }}>Provided Services</Text>
                {this.renderBill()}
                <View style={styles.detailContainer}>
                  <Text style={{ fontSize: 15 }}>Total</Text>
                  <Text style={{ fontSize: 15, paddingRight: 20 }}>{this.state.total}</Text>
                </View>
              </View>
            </CardSection>
          </Card>
          <Text style={{ marginTop: 30, alignSelf: 'center', fontWeight: 'bold', fontSize: 30, backgroundColor: 'white' }}>Ratings</Text>

          <Rating
            type='heart'
            ratingColor='black'
            ratingBackgroundColor='black'
            ratingCount={5}
            onFinishRating={this.ratingCompleted}
            style={{ paddingVertical: 10, marginTop: -10 }}
          />
          <TouchableOpacity style={styles.bottomButton} onPress={() => this.onSubmitClick()}>
            <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
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
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingTop: 15
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  }
});


export default Feedback;