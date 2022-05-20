import React from 'react'
import { View, StatusBar, ActivityIndicator, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

export default class AuthLoading extends React.Component {

    constructor() {
        super();
        this._bootstrap();
    }

    _bootstrap = async () => {

        const userToken = await AsyncStorage.getItem('userToken');
        console.log("userToken from authloading", userToken)
        this.props.navigation.navigate(userToken ? 'Home' : 'Signup');
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
