import React, { Component } from 'react';
import { Image, Dimensions, Platform, StatusBar, default as Alert, ActivityIndicator } from "react-native";
import Animated from 'react-native-reanimated';
import { withNavigation } from 'react-navigation';
import { colors, sizes } from '../constants/theme';
import { Badge, Block, Text } from './index';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../constants';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler'
import Loader from './Loader';

class HomeHeader extends Component {
   render() {
      const { navigation, userReducer } = this.props;
      let { params } = this.props.state;
      console.log("in HomeHeader", userReducer.notification)
      return (
         <Animated.View style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            zIndex: 11111111,
            paddingBottom: 0,
            transform: [{
               translateY: params !== undefined &&
                  params.headerY !== undefined
                  ? params.headerY
                  : 88,
            }],
         }}>
            <Block row center flex={false}
               style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  zIndex: 1000,
                  backgroundColor: colors.primary,
                  height: 60,
               }}>
               <Block row left>
                  <TouchableOpacity onPress={() => { this.props.navigation.toggleDrawer() }}>
                     <MaterialIcons color={"#FFF"} size={32} name="menu"
                        style={{ marginLeft: sizes.base - 2, marginRight: 6, zIndex: 1, elevation: 1 }} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { this.props.navigation.navigate("") }}>
                     <Image onPress={() => { navigation.navigate("Home") }} style={{ width: 36, height: 30 }} source={require('../assets/logo.png')} />
                  </TouchableOpacity>
               </Block>
               {/* <Block flex={false} row right style={{ marginRight: 16, }}>
                  <TouchableOpacity onPress={() => { this.props.navigation.navigate("") }}>
                     <MaterialIcons color={"#FFF"} size={24} name="search" style={{ marginRight: 4 }} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { this.props.navigation.navigate("NotificationList") }}>
                     <MaterialIcons color={"#FFF"} size={24} name="notifications-none" style={{ marginRight: 4 }} />
                  </TouchableOpacity>
                  {userReducer.notification !== undefined ?
                     <Badge color={colors.accent} size={16} style={{ position: 'absolute', right: 0, top: -3 }}>
                        <Text bold size={12} style={{ paddingBottom: 1 }} color={"#fff"}>
         userReducer.notification.unreadCounter : null}
                        </Text>
                     </Badge> : null
                  }
               </Block> */}
            </Block>
            {/* <Block row flex={false} style={{marginTop: 48, zIndex: 1000, elevation: 1000, backgroundColor: colors.primaryLight, paddingRight:80,}}>
     <TouchableOpacity onPress={() => {this.props.navigation.navigate("NotificationList")}}>
      <Block row center flex={false} style={{ height: 40, }}>
       <MaterialIcons style={{marginLeft: sizes.base}} color={"#FFF"} name="location-on" size={24}/>
       {!userReducer.user ?
        <ActivityIndicator animating={true} /> :
        <Text h3 color={"#FFF"} style={{marginHorizontal: sizes.base/2}} >{userReducer.user.location.substring(0,79)}
         {userReducer.user.location.length > 79 ? <Text color={"#FFF"} bold h2> ...</Text> : <Text></Text>}</Text>}
      </Block>
     </TouchableOpacity>
    </Block> */}
         </Animated.View>
      );
   }
}

const mapStateToProps = (state) => ({
   userReducer: state.userReducer
})

const mapDispatchToProps = (dispatch) => ({
   dispatch
});

export default compose(
   connect(mapStateToProps, mapDispatchToProps),
)(withNavigation(HomeHeader));
