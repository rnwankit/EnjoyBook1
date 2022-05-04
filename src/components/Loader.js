import React, {Component} from 'react';
import {View, StyleSheet, ActivityIndicator, Text} from 'react-native';
import {create} from 'react-native/jest/renderer';

class Loader extends Component {
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator color="#ffffff" size="large" />
                <Text style={{fontSize: 20, fontWeight: "bold", textAlign: 'center'}}>{Math.floor(this.props.progress)}%</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
   container: {
       backgroundColor: "rgba(0,0,0,0.4)",
       position: "absolute",
       zIndex: 99,
       justifyContent: "center",
       width: "100%",
       height: "100%",
   }
});

export default Loader;
