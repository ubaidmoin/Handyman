import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    AsyncStorage,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    FlatList
} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import RenderService from '../handyman/RenderService';
import HistoryScreen from './History';
import RenderHistory from './RenderHistory';
import { Input, Button, Header, Card, Collection } from '../common';

class BookingDetails extends Component {

    state = {
        userData: [],
        item: this.props.navigation.getParam('item', null),
        showActivityIndicator: true,
        details: null
    }

    //   static navigationOptions = ({ navigation }) => ({
    //     title: 'History',
    //     headerLeft: (<IoniconsIcon
    //       style={{ marginLeft: 10 }}
    //       name='ios-menu'
    //       size={30}
    //       color='#000'
    //       onPress={() => navigation.toggleDrawer()}
    //     />),
    //   });    

    renderDetails() {
        return this.state.details.map(service =>
            <RenderService key={service.sub_service} service={service} />)
    }

    async componentDidMount() {
        let value = await AsyncStorage.getItem('userData')
        let data = JSON.parse(value)
        if (data !== null) {
            this.setState({
                userData: data
            })
        }
        let url = 'http://' + global.ip + '/HandymanAPI/api/getBookingDetails/' + this.state.item.sid
            // console.warn(url)
            fetch(url)
                .then(response => response.json().then(data => {
                    // console.warn(data)
                    if (data != null) {
                        this.setState({
                            details: data,
                            showActivityIndicator: false
                        })
                    }
                }))
                .catch((error) => {
                    alert('Error.')
                });

    }

    cancelBooking(sid) {
        fetch('http://'+ global.ip +'/HandymanAPI/api/CancelScheduledBooking?id=' + sid, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json().then(data => {
                // console.warn(data)
                this.props.navigation.pop();
            }))
            .catch((error) => {
                console.warn(error);
            });
    }

    render() {
        return (
            <View style={{ width: '100%', height: '100%', paddingTop: 20 }}>
                <View style={{
                    marginHorizontal: 20,
                    marginVertical: 5,
                    backgroundColor: 'white',
                    borderRadius: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                }}>
                    <View style={{ marginLeft: 10, flexDirection: 'column', marginLeft: 10 }}>
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', paddingTop: 5 }}>Service: {this.state.item.type}</Text>
                        </View>
                        <Text style={{ fontSize: 15, paddingTop: 15 }}>Estimated Bill: {(this.state.item.billAmount === null) ? 'None' : this.state.item.billAmount}</Text>
                        <Text style={{ fontSize: 15, paddingTop: 5 }}>Date: {this.state.item.date.split('T')[0]}</Text>
                        <Text style={{ fontSize: 15, paddingTop: 5 }}>Time: {this.state.item.time}</Text>

                        {(this.state.item.billAmount !== null) ?
                            <View style={{ borderBottomColor: '#000', borderBottomWidth: 1 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', paddingTop: 10 }}>Booking Details</Text>
                            </View> :
                            <Text style={{ fontSize: 15, fontWeight: 'bold', paddingTop: 15 }}>No details were added while booking.</Text>
                        }
                        {(this.state.details !== null) ? this.renderDetails() : null}
                        <View style={{alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity onPress={() => this.cancelBooking(this.state.item.sid)}>
                                    <EntypoIcon
                                        name="cross"
                                        size={40}
                                        color="red"
                                        style={{marginLeft: 20}}
                                    />
                                    <Text style={{ marginLeft: 5, fontSize: 13, color: "red" }}>
                                        Cancel Booking
                            </Text>
                                </TouchableOpacity>
                        </View>
                    </View>
                </View>
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

export default BookingDetails;