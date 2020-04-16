import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Icon,
  Image
} from 'react-native';
import { ListItem, CheckBox, Body } from 'native-base';

export function checkChanged(check) {
  if (check === false)
    return true;
  return false;
}
const Services = ({ service }) => {
  var check = service.checked
  return (
    <ListItem onPress={() => checkChanged(check)}>
      <CheckBox checked={checkChanged()} color="green" />
      <Body>
        <Text>{'   ' + service.name}</Text>
      </Body>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: 30
  },
  detailContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '40%',
    height: 20
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


export default Services;