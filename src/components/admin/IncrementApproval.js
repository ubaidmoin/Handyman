import React, { Component } from 'react';
import { Modal, Text, View, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontIcon from 'react-native-vector-icons/MaterialIcons';
import StarRating from 'react-native-star-rating';
import UIStepper from 'react-native-ui-stepper';

class ApproveIncrement extends Component {
    state = { allHandyman: [], incrementer: 0, refreshing: false };

    componentDidMount() {
        this.getAllHandyman()
    }

    getAllHandyman() {        
        fetch('http://'+ global.ip +'/HandymanAPI/api/CheckExperience')        
            .then(response => response.json().then(data => {
                // console.warn(data)
                this.setState({
                    allHandyman: data.sort((a, b) => a.category > b.category)
                })
                // this.state.allHandyman.forEach(element =>
                //     element.buttons = false
                // )
            }))
            .catch((error) => {
                console.warn(error);
            });
    }

    approveIncrement = (id) => {
        fetch('http://'+ global.ip +'/HandymanAPI/api/ApproveIncrement?id=' + id)
            .then(response => response.json().then(data => {
                console.warn(data)
                this.getAllHandyman()
            }))
            .catch((error) => {
                console.warn(error);
            });
    }

    rejectIncrement = (id) => {
        fetch('http://'+ global.ip +'/HandymanAPI/api/RejectIncrement?id=' + id)
            .then(response => response.json().then(data => {
                console.warn(data)
                this.getAllHandyman()
            }))
            .catch((error) => {
                console.warn(error);
            });
    }

    increaseYear(){
        fetch('http://'+ global.ip +'/HandymanAPI/api/IncreaseYear')
            .then(response => response.json().then(data => {
                console.warn(data)
                this.getAllHandyman()
            }))
            .catch((error) => {
                console.warn(error);
            });
    }
    

    // showButtons(index) {
    //     let hs = [...this.state.allHandyman]
    //     let item = hs[index]
    //     item.buttons = !item.buttons
    //     hs.forEach(element => {
    //         if (element.id !== item.id) {
    //             element.buttons = false
    //         }
    //     })
    //     this.setState({
    //         allHandyman: hs
    //     })
    // }

    renderHandyman() {
        return (<View style={{ flex: 1, marginTop: 5 }}>
            <FlatList
                data={this.state.allHandyman}
                onRefresh={() => this.refreshing()}
                refreshing={this.state.refreshing}   
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
                            <Image source={(item.image === null) ? require('../assets/user.jpg') : { uri: `data:image/png;base64,${item.image}` }}
                                style={{ height: 70, width: 70, marginBottom: 5, marginTop: 5, marginLeft: 10, borderRadius: 10 }}
                            />
                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                                <Text style={{ fontSize: 15 }}>{item.category}</Text>
                                <Text style={{ fontSize: 15 }}>{item.contact}</Text>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={item.rating}
                                    starSize={20}
                                    emptyStarColor="grey"
                                    containerStyle={{ width: 30 }}
                                />
                            </View>
                            <View style={{ position: 'absolute', right: 20, top: 20, flexDirection:'row' }}>
                            <TouchableOpacity onPress={() => this.approveIncrement(item.id)}>
                                <EntypoIcon
                                    name="check"
                                    size={40}
                                    color="green"
                                />
                                <Text style={{ marginLeft:5, fontSize: 10, color: "green" }}>
                                    Approve
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.rejectIncrement(item.id)}>
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
                    </View>
                )}
            />
        </View>)
    }

    refreshing() {
        this.setState({
            refreshing: true
        })
        this.componentDidMount()
        this.setState({
            refreshing: false
        })

    }

    render() {
        return (
            <View style={{ width: '100%', height: '100%', backgroundColor: '#EBEFF3' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', backgroundColor: 'white', opacity: 0.9, paddingHorizontal: 5, padding: 10, borderRadius: 10 }}>
                        Pending Increments
                    </Text>
                    {/* <Text style={{ fontSize: 17, backgroundColor: 'white', opacity: 0.9, paddingHorizontal: 5, padding: 10, borderRadius: 10 }}>
                        (Another year completed for these handyman)
                    </Text> */}
                </View>
                <View style={{ position:'absolute', right: 0, top: 60, flexDirection:'row', backgroundColor: 'white', opacity: 0.9, padding: 10, borderRadius: 10 }}>
                    <View>
                        <Text  style={{ fontSize: 15, marginRight: 5, fontWeight:'bold' }}>
                            Change Year
                        </Text>
                    </View>
                <UIStepper                  
                  value={this.state.incrementer}                  
                  onValueChange={() => this.increaseYear()}
                  tintColor='black'
                  borderColor='black'
                  textColor='black'
                  width={70}                  
                  height={25}
                  minValue={0}
                />
                </View>
                <View style={{ marginTop: 50, height: '100%' }}>
                    {this.renderHandyman()}
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

export default ApproveIncrement;