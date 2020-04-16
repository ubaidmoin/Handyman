import React, { Component } from 'react';
import { Modal, Text, View, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import StarRating from 'react-native-star-rating';

import { Input, Button, Header, Card, CardSection } from '../common';
import RenderAllHandyman from './RenderAllHandyman';

class Complaints extends Component {
    state = { email: '', password: '', complaints: [] };

    componentDidMount() {
        this.getComplaints()
    }

    getComplaints() {
        fetch('http://' + global.ip + '/HandymanAPI/api/getComplaints')
            .then(response => response.json().then(data => {
                // console.warn(data)                
                this.setState({
                    complaints: data
                })
                this.state.complaints.forEach(element =>
                    element.showDescription = false
                )
            }))
            .catch((error) => {
                console.warn(error);
            });
    }

    showDescription(index) {
        let data = [...this.state.complaints]
        let item = data[index]
        item.showDescription = !item.showDescription
        data.forEach(element => {
            if (element.id !== item.id) {
                element.showDescription = false
            }
        })
        this.setState({ complaints: data })
    }

    navigateToDetails(id) {
        this.props.navigation.navigate('Details', { id: id })
    }

    renderComplaints() {
        return (<View style={{ flex: 1, marginTop: 5 }}>
            <FlatList
                data={this.state.complaints}
                keyExtractor={item => item.id + ''}
                renderItem={({ item, index }) => (
                    <View>
                        <View style={{ flexDirection: 'row', height: 80, alignItems: 'center', marginHorizontal: 20, marginVertical: 5, backgroundColor: 'white', borderRadius: 5 }}>
                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                <View style={{ borderBottomWidth: 1, borderColor: 'lightgrey', flexDirection: 'row', marginTop: 5, justifyContent: 'space-between', width: '85%' }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}></Text>
                                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Complaint No. {item.id}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>Bill Amount</Text>
                                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>Rs. {item.billAmount}</Text>
                                    </View>
                                </View>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 10 }}>{item.title}</Text>
                            </View>
                            <View style={{ position: 'absolute', right: 20, top: 45 }}>
                                <TouchableOpacity
                                    onPress={() => this.showDescription(index)}
                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <AntDesignIcon
                                        name={(item.showDescription !== true) ? "downcircle" : "upcircle"}
                                        size={20}
                                        color="black"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {(item.showDescription === true) ?
                            <View style={{ flexDirection: 'row', height: 80, alignItems: 'center', marginHorizontal: 20, marginBottom: 5, marginTop: -8, backgroundColor: 'white', borderRadius: 5 }}>
                                <View style={{ flexDirection: 'row', marginLeft: 10, width: '100%' }}>
                                    <Text style={{ fontSize: 15, width: '75%' }}>{item.description.substring(0, 70)}...</Text>
                                    <TouchableOpacity
                                        onPress={() => this.navigateToDetails(item.id)}
                                        style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={require('../../assets/detailsIcon.png')} style={{ height: 30, width: 30 }} />
                                        <Text style={{ fontSize: 12 }}>Show Details</Text>
                                    </TouchableOpacity>
                                </View>
                            </View> :
                            null
                        }
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
                        All Handymen
                    </Text> */}
                </View>
                <ScrollView style={{ marginTop: 20 }}>
                    {this.renderComplaints()}
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

export default Complaints;