import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image
} from 'react-native';
import { withNavigation } from 'react-navigation';
import StarRating from 'react-native-star-rating';

import { Input, Button, Header, Card, CardSection } from '../common';

const RenderHistory = ({ history, navigation }) => {
  const { name, rating, image, bill } = history;

  return (
    <View style={{
      flexDirection: 'row',
      height: 80,
      alignItems: 'center',
      marginHorizontal: 20,
      marginVertical: 5,
      backgroundColor: 'white',
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    }}>
        <View>
          <Image
            style={styles.displayPicStyle}
            source={{ uri: `data:image/png;base64,${image}` }} />
        </View>
        <View style={styles.detailContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{name}</Text>
            <Text style={{ fontWeight: 'bold' }}>Rs.{bill}</Text>
          </View>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={rating}
            starSize={20}
            emptyStarColor="grey"
            containerStyle={{ width: 30 }}
            starStyle={{ flexDirection: 'row', justifyContent: 'flex-start' }}
          />
          {/* <Text style={{ fontWeight: 'bold' }}>{category}</Text> */}          
        </View>
      </View>

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
    width: '60%',
    marginLeft: 10
  },
  displayPicStyle: {
    width: 80,
    height: 80,
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


export default withNavigation(RenderHistory);