import React, { Component } from "react";
import { StatusBar, View } from "react-native";
import { Provider } from "react-redux";

// import { store } from './src/app/store'
import configureStore from "./src/store";
import AppNavigator from "./src/navigator";
const reducers = require("./src/reducers").default;

class App extends Component {
  state = {
    isLoading: true,
    store: configureStore(reducers, newState => {
      this.setState({ isLoading: false }, () => {
        this.onLoadingComplete();
      });
    })
  };

  onLoadingComplete = () => {};

  render() {
    if (this.state.isLoading) {
      return <View style={{ backgroundColor: "black", flex: 1 }} />;
    }

    return (
      <Provider store={this.state.store}>
        <View style={{ flex: 1 }}>
          <AppNavigator />
        </View>
      </Provider>
    );
  }
}

export { App as default };
