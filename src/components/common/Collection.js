import React from 'react';
import { View } from 'react-native';

const Collection = (props) => {
    return (
        <View style = { styles.containerStyle }>
            {props.children}
        </View>
    );
};

const styles = {
    containerStyle: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        paddingTop: 5,        
        width: '47%',         
    }
};

export { Collection };