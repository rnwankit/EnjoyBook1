import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    ActivityIndicator
} from 'react-native';

import Screens from './navigation';
import {connect} from 'react-redux';
import {compose} from 'redux';

class Main extends Component {
    constructor() {
        super();
     //   this._bootstrap();
    }

    _bootstrap = async () => {

        console.log("From Main", createUser.isUserId)
        this.props.navigation.navigate(createUser.isUserId ? 'App' : 'Auth');
    }


    render() {
        const {createUser} = this.props;
        console.log("From Main", createUser.isUserId)
       // const {navigate} = this.props.navigation;

        return(
/*         <View style={styles.container}>
             <ActivityIndicator />
             <StatusBar barStyle="default" />
         </View>*/
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="#1c313a"
                    barStyle="light-content"
                />
                <Screens
                    screenProps={{
                        isUserId: createUser.isUserId
                    }}
                    />
                {/*{this.props.navigation.navigate(createUser.isUserId ? 'App' : 'Auth')}*/}
                {/*{createUser.isLoggedIn && this.props.navigation.navigate("Login")}
                {!createUser.isLoggedIn && this.props.navigation.navigate("Signup")}*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1
    }
});

const mapStateToProps = (state) => ({
    createUser: state.createUser
})

export default compose(
    connect(mapStateToProps, null),
)(Main);
