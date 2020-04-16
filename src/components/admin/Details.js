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

class Details extends Component {
    state = { email: '', password: '', complaintId: this.props.navigation.getParam('id', 0), complaint: null };

    componentDidMount() {
        this.getComplaintDetails()
    }

    blockUnblockHandyman = (id) => {
        fetch('http://' + global.ip + '/HandymanAPI/api/activateHandyman/' + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json().then(data => {
                // console.warn(data)
                this.getComplaintDetails()
            }))
            .catch((error) => {
                console.warn(error);
            });
    }

    showHandymanHistory(id) {

    }

    getComplaintDetails() {
        fetch('http://' + global.ip + '/HandymanAPI/api/getComplaintDetails/' + this.state.complaintId)
            .then(response => response.json().then(data => {
                // console.warn(data)
                this.setState({
                    complaint: data[0]
                })
                this.setState({
                    complaint: { ...this.state.complaint, buttons: false }
                })
            }))
            .catch((error) => {
                console.warn(error);
            });
    }

    showButtons() {
        let data = this.state.complaint
        data.buttons = !data.buttons
        this.setState({
            complaint: data
        })
    }

    renderDetails() {
        if (this.state.complaint !== null) {
            return (<View style={{ justifyContent: 'center', width: '100%', paddingHorizontal: 20, paddingVertical: 20, backgroundColor: 'white', borderRadius: 5 }}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', borderBottomWidth: 1, borderBottomColor: 'lightgrey' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                            Complaint No. {this.state.complaint.id}
                        </Text>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                                Bill Amount
                        </Text>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                                Rs.{this.state.complaint.billAmount}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', paddingTop: 20 }}>
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', width: '90%', borderBottomWidth: 1, borderBottomColor: 'lightgrey' }}>
                                {this.state.complaint.title}
                            </Text>
                        </View>
                        <Text style={{ fontSize: 15 }}>
                            {this.state.complaint.description}
                        </Text>
                    </View>
                </View>
                <View style={{ width: '90%', borderBottomWidth: 1, borderBottomColor: 'lightgrey' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Customer</Text>
                </View>
                <View style={{ width: '100%' }}>
                    <View style={{ flexDirection: 'row', height: 80, alignItems: 'center', marginVertical: 5, backgroundColor: '#EBEFF3', borderRadius: 5 }}>
                        <Image source={(this.state.complaint.cImage === null) ? require('../assets/user.jpg') : { uri: `data:image/png;base64,${this.state.complaint.cImage}` }}
                            style={{ height: 70, width: 70, marginBottom: 5, marginTop: 5, marginLeft: 10, borderRadius: 10 }}
                        />
                        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this.state.complaint.cName}</Text>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={this.state.complaint.cRating}
                                starSize={20}
                                emptyStarColor="grey"
                                containerStyle={{ width: 30 }}
                            />
                        </View>
                        <View style={{ position: 'absolute', right: 20, top: 25 }}>
                            <TouchableOpacity
                                onPress={() => Communications.phonecall(this.state.complaint.hContact, true)}
                                style={{ justifyContent: 'center', alignItems: 'center' }}
                            >
                                <FontIcon
                                    name='phone'
                                    size={30}
                                    color='green'
                                />
                                <Text style={{ fontSize: 13, color: 'green' }}>Contact</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ width: '90%', borderBottomWidth: 1, borderBottomColor: 'lightgrey' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Handyman</Text>
                </View>
                <View style={{ width: '100%', flexDirection:'column' }}>
                    <View style={{ flexDirection: 'row', height: 80, alignItems: 'center', marginVertical: 5, backgroundColor: '#EBEFF3', borderRadius: 5 }}>
                        <Image source={(this.state.complaint.hImage === null) ? require('../assets/user.jpg') : { uri: `data:image/png;base64,${this.state.complaint.hImage}` }}
                            style={{ height: 70, width: 70, marginBottom: 5, marginTop: 5, marginLeft: 10, borderRadius: 10 }}
                        />
                        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this.state.complaint.hName}</Text>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={this.state.complaint.hRating}
                                starSize={20}
                                emptyStarColor="grey"
                                containerStyle={{ width: 30 }}
                            />
                        </View>
                        <View style={{ position: 'absolute', right: 20, top: 25 }}>
                            <TouchableOpacity
                                onPress={() => this.showButtons()}
                                style={{ justifyContent: 'center', alignItems: 'center' }}
                            >
                                <AntDesignIcon
                                    name={(this.state.complaint.buttons !== true) ? "downcircle" : "upcircle"}
                                    size={20}
                                    color="black"
                                />
                            </TouchableOpacity>
                        </View>                        
                    </View>
                    {(this.state.complaint.buttons === true) ?
                            <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', height: 80, alignItems: 'center',  marginTop: -7, backgroundColor: '#EBEFF3', borderRadius: 5 }}>
                                <TouchableOpacity
                                    onPress={() => this.showHandymanHistory(this.state.complaint.id)}
                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <FontAwesomeIcon
                                        name="history"
                                        size={30}
                                        color="black"
                                    />
                                    <Text style={{ fontSize: 10 }}>History</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => Communications.phonecall(this.state.complaint.contact, true)}
                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <FontIcon
                                        name='phone'
                                        size={30}
                                        color='green'
                                    />
                                    <Text style={{ fontSize: 10, color: 'green' }}>Contact</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => blockUnblockHandyman(this.state.complaint.id)}
                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <EntypoIcon
                                        name="block"
                                        size={30}
                                        color="red"
                                    />
                                    <Text style={{ fontSize: 10, color: 'red' }}>Block</Text>
                                </TouchableOpacity>
                            </View> :
                            null
                        }
                </View>
            </View>)
        }
        return null
    }

    render() {
        return (
            <View style={{ width: '100%', height: '100%', backgroundColor: '#EBEFF3' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                </View>
                <ScrollView style={{ marginTop: 20, paddingHorizontal: 20 }}>
                    {this.renderDetails()}
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

export default Details;