import React, { Component } from 'react';
import { Text, Block, Card } from '../components';import {compose} from 'redux';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import {FlatList, Image, TouchableOpacity, ScrollView, Alert} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Button } from 'native-base';

class ChatRoomHeader extends Component {
    // static navigationOptions= ({navigation}) => ({
    // headerLeft: (<HeaderBackButton onPress={() => {
    //     navigation.navigate('Home')
    //     }}/>),
    //     title: navigation.state.routes[0].params !== undefined ? navigation.state.routes[0].params.itemDelete.length : 'Chat',
    //     headerRight: (
        
    // )
    // })
    
    render() {
        const { navigation } = this.props

        console.tron.log("CHATROOMHEADER", navigation)
        return (
            <Block>
                <Button
                        style={{margin: 16, height:25, width: 25, position: 'absolute'}}
                        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                        onPress={() => console.log("HHHHHHHHHHHH")}
                        ><Text>DDD</Text></Button>
            </Block>
    );
  }
}

const mapStateToProps = (state) => ({
    chatReducer: state.chatReducer
})

const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ChatRoomHeader);
