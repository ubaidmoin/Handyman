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
import * as geolib from 'geolib';
import StarRating from 'react-native-star-rating';

import { Input, Button, Header, Card, CardSection } from '../common';

var meters = false
const calculateDistance = (clientLat, clientLong, lat, long) => {
  var dist = geolib.getDistance({ latitude: clientLat, longitude: clientLong }, {
    latitude: lat,
    longitude: long
  })
  if (dist > 1000) {
    dist = dist / 1000    
    meters = false
  } else {
    meters = true    
  }
  return dist;
}



const HandymanRecords = ({ handyman, clientLat, clientLong, navigation }) => {
  var { name, contact, rating, latitude, longitude, range, image } = handyman;
  
  var distance = calculateDistance(clientLat, clientLong, latitude, longitude)
  if (meters) {
    range *= 1000
  }
  // console.warn(distance + ' ' + range)
  return ((distance <= range) ?
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
            source={(image !== null ) ? {uri: `data:image/png;base64,${image}`} : require('../assets/user.jpg')} />
        </View>
        <View style={styles.detailContainer}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{name}</Text>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={rating}
            starSize={20}
            emptyStarColor="grey"
            containerStyle={{ width: 30 }}
          />
          <Text style={{ fontWeight: 'bold' }}>{contact}</Text>
          <Text>{(meters) ? distance + ' meters away.' : distance.toFixed(2) + ' kilometers away.'}</Text>
        </View>
      </View>
    : null
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
    width: '80%',
    marginLeft: 10
  },
  displayPicStyle: {
    width: 80,
    height: 80,
    borderRadius: 30
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


export default withNavigation(HandymanRecords);