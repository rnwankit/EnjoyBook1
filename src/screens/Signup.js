import React, {Component, useState} from 'react';
import {
 View,
 TextInput,
 KeyboardAvoidingView,
 StyleSheet,
 ScrollView,
} from 'react-native';
import styles from '../styles';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {createNewUser, signupSuccess, changeNumber, updateDevice} from '../actions/auth.actions';
import firestore from '@react-native-firebase/firestore';
import ValidationComponent from 'react-native-form-validator';
import CountryPicker from 'react-native-country-picker-modal';
import {Logo} from '../components/Logo';
import {colors} from '../constants/theme';
import {Block, Text} from '../components';
import {theme} from '../constants';
import { Button } from '../components/Button';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';

class Signup extends ValidationComponent {

 constructor(props) {
  super(props);
  this.unsubscribe = null;
  this.state = {
   name: '',
   phone: '',
   location: 'surat',
   user: null,
   message: '',
   codeInput: '',
   cca2 : 'IN',
   callingCode: '91',
   country: null,
   callingCodeAndPhone: '',
   disLocation: '',
   lat: '21.1702',
   lng: '72.8311',
   loading: 0,
   errorPhone: '',
   isLoading: false,
   signup: false,
   otp: ''
  };

  this.messages = {
   en: {
    required: "Please enter {0}.",
    numbers: "Please enter a valid {0} number.",
    minlength: "Please enter a valid {0}.",
    maxlength: "Please enter a valid {0}"
   },
   fr: {required: "erreur sur les nombres !"}
  };
 }

 componentWillUnmount() {
  if (this.unsubscribe) this.unsubscribe();
 }

 updateDevice = async (uid) => {
  const { createUser } = this.props

  let deviceID = DeviceInfo.getDeviceId();
  let fcmToken = await messaging().getToken()
  let active = true
  let createdAt = new Date()

  console.log("updateDeviceser.user", uid, deviceID, fcmToken, active, createdAt)
  this.props.dispatch(updateDevice(uid, deviceID, fcmToken, active, createdAt))
 }

 createNewUser = async () => {
  const values = {
   name: this.state.name,
   phoneNumber: this.state.callingCodeAndPhone,
   location: this.state.location,
   lat: this.state.lat,
   lng: this.state.lng,
   signUpSince: new Date().toDateString().substr(4,3) + " " + new Date().toDateString().substr(11,4),
   imageUrl: '',
   last_modified: '',
   modified_by: ''
  }

  console.log("zzzzzz",values);
  await this.props.dispatch(createNewUser(values));
 }

 onSubmit = () => {
  this.validate({
   name: {required: true},
   phone: {required: true, numbers: true, minlength:10},
   location: {required: true},
  });
  if (this.isFormValid()) {
   this.userExist()
   this.setIsLoading(true)
  }
 }

 userExist = () => {
  let flag = false;
  firestore().collection('users').onSnapshot(querySnapshot => {
   for (let i of querySnapshot.docs) {
    const doc = querySnapshot.docs[i];
    if (this.state.callingCodeAndPhone.toString() == i.data().phoneNumber.toString()) {
     flag = true;
     break;
    }
   }

   if (!flag) {
    this.createNewUser()
    this.setState({signup: true})
   } else {
    this.setIsLoading(false)
    this.setState({errorPhone: "Phone number already registered."})
    //alert("Phone number already registered.");
    this.setIsLoading(false)
   }
  });
 }

 setIsLoading = (isLoading) => {
  this.setState({
   isLoading
  });
 };

 renderPhoneNumberInput() {
  return (
   <View style={{ paddingHorizontal: 20, flex:1, justifycontent:'center' }}>
    <Logo style={{marginTop: 16, marginBottom: 16, alignSelf: 'center'}} />
    <Text color={colors.gray2} h3 style={{alignSelf: 'flex-start', marginBottom: -16}}>Name</Text>
    <TextInput
     style={{
      width: theme.screenWidth - 43,marginTop: 15, borderRadius: 0, paddingBottom: 4,
      borderWidth: 0,
      borderBottomColor: colors.gray2,
      borderBottomWidth: StyleSheet.hairlineWidth,
     }}
     defaultValue={this.state.name}
     value={this.state.name ? this.state.name : ''}
     placeholder={"Please enter your name"}
     onChangeText={(name) => this.setState({name})}
    />
    {this.isFieldInError('name') && this.getErrorsInField('name').map(errorMessage => <Text style={{color: 'red'}}>{errorMessage}</Text>) }
    <Text color={colors.gray2} h3 style={{alignSelf: 'flex-start', marginTop: 24, marginBottom: -5}}>Location</Text>
    <GooglePlacesAutocomplete
     value={this.state.location}
     getDefaultValue={() => this.state.location}
     currentLocation={true}
     placeholder='Search location'
     minLength={2} // minimum length of text to search
     autoFocus={false}
     returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
     keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
     listViewDisplayed='true'    // true/false/undefined
     fetchDetails={true}
     onPress={(data, details = null) => {
      if (data && details) {
       this.setState({
        location: data.description ? data.description : details.name + ", " + details.formatted_address,
        lat: details.geometry.location.lat ? details.geometry.location.lat : data.geometry.location.lat,
        lng: details.geometry.location.lng ? details.geometry.location.lng : data.geometry.location.lng
       })
      }
     }}
     nearbyPlacesAPI='GooglePlacesSearch'
     GooglePlacesSearchQuery={{
      rankby: 'distance',
     }}
     query={{
      key: 'AIzaSyCK9195rpO4FJm0UvXImv28Dek6iEBHI4k',
     }}
     styles={{
      textInputContainer: {
       backgroundColor: 'rgba(0,0,0,0)',
       borderTopWidth: 0,
       borderBottomWidth: 0,
      },
      textInput: {
       marginLeft: -5,
       marginRight: 0,
       //paddingBottom: 12,
       height: 38,
       color: '#000',
       fontSize: 14,
      },
      description: {
       color: "#000"
      },
      predefinedPlacesDescription: {
       color: '#1faadb',
      },
     }}
     textInputProps={{ onBlur: () => {} }}
     GooglePlacesDetailsQuery={{ fields: ['geometry', 'formatted_address'] }}
     debounce={300} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
    />
    <View
     style={{
      borderWidth: 0,
      borderBottomColor: colors.gray2,
      borderBottomWidth: StyleSheet.hairlineWidth,
     }}
    />
    {this.isFieldInError('location') && this.getErrorsInField('location').map(errorMessage => <Text style={{color: 'red'}}>{errorMessage}</Text>) }
    <Text color={colors.gray2} h3 style={{alignSelf: 'flex-start', marginBottom: -12, marginTop: 24, }}>Phone Number</Text>
    <Block style={{marginBottom: 40}}  flex={false}>
     <Block flex={false} row>
      <Block flex={false} center row style={styles.countryBox} >
       <CountryPicker
        countryCode={this.state.cca2} //display flag for onclick otherwise display "Select Country"
        withFilter
        withFlag
        withFlagButton
        withCountryNameButton
        withAlphaFilter
        withCallingCode
        withEmoji
        onSelect={(value)=> this.selectCountry(value)}
        translation='eng'
        containerButtonStyle={{marginBottom: 8}}
       />
       <Text style={{paddingVertical: 13, paddingTop: 0}}>
        +{this.state.callingCode}
       </Text>
      </Block>
      <TextInput
       style={{
        width: theme.screenWidth - 110,marginTop: 15, borderRadius: 0, marginBottom: 10,
        borderWidth: 0,
        borderBottomColor: colors.gray2,
        borderBottomWidth: StyleSheet.hairlineWidth,
       }}
       value={this.state.phone ? this.state.phone : ''}
       defaultValue={this.state.phone}
       keyboardType='numeric'
       value={this.state.phone ? this.state.phone : ''}
       placeholder={"Please enter your phone number"}
       onChangeText={(value) => this.phoneWithCountryCode(this.state.callingCode, value)}
      />

     </Block>
     {   this.isFieldInError('phone') &&
     this.getErrorsInField('phone')
      .map(
       errorMessage => <View style={{marginTop: -10, marginBottom: 8}}><Text  style={{color: 'red', marginLeft: 70, }}>{errorMessage}</Text></View>
      )
     }
     <Text style={{color: 'red', marginLeft: 70, }}>{this.state.errorPhone !== '' ? this.state.errorPhone : ''}</Text>
    </Block>
    <Button isLoading={this.state.isLoading} onPress={this.onSubmit} title={"SIGN UP"} small shadow />

    <Block center style={{alignSelf: 'center',marginTop: 40, marginBottom: 16}} flex={false} row>
     <Text h2 gray>Already have an account? </Text>
     <Button textStyle={{fontSize: 16, fontFamily: "Roboto-Medium"}} onlyText title={"Login"} onPress={() => this.props.navigation.navigate('Login')} />
    </Block>
   </View>
  );
 }

 confirmCode = () => {
  const { codeInput } = this.state;
  const { createUser } = this.props;
  this.validate({
   otp: {required: true, numbers: true,},
  });

  if (createUser.confirmResult && codeInput.length) {
   this.setIsLoading(false)
   createUser.confirmResult.confirm(codeInput)
    .then((user) => {
     if (user){
       console.log("In ccccccc", user);
      this.setState({ user: user });
      this.updateDevice(user.user.uid)
      this.addUser(user.user.uid, this.state.callingCodeAndPhone, this.state.location)
      this.setIsLoading(true)
      this.props.dispatch(signupSuccess(user));
     }
    })
    .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
  }
 }

 async addUser(uid) {
  const user = {
   name: this.state.name,
   phoneNumber: this.state.callingCodeAndPhone,
   location: this.state.location,
   lat: this.state.lat,
   lng: this.state.lng,
   signUpSince: new Date().toDateString().substr(4, 3) + " " + new Date().toDateString().substr(11, 4),
   imageUrl: '',
   last_modified: '',
   modified_by: ''
  }

  await firestore().collection('users')
   .doc(uid)
   .set(user);
 }

 selectCountry(country) {
  this.setState({
   cca2: country.cca2,
   callingCode: country.callingCode,
   country,
   callingCodeAndPhone: "+" + country.callingCode + this.state.phone
  });
 }

 renderVerificationCodeInput() {
  const { codeInput } = this.state;

  return (
   <Block container flex={false} style={{marginTop: 24}}>
    <Text h1 bold>Enter verification code below:</Text>
    <TextInput
     autoFocus
     ref="otp"
     onChangeText={(otp) => this.setState({otp})}
     style={{
      width: theme.screenWidth-32, marginTop: 15, borderRadius: 0, marginBottom: 10,
      borderWidth: 0,
      borderBottomColor: colors.gray2,
      borderBottomWidth: StyleSheet.hairlineWidth,
     }}
     onChangeText={value => this.setState({ codeInput: value, otp: value })}
     placeholder={'Please enter code'}
     value={codeInput}
    />
    {   this.isFieldInError('otp') &&
    this.getErrorsInField('otp')
     .map(
      errorMessage => <Text  style={{color: 'red', marginLeft: 0}}>{errorMessage}</Text>
     )
    }

    <Button isLoading={!this.state.isLoading} small onPress={() => this.confirmCode()} title={"Confirm Code"} />
    <Button textStyle={{fontSize: 16, fontFamily: 'Roboto-Bold', marginTop: 20}} onlyText onPress={() => this.changeNumber()} title={"Change Phone Number"} />
   </Block>
  );
 }

 changeNumber = async() => {
  this.setState({errorPhone: ''})
  this.setIsLoading(false)
  await this.props.dispatch(changeNumber())
 }

 phoneWithCountryCode = (code, value) => {
  this.setState({
   phone: value,
   callingCodeAndPhone: "+" + this.state.callingCode + value
  });
 }

 render() {
  const { createUser } = this.props;

  return (
   <KeyboardAvoidingView style={{ flex: 1, height:'100%', flexDirection: 'column',justifyContent: 'center'}} enabled behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={50}>
    <ScrollView>
     {!createUser.changeNumber && !createUser.isLoggedIn && !this.state.signup && this.renderPhoneNumberInput()}

     {this.state.signup && !createUser.changeNumber && createUser.confirmResult && !createUser.isUserId && this.renderVerificationCodeInput()}

     {createUser.changeNumber && this.renderPhoneNumberInput()}

     {createUser.isUserId && this.props.navigation.navigate('Home')}
    </ScrollView>
   </KeyboardAvoidingView>
  );
 }
}

const mapStateToProps = (state) => ({
 createUser: state.createUser,
 userReducer: state.userReducer
})

const mapDispatchToProps = (dispatch) => ({
 dispatch
});

export default compose(
 connect(mapStateToProps, mapDispatchToProps),
)(Signup);

