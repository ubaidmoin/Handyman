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

import HistoryScreen from './History';
import RenderHistory from './RenderHistory';
import { Input, Button, Header, Card, Collection } from '../common';

class ScheduledBooking extends Component {

    state = {
        userData: [],
        scheduledRecords: [],
        showActivityIndicator: true
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

    showDetails(item) {
        this.props.navigation.navigate('BookingDetails', {
            item: item
        })
    }

    cancelBooking(sid) {
        fetch('http://' + global.ip + '/HandymanAPI/api/CancelScheduledBooking?id=' + sid, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json().then(data => {
                // console.warn(data)
                this.getScheduledBookings()
            }))
            .catch((error) => {
                console.warn(error);
            });
    }

    renderScheduledRecords = () => {
        return (
            <View style={{ flex: 1, marginTop: 5 }}>
                <FlatList
                    refreshing={true}                    
                    data={this.state.scheduledRecords}
                    keyExtractor={item => item.sid + ''}
                    renderItem={({ item }) => (
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
                            <TouchableOpacity onPress={() => this.showDetails(item)}>
                                <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Service: {item.type}</Text>
                                    <Text style={{ fontSize: 15, paddingTop: 5 }}>Estimated Bill: {(item.billAmount === null) ? 'None' : item.billAmount}</Text>
                                    <Text style={{ fontSize: 15 }}>Date: {item.date.split('T')[0]}</Text>
                                    <Text style={{ fontSize: 15 }}>Time: {item.time}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ position: 'absolute', right: 10, top: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => this.cancelBooking(item.sid)}>
                                    <EntypoIcon
                                        name="cross"
                                        size={40}
                                        color="red"
                                        style={{ marginLeft: 15 }}
                                    />
                                    <Text style={{ marginLeft: 5, fontSize: 10, color: "red" }}>
                                        Cancel Booking
                            </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>
        );
    }

    getScheduledBookings() {
        let url = 'http://' + global.ip + '/HandymanAPI/api/GetScheduledBookings?id=' + this.state.userData.id
        // console.warn(url)
        fetch(url)
            .then(response => response.json().then(data => {
                //console.warn(data)      
                this.setState({
                    scheduledRecords: data,
                    showActivityIndicator: false
                });
            }))
            .catch((error) => {
                alert(error)
            });
    }

    async componentDidMount() {
        let value = await AsyncStorage.getItem('userData')
        let data = JSON.parse(value)
        if (data !== null) {
            this.setState({
                userData: data
            })
            this.getScheduledBookings()
        }

    }

    componentWillUnmount() {
        this.setState({
            userData: [],
            scheduledRecords: [],
            showActivityIndicator: true
        })
    }

    render() {
        return (
            <View style={{ width: '100%', height: '100%' }}>
                {(this.state.showActivityIndicator) ?
                    <View style={{ padding: 10, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator
                            // style={{}} 
                            color="grey" size="large" />
                    </View> : null}
                <ScrollView>
                    {this.renderScheduledRecords()}
                </ScrollView>
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

const YourBookingTabNavigator = createMaterialTopTabNavigator({
    ScheduledBooking: {
        screen: ScheduledBooking,
        navigationOptions: {
            title: 'SCHEDULED'
        }
    },
    History: {
        screen: HistoryScreen,
        navigationOptions: {
            title: 'HISTORY'
        }
    }
}, {
        tabBarOptions: {
            labelStyle: {
                fontSize: 12,
                fontWeight: 'bold'
            },
            style: {
                backgroundColor: '#000',
            }
        }
    })

export default createAppContainer(YourBookingTabNavigator);