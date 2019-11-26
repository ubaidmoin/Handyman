import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground, KeyboardAvoidingView, TouchableOpacity, Icon, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Input, Button, Header, Card, CardSection, Collection } from '../common';

const CollectionView = ({service, index, navigation}) => {  
  const { name, logo } = service;

  let imagePath = logo

  const onClickListener = (name) => {    
    navigation.navigate('SearchHandyman', {
      category: name
    })
  }

  const renderImage = (name) => {
    
  }
        return (                    
            <Collection>
             <TouchableOpacity onPress={() => onClickListener(name)}>
                <View style={styles.cardSectionStyle}>
                    <View style={{flexDirection:'column', marginLeft: 40}}>
                        {(name === 'Electrician')?
    <Image source={require('../assets/electricianLogo.jpg')} style={styles.displayPicStyle} />
     : (name === 'Plumber') ?
    <Image source={require('../assets/plumberLogo.jpg')} style={styles.displayPicStyle} />
    : (name === 'Carpenter') ?
    <Image source={require('../assets/carpenterLogo.jpg')} style={styles.displayPicStyle} />
    : (name === 'Beautician') ?
    <Image source={require('../assets/beauticianLogo.png')} style={styles.displayPicStyle} />
    : (name === 'Mechanic') ?
    <Image source={require('../assets/mechanicLogo.png')} style={styles.displayPicStyle} /> : 
    (name === 'Painter') ?
    <Image source={require('../assets/painter.png')} style={styles.displayPicStyle} /> : {}}
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, alignSelf:'center'}}>{name}</Text>
                    </View>
                </View>    
              </TouchableOpacity>            
             </Collection>
             
        );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2},
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
        borderBottomWidth: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
        position: 'relative',            
    }
  });
  

export default withNavigation(CollectionView);