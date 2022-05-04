import React, {Component} from 'react';
import {Image, Dimensions,View, Platform, TextInput, StatusBar, default as Alert, ActivityIndicator} from "react-native";
import Animated from 'react-native-reanimated';
import { withNavigation } from 'react-navigation';
import {Badge, Block, Text} from './index';
import {compose} from 'redux';
import {connect} from 'react-redux';
import { HeaderBackButton } from 'react-navigation-stack'
import {searchChat} from '../actions/chat.action';

class ChatHeader extends Component {
    constructor(props) {
        super(props); 
      
        this.state = { 
            loading: false,   
            data: [],
            temp: [],
            error: null,
            search: null
        };
    }

    changeHeader = () => {
        console.tron.log("changeHeader", this.props.navigation)
        // this.props.navigation.setParams({
        //     searchClick: false
        // })
        this.props.navigation.state.routes[this.props.navigation.state.index].params.handleBack("SearchBack")
    }

    updateSearch = search => {
        const { chat } = this.props 
        console.tron.log("updateSearch", this.props.navigation)
        if (this.props.navigation.state.index === 0) {
            this.props.dispatch(searchChat("SearchExchangeChatRoom", search))
        } else if (this.props.navigation.state.index === 1) {
            this.props.dispatch(searchChat("SearchBuyChatRoom", search))
        } else {
            this.props.dispatch(searchChat("SearchSellChatRoom", search))
        }    
    };
     
    render() {
        return (
            <Block row center flex={false}>
                <HeaderBackButton onPress={() => {this.changeHeader()}} />
                <TextInput autoFocus={true} onChangeText={this.updateSearch} placeholder={"Search Chat"}/>
            </Block>
        );
    }
}

const mapStateToProps = (state) => ({
 chat: state.chatReducer
})

const mapDispatchToProps = (dispatch) => ({
 dispatch
});

export default compose(
 connect(mapStateToProps, mapDispatchToProps),
)(withNavigation(ChatHeader));

