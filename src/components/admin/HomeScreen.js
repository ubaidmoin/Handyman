import React, { Component } from 'react';
import { AsyncStorage, Text, View, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { Input, Button, Header, Card, CardSection } from '../common';
import AllHandymanScreen from './AllHandyman'
import RenderHandymanRequests from './RenderHandymanRequests';

class HomeScreen extends Component {
    
    constructor(props){
        super(props);
        this.state = { email: '', password: '', newRequests: [] };        
    }

    componentDidMount() {        
        this.getNewRequests()        
    }

    getNewRequests() {
        fetch('http://'+ global.ip +'/HandymanAPI/api/getNewlyRegisteredHandyman')
            .then(response => response.json().then(data => {
                // console.warn(data)
                this.setState({
                    newRequests: data.sort((a, b) => a.category > b.category)
                })
            }))
            .catch((error) => {
                console.warn(error);
            });
    }

    acceptHandyman = (id) => {
        fetch('http://'+ global.ip +'/HandymanAPI/api/activateHandyman/' + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json().then(data => {
                // console.warn(data)
                this.getNewRequests()
            }))
            .catch((error) => {
                console.warn(error);
            });
    }

    rejectHandyman = (id) => {
        fetch('http://'+ global.ip +'/HandymanAPI/api/rejectHandyman/' + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json().then(data => {
                // console.warn(data)
                this.getNewRequests()
            }))
            .catch((error) => {
                console.warn(error);
            });
    }

    renderRequests() {
        return (<View style={{ flex: 1, marginTop: 5 }}>
            <FlatList
                refreshing={true}
                data={this.state.newRequests}
                keyExtractor={item => item.name}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', height: 80, alignItems: 'center', marginHorizontal: 15, marginVertical: 3, backgroundColor: 'white', borderRadius: 8 }}>
                        <Image source={(item.image === null) ? require('../assets/user.jpg') : { uri: `data:image/png;base64,${item.image}` }}
                            style={{ height: 70, width: 70, marginBottom: 5, marginTop: 5, marginLeft: 10, borderRadius: 10 }}
                        />
                        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                            <Text style={{ fontSize: 15 }}>{item.category}</Text>
                            <Text style={{ fontSize: 15 }}>{item.contact}</Text>
                        </View>
                        <View style={{ position: 'absolute', right: 20, top: 15, flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => acceptHandyman(item.id)}>
                                <EntypoIcon
                                    name="check"
                                    size={40}
                                    color="green"
                                />
                                <Text style={{ marginLeft:5, fontSize: 10, color: "green" }}>
                                    Accept
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => rejectHandyman(item.id)}>
                                <EntypoIcon
                                    name="cross"
                                    size={40}
                                    color="red"
                                />
                                <Text style={{ marginLeft:5, fontSize: 10, color: "red" }}>
                                    Reject
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>)
    }

    render() {
        return (
            <View style={{ width: '100%', height: '100%', backgroundColor: '#EBEFF3' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                    {/* <Text style={{ fontSize: 30, fontWeight: 'bold', backgroundColor: 'white', paddingHorizontal: 5 }}>
                        New Requests
                    </Text> */}
                </View>
                <ScrollView style={{marginTop: 20}}>
                    {this.renderRequests()}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: "100%"
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
    }
});

const AdminTabNavigator = createBottomTabNavigator({
    NewRequests: {
        screen: HomeScreen,
        navigationOptions: {
            title: 'New Requests',
            tabBarIcon: (<Image source={require('../../assets/request.png')} style={{width: 30, height: 30, alignSelf: 'center'}} />)
        }
    },
    AllHandyman: {
        screen: AllHandymanScreen,
        navigationOptions: {
            title: 'All Handymen',
            tabBarIcon: (<Image source={require('../../assets/handymanIcon.png')} style={{width: 30, height: 30, alignSelf: 'center'}} />)
        }
    }
}, {
    tabBarOptions: {
        style: {
            height: 70
        }
    }
})

export default createAppContainer(AdminTabNavigator);