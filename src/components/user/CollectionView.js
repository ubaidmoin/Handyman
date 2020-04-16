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
import { withNavigation } from 'react-navigation';
import { Input, Button, Header, Card, CardSection, Collection } from '../common';

const CollectionView = ({ service, index, navigation, userData }) => {
  const { name, image } = service;

  const onClickListener = (name) => {
    navigation.navigate('SearchHandyman', {
      userData: userData,
      category: name
    })
  }

  return (
    <Collection>
      <View style={styles.cardSectionStyle}>
        <View style={{ flexDirection: 'column', marginLeft: 40 }}>
        <Image source={{uri: `data:image/png;base64,${image}`}} style={styles.displayPicStyle} />
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' }}>{name}</Text>
        </View>
      </View>
    </Collection>

  );
}

const styles = StyleSheet.create({
  container: {
    
    borderRadius: 20,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    paddingTop: 5,
    backgroundColor: '#FFF',
  },
  displayPicStyle: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: 'center'
  },
  cardSectionStyle: {    
    justifyContent: 'flex-start',
    flexDirection: 'row',    
    position: 'relative',
  }
});


export default withNavigation(CollectionView);