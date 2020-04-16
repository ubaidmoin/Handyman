import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  AsyncStorage,
  TextInput
} from 'react-native';
import { CheckBox, ListItem } from 'native-base';

import { Input, Button } from '../common';

class ReportProblem extends Component {
  static navigationOptions = {
    title: 'Report a Problem'
  }
  state = {
    title: '',
    description: '',
    onFocus: true,
    onFocusDes: true,
    neverComeBack: false,
    userId: 0,
    sid: this.props.navigation.getParam('sid'),
    hid: this.props.navigation.getParam('hid'),
    alreadyBlock: false
  }

  onButtonPress() {
    let data = []
    data = JSON.stringify({
      id: 0,
      sid: this.state.sid,
      title: this.state.title,
      description: this.state.description
    })
    fetch('http://' + global.ip + '/HandymanAPI/api/reportProblem', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: data
    })
      .then(response => response.json().then(data => {
        console.warn(data)
      }))
      .catch((error) => {
        alert(error)
      });

    if (this.state.neverComeBack) {
      let data1 = []
      data1 = JSON.stringify({
        id: 0,
        cid: this.state.userId,
        hid: this.state.hid,
        reason: this.state.title
      })
      fetch('http://' + global.ip + '/HandymanAPI/api/blockHandyman', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: data1
      })
        .then(response => response.json().then(data => {
          console.warn(data)
        }))
        .catch((error) => {
          alert(error)
        });
    }
  }

  onFocusTitle() {
    this.setState({ onFocus: !this.state.onFocus })
  }

  onFocusDesp() {
    this.setState({ onFocusDes: !this.state.onFocusDes })
  }

  async componentDidMount() {
    let value = await AsyncStorage.getItem('userData')
    let data = JSON.parse(value)
    if (data !== null) {
      this.setState({
        userId: data.id
      })
      fetch('http://' + global.ip + '/HandymanAPI/api/CheckBlocked?cid=' + this.state.userId + '&hid=' + this.state.hid)
        .then(response => response.json().then(data => {
          this.setState({
            alreadyBlock: data
          })
        }))
        .catch((error) => {
          alert(error)
        });
    }
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={{ width: '100%', height: '80%' }}>
        <View style={styles.container}>
          {
            (this.state.alreadyBlock) ?
              <View>
                <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 10 }}>Handyman is already blocked by you.</Text>
              </View> :
              null
          }
          <View style={(this.state.onFocus) ? styles.inputContainerOnFocus : styles.inputContainer}>
            {
              (this.state.onFocus) ?
                <Text style={{ backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 25 }}>
                  Title
            </Text> :
                null
            }
            <TextInput
              style={{ fontSize: 15 }}
              placeholder={(this.state.onFocus) ? '' : 'Title'}
              secureTextEntry={false}
              value={this.state.title}
              onChangeText={title => this.setState({ title })}
              autoCapitalize='words'
              // onFocus={() => this.setState({ onFocus: !this.state.onFocus })}
              // onBlur={() => this.setState({ onFocus: !this.state.onFocus })}
            />
          </View>

          <View style={(this.state.onFocusDes) ? styles.inputDescripContainerOnFocus : styles.inputDescripContainer}>
            {
              (this.state.onFocusDes) ?
                <Text style={{ backgroundColor: '#F4F6F8', fontSize: 12, color: 'black', marginTop: -5, width: 65 }}>
                  Description
            </Text> :
                null
            }
            <TextInput
              style={{ height: '90%', fontSize: 15 }}
              placeholder={(this.state.onFocusDes) ? '' : 'Description'}
              secureTextEntry={false}
              value={this.state.description}
              onChangeText={description => this.setState({ description })}
              autoCapitalize='sentences'
              multiline={true}
              autoCorrect={false}
              // onFocus={() => this.setState({ onFocusDes: !this.state.onFocusDes })}
              // onBlur={() => this.setState({ onFocusDes: !this.state.onFocusDes })}
            />
          </View>
          {(!this.state.alreadyBlock) ? <View style={{ alignSelf: 'flex-start', paddingLeft: '6%' }}>
            <ListItem
              onPress={() => this.setState({ neverComeBack: !this.state.neverComeBack })}>
              <CheckBox                
                color='black'
                onPress={() => this.setState({ neverComeBack: !this.state.neverComeBack })}
                checked={this.state.neverComeBack} />
              <View>
                <Text>Never Come Back.</Text>
              </View>
            </ListItem>
          </View> : null}
          <View style={styles.buttonContainer}>
            <Button
              onPress={this.onButtonPress.bind(this)}
            >Submit</Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  inputContainer: {
    borderColor: '#F4F6F8',
    borderWidth: 1,
    width: '80%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F4F6F8',
    paddingLeft: 5,
    paddingTop: 10
  },
  inputContainerOnFocus: {
    borderColor: 'grey',
    borderWidth: 1,
    width: '80%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F4F6F8',
    paddingLeft: 5,
    flexDirection: 'column'

  },
  inputDescripContainer: {
    marginBottom: 10,
    marginTop: 10,
    borderColor: '#F4F6F8',
    borderWidth: 1,
    width: '80%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#F4F6F8',
    paddingLeft: 5
  },
  inputDescripContainerOnFocus: {
    marginBottom: 10,
    marginTop: 10,
    borderColor: 'grey',
    borderWidth: 1,
    width: '80%',
    height: 200,
    flexDirection: 'column',
    borderRadius: 10,
    backgroundColor: '#F4F6F8',
    paddingLeft: 5
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
  }
});


export default ReportProblem;