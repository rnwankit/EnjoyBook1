import React, { Component } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import { Block, Text } from '../components/index';
import { theme } from '../constants';
import { colors, sizes } from '../constants/theme';
import { compose } from 'redux';
import { connect } from 'react-redux';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { signOut } from '../actions/auth.actions';
import Loader from './Loader';

class Drawer extends Component {
  static navigationOptions = {
    title: "Home1"
  }

  constructor() {
    super();
    this.state = {
      name: ''
    }
  }

  navigateToScreen = (route) => {
    this.props.navigation.navigate(route);
    this.props.navigation.closeDrawer();
  };

  async signOut() {
    const uid = await AsyncStorage.getItem('uid');
    const fcmToken = await AsyncStorage.getItem('fcmToken');
    this.props.dispatch(signOut(uid, fcmToken))
    this.props.navigation.navigate("Signup")
  }

  renderDrawer() {
    const { createUser, userReducer } = this.props;
    //console.log("createUser in drawer render", createUser);
    console.log("userReducer in drawer render", this.props.activeItemKey);

    return (
      <SafeAreaView>
        <ScrollView>
          <TouchableOpacity activeOpacity={0.7} onPress={() => { this.navigateToScreen("Profile") }}>
            <Block onPress={() => { this.props.navigation.navigate("MyBooks") }} row center
              style={{
                height: 96,
                backgroundColor: theme.colors.primary,
                borderBottomWidth: 1,
                borderBottomColor: "#FFF",
              }}>
              <Block flex={false}>
                {userReducer.user.imageUrl !== '' ?
                  <Image
                    style={{ width: 48, height: 48, borderRadius: 48 / 2, marginLeft: 18, marginRight: theme.sizes.base }}
                    source={{ uri: userReducer.user.imageUrl }} />
                  :
                  <MaterialIcons
                    style={{ marginLeft: theme.sizes.base, marginRight: 16, borderRadius: 40 / 2, }}
                    color={theme.colors.gray} name="account-circle" size={48} />
                }
              </Block>
              <Block>
                {!userReducer.user ? <Loader /> : <Text style={{ fontSize: 18 }}>Welcome, {userReducer.user.name.substring(0, 6)}{userReducer.user.name.length > 6 ? " ..." : ''}</Text>}
              </Block>
              <Block flex={false}>
                <MaterialIcons style={{ paddingRight: 10, alignSelf: 'flex-end' }} color={"#FFF"} name="keyboard-arrow-right" size={24} />
              </Block>

            </Block>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.navigateToScreen("Home") }}>
            <Block row center flex={false} style={[{ height: 54 }, (this.props.activeItemKey == 'Home') ? styles.activeBackgroundColor : null]}>
              <MaterialIcons style={{ marginLeft: sizes.base }} color={"#000"} name="home" size={24} />
              <Text h3 style={{ marginLeft: sizes.base }} >
                Home
              </Text>
            </Block>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.navigateToScreen("MyWishlist") }}>
            <Block onPress={() => { this.navigateToScreen("MyWishlist") }} row center flex={false} style={[{ height: 54 }, (this.props.activeItemKey == 'MyWishlist') ? styles.activeBackgroundColor : null]}>
              <MaterialIcons style={{ marginLeft: sizes.base }} color={"#000"} name="favorite-border" size={24} />
              <Text h3 style={{ marginLeft: sizes.base }}>
                My Wishlist
              </Text>
            </Block>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.navigateToScreen("MyWishlist") }}>
            <Block onPress={() => { this.navigateToScreen("MyWishlist") }} row center flex={false} style={[{ height: 54 }, (this.props.activeItemKey == 'MyWishlist') ? styles.activeBackgroundColor : null]}>
              <MaterialIcons style={{ marginLeft: sizes.base }} color={"#000"} name="info-outline" size={24} />
              <Text h3 style={{ marginLeft: sizes.base }}>
                How to Use
              </Text>
            </Block>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => { this.navigateToScreen("BookExchangeRequest") }}>
            <Block onPress={() => { this.navigateToScreen("BookExchangeRequest") }} row center flex={false} style={[{ height: 54 }, (this.props.activeItemKey == 'BookExchangeRequest') ? styles.activeBackgroundColor : null]}>
              <MaterialIcons style={{ marginLeft: sizes.base }} color={"#000"} name="compare-arrows" size={24} />
              <Text h3 style={{ marginLeft: sizes.base }}>
                Book Exchange Request
              </Text>
            </Block>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.navigateToScreen("BookBuySellOffer") }}>
            <Block onPress={() => { this.navigateToScreen("BookBuySellOffer") }} row center flex={false} style={[{ height: 54 }, (this.props.activeItemKey == 'BookBuySellOffer') ? styles.activeBackgroundColor : null]}>
              <MaterialIcons style={{ marginLeft: sizes.base }} color={"#000"} name="local-offer" size={24} />
              <Text h3 style={{ marginLeft: sizes.base }}>
                Book Buy/ Sell Offer
              </Text>
            </Block>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => { this.navigateToScreen("Settings") }}>
            <Block onPress={() => { this.navigateToScreen("Settings") }} row center flex={false} style={[{ height: 54 }, (this.props.activeItemKey == 'Settings') ? styles.activeBackgroundColor : null]}>
              <MaterialIcons style={{ marginLeft: sizes.base }} color={"#000"} name="settings" size={24} />
              <Text h3 style={{ marginLeft: sizes.base }}>
                Settings
              </Text>
            </Block>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.navigateToScreen("ContactUs") }}>
            <Block onPress={() => { this.navigateToScreen("ContactUs") }} row center flex={false} style={[{ height: 54 }, (this.props.activeItemKey == 'ContactUs') ? styles.activeBackgroundColor : null]}>
              <MaterialIcons style={{ marginLeft: sizes.base }} color={"#000"} name="call" size={24} />
              <Text h3 style={{ marginLeft: sizes.base }} >
                Contact Us
              </Text>
            </Block>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.signOut() }}>
            <Block row center flex={false} style={[{ height: 54 }, (this.props.activeItemKey == 'Logout') ? styles.activeBackgroundColor : null]}>
              <MaterialIcons style={{ marginLeft: sizes.base }} color={"#000"} name="power-settings-new" size={24} />
              <Text h3 style={{ marginLeft: sizes.base }} >
                Logout
              </Text>
            </Block>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    )
  }

  render() {
    const { createUser, userReducer } = this.props;
    console.log("createUser in drawer", createUser);
    console.log("userReducer in drawer", userReducer);

    return (
      userReducer.user ? this.renderDrawer() : <ActivityIndicator animating={this.state.isLoading} />
    );
  }
}

const styles = StyleSheet.create({
  activeBackgroundColor: {
    backgroundColor: colors.primaryLight,
  }
});

const mapStateToProps = (state) => ({
  createUser: state.createUser,
  userReducer: state.userReducer
})

const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Drawer);

