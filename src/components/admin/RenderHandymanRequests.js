//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, ListItem, List, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
// create a component

acceptHandyman = (id) => {
    fetch('http://192.168.1.116/HandymanAPI/api/activateHandyman/'+id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json().then(data => {
            console.warn(data)            
        }))
        .catch((error) => {
            console.warn(error);
        });
}

rejectHandyman = (id) => {
    fetch('http://192.168.1.116/HandymanAPI/api/rejectHandyman/'+id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json().then(data => {
            console.warn(data)            
        }))
        .catch((error) => {
            console.warn(error);
        });
}

const RenderHandymanRequests = ({ record }) => {
    return (<View style={{ flex: 1, marginTop: 5 }}>
        <FlatList             
            data={record}
            keyExtractor={item => item.name}
            renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', height: 80, alignItems:'center', marginHorizontal: 15, marginVertical: 3, backgroundColor: 'white', borderRadius: 8 }}>
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
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => rejectHandyman(item.id)}>
                            <EntypoIcon
                                name="cross"
                                size={40}
                                color="red"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        />
    </View>)
}

//make this component available to the app
export default RenderHandymanRequests;