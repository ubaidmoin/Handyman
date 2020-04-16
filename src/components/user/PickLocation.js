import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Icon,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import RNGooglePlaces from 'react-native-google-places';

const homePlace = { description: 'Home', geometry: { location: { lat: 33.5576, lng: 73.0577 } } };
const workPlace = { description: 'Work', geometry: { location: { lat: 33.5969, lng: 73.0528 } } };
class PickLocation extends Component {
  static navigationOptions = {
    title: 'Pick Location',
  };

  constructor(props) {
    super(props)
    this.state = {
      places: [],
      userId: this.props.navigation.getParam('userId'),
      latitude: 0,
      longitude: 0,
      destination: "",
      predictions: [],
      category: this.props.navigation.getParam('category', ''),
      address: this.props.navigation.getParam('address', ''),      
    }
    global.position = null
  }

  componentDidMount() {
    let url = 'http://' + global.ip + '/HandymanAPI/api/getFavoritePlaces/' + this.state.userId
    //console.warn(url)    
    fetch(url)
      .then(response => response.json().then(data => {
        // console.warn(data)      
        this.setState({ places: data });
      }))
      .catch((error) => {
        alert(error)
      });
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

  async onChangeDestination(destination){
    this.setState({destination})
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=YOUR_API_KEY&input=${this.state.destination}&location=${this.state.latitude}, ${this.state.longitude}&radius=2000`
    try{
      const result = await fetch(apiUrl)
      const json = await result.json()
      // console.warn(json)
      this.setState({
        predictions: json.predictions
      })
    } catch(err) {
      console.warn(err)
    }    
  }

   async getLatLong(placeid) {    
    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=YOUR_API_KEY`    
    try{
      const result =  await fetch(apiUrl)
      const json =  await result.json()
      global.position = json.result.geometry.location
      this.props.navigation.pop()           
    } catch(err) {
      console.warn(err)
    }        
  }

  render() {    
    const predictions = this.state.predictions.map(prediction =>
      <View key={prediction.id} style={{height: 40, flexDirection: 'column', marginBottom: 5}}>
        <TouchableOpacity onPress={() => this.getLatLong(prediction.place_id)}>
      <Text style={styles.suggestionStyle}>{prediction.description}</Text>
      </TouchableOpacity>
      </View>
      )      
    return (
      <View style={styles.container}>
        <TextInput 
        style={styles.input} 
        value={this.state.destination}
        autoCorrect={false}
        onChangeText = {destination => 
          this.onChangeDestination(destination)
        } 
        /> 
        <ScrollView>
        {predictions}
        </ScrollView>       
        {/* <GooglePlacesAutocomplete
          placeholder="Search"
          minLength={2} // minimum length of text to search
          currentLocation={true}
          autoFocus={false}
          returnKeyType={'search'}
          listViewDisplayed="false"
          fetchDetails={true}
          renderDescription={row => row.description || row.formatted_address || row.name}
          onPress={(data, details = null) => {
          }}
          getDefaultValue={() => {
            return ''; // text input default value
          }}
          query={{

            key: 'YOUR_API_KEY',
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
            'administrative_area_level_3',
          ]}
          predefinedPlaces={this.state.places}          
          debounce={200}
        />
         <TouchableOpacity
          style={styles.button}
          onPress={() => this.openSearchModal()}
        >
          <Text>Pick a Place</Text>
        </TouchableOpacity> */}
      </View>

    )
  }
}

const styles = StyleSheet.create({
  suggestionStyle:{
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#000',        
    backgroundColor: '#F4F6F8',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,    
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
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
  buttonContainer: {
    marginTop: 30,
    marginBottom: 5,
    marginLeft: 15,
    height: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    borderRadius: 30,
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
    bottom: 0,
    left: 0,
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
    height: 40,
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