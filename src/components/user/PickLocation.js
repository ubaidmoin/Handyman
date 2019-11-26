import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Icon, Image, ScrollView, TextInput} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const homePlace = { description: 'Home', geometry: { location: { lat: 33.5576, lng: 73.0577 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 33.5969, lng: 73.0528 } }};
class PickLocation extends Component {
    static navigationOptions = {
        title: 'Pick Location',
      };

      constructor(props){
        super(props)
      }

    state = { category: this.props.navigation.getParam('category', ''), latitude: null, longitude: null, error: null, address: this.props.navigation.getParam('address', '')}    

    componentDidMount() {      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,             
            error: null
          })
        },
        (error) => this.setState({ error: error.message }),        
      );
     } 

    render(){
        return (          
            <View style={styles.container}>
            <TextInput pointerEvents="none" style={styles.input} value={this.state.address} />
            <GooglePlacesAutocomplete
         placeholder="Search"
         minLength={2} // minimum length of text to search
         autoFocus={false}
         returnKeyType={'search'} 
         listViewDisplayed="false" 
         fetchDetails={true}
         renderDescription={row => row.description ||   row.formatted_address || row.name}
          onPress={(data, details = null) => {
          }}
         getDefaultValue={() => {
           return ''; // text input default value
         }}
         query={{
          
           key: 'AIzaSyDNA9nURgVDmwVFFOatLwYS-mGtOsGelqY',
           language: 'en', // language of the results
           
         }}
         styles={{
           description: {
             fontWeight: 'bold',
           },
           predefinedPlacesDescription: {
             color: '#1faadb',
           },
         }}
         enablePoweredByContainer={true}
         
         nearbyPlacesAPI="GoogleReverseGeocoding" 
        
         GooglePlacesSearchQuery={{
          
           rankby: 'distance',
           types: 'food',
         }}
         filterReverseGeocodingByTypes={[
           'locality',
           'administrative_area_level_1',
         ]} 
         predefinedPlaces={[homePlace, workPlace]}
         debounce={200}
       />
            <TouchableOpacity style={styles.bottomButton} onPress={() => this.getLocation()}>
                <Text style={{color:'white', fontSize:30, fontWeight: 'bold'}}>Done</Text>
            </TouchableOpacity>
            </View>                     
             
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    height: '100%'
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
    buttonContainer: {
      marginTop: 30,
      marginBottom: 5,
      marginLeft: 15,
      height:25,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width:'60%',
      borderRadius:30,
    },
    buttonStyle: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E0E1E1',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E0E1E1',    
        marginRight: 10  
    },
    bottomButton: {
      position: 'absolute',
      bottom:0,
      left:0,
      right: 0,
      backgroundColor: 'black',    
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,    
    },
    mapStyle: {
      flex: 1
    },
    input: {
      height: 36,
      padding: 10,
      margin: 18,
      fontSize: 18,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: '#000',
      backgroundColor: 'rgba(0,0,0,0)',
  }
  });
  

export default PickLocation;