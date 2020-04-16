import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableOpacity,
  Icon,
  Image
} from 'react-native';

import { Input, Button, Header, Card, CardSection } from '../common';

const RenderService = ({ service }) => {
  const { sub_service, price, quantity } = service;

  return (
    <CardSection>
      <View style={styles.detailContainer}>
        <Text style={{ fontSize: 15 }}>{(sub_service !== "Total") ? sub_service : "Estimated Bill"}</Text>
        <Text style={{ fontSize: 15 }}>{(sub_service !== "Total") ? quantity : price}</Text>
      </View>
    </CardSection>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: 30
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    paddingLeft: 30,
    paddingTop: 15
  },
  displayPicStyle: {
    width: 100,
    height: 100,
    borderRadius: 10
  },
  buttonContainer: {
    marginTop: 20,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    width: '30%',
    height: 40,
    borderRadius: 30,
  },
  buttonStyle: {
    flex: 1,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#0590DA',
    backgroundColor: '#0590DA',
    alignItems: 'center',
    justifyContent: 'center',
  }
});


export default RenderService;