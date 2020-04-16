import React, { Component } from 'react';
import { Modal, Text, View, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontIcon from 'react-native-vector-icons/MaterialIcons';
import StarRating from 'react-native-star-rating';
import Communications from 'react-native-communications';

import { Input, Button, Header, Card, CardSection } from '../common';
import RenderAllHandyman from './RenderAllHandyman';

class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fine: '',
        };
    }

    componentDidMount() {
        this.getDebt()
    }

    getDebt(){
        let url = 'http://' + global.ip + '/HandymanAPI/api/GetDebt'
        // console.warn(url)
        fetch(url)
            .then(response => response.json().then(data => {
                this.setState({
                    fine: data + ''
                })
            }))
            .catch((error) => {
                alert(error)
            });
    }

    onButtonPress() {
        let url = 'http://' + global.ip + '/HandymanAPI/api/SetDebt?a='+this.state.fine
        // console.warn(url)
        fetch(url, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        })
            .then(response => response.json().then(data => {
                console.warn(data)
                this.getDebt()
            }))
            .catch((error) => {
                alert(error)
            });
    }

    render() {
        return (
            <View style={{ width: '100%', height: '100%', backgroundColor: '#EBEFF3' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 30 }}>
                    <Text>Cancel Booking Debt (Rs.)</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={{ fontSize: 15, marginLeft: 15, flex: 1 }}
                            placeholder="Enter Amount"
                            value={this.state.fine}
                            onChangeText={(value) => this.setState({ fine: value })}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            onPress={this.onButtonPress.bind(this)}
                        >Update</Button>
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
        alignItems: 'center',
        width: '100%',
        height: "100%"
    },
    inputContainer: {
        marginTop: 5,
        marginBottom: 5,
        borderColor: '#F4F6F8',
        borderWidth: 1,
        width: '80%',
        height: 40,
        borderRadius: 10,
        backgroundColor: '#F4F6F8',
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
        marginLeft: '10%',
        width: '70%',
        borderRadius: 30,
        marginTop: 20
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

export default Settings;