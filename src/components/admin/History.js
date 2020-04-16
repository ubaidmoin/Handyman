import React, { Component } from 'react';
import { Modal, Text, View, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontIcon from 'react-native-vector-icons/MaterialIcons';
import StarRating from 'react-native-star-rating';
import Communications from 'react-native-communications';

import { Input, Button, Header, Card, CardSection } from '../common';
import RenderAllHandyman from './RenderAllHandyman';

class AllHandyman extends Component {
    state = { email: '', password: '', id: this.props.navigation.getParam('id', 0), history: [], name: this.props.navigation.getParam('name', '') };

    componentDidMount() {
        this.getHandymanHistory(this.state.id)
    }

    getHandymanHistory(id) {
        fetch('http://'+ global.ip +'/HandymanAPI/api/getHandymanHistory/'+id)
            .then(response => response.json().then(data => {
                // console.warn(data)
                this.setState({
                    history: data.sort((a, b) => a.name > b.name)
                })                
            }))
            .catch((error) => {
                console.warn(error);
            });
    }

    renderHistory() {
        return (<View style={{ flex: 1, marginTop: 5 }}>
            <FlatList
                data={this.state.history}
                keyExtractor={item => item.id+''}
                renderItem={({ item, index }) => (
                    <View>
                        <View style={{ flexDirection: 'row', height: 80, alignItems: 'center', marginHorizontal: 20, marginVertical: 5, backgroundColor: 'white', borderRadius: 5 }}>
                            {/* <View style={{ position: 'absolute', top: 2, right: 2 }}>
                                <TouchableOpacity>
                                    <AntDesignIcon
                                        style={{ marginLeft: 10 }}
                                        name="down"
                                        size={15}
                                        color="black"
                                    />
                                </TouchableOpacity>
                            </View> */}
                            <Image source={(item.cImage === null) ? require('../assets/user.jpg') : { uri: `data:image/png;base64,${item.image}` }}
                                style={{ height: 70, width: 70, marginBottom: 5, marginTop: 5, marginLeft: 10, borderRadius: 10 }}
                            />
                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>   
                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.bill}</Text>                                                                
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={item.rating}
                                    starSize={20}
                                    emptyStarColor="grey"
                                    containerStyle={{ width: 30 }}
                                />
                            </View>
                            <View style={{ position: 'absolute', right: 20, top: 25 }}>
                            <TouchableOpacity
                                    onPress={() => Communications.phonecall(item.contact, true)}
                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <FontIcon
                                        name='phone'
                                        size={30}
                                        color='green'
                                    />
                                    <Text style={{ fontSize: 10, color: 'green' }}>Contact</Text>
                                </TouchableOpacity>
                            </View>
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
                    <Text style={{ fontSize: 20, fontWeight: 'bold', backgroundColor: 'white', paddingHorizontal: 5 }}>
                        {this.state.name}
                    </Text>
                    
                </View>
                <ScrollView style={{ marginTop: 20 }}>
                    {this.renderHistory()}
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

export default AllHandyman;