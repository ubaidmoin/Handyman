import React from "react";
import { Text, View } from "react-native";

const Header = props => {
  return (
    <View style={styles.viewStyle}>
      <Text style={styles.textStyle}>{props.headerText}</Text>
    </View>
  );
};

const styles = {
  viewStyle: {
    backgroundColor: "#E0E1E1",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 80,
    paddingTop: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    borderRadius: 10
  },
  textStyle: {
    fontSize: 20
  }
};

export { Header };
