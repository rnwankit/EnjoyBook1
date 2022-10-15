import React, {Component} from 'react';
import {
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';

import {compose} from 'redux';
import {connect} from 'react-redux';
import firebase from '@react-native-firebase/app';
import {createNewUser, otpSuccess, changeNumber, updateDevice} from '../actions/auth.actions';
import CountryPicker from 'react-native-country-picker-modal';
import ValidationComponent from 'react-native-form-validator';
import firestore from '@react-native-firebase/firestore';
import { theme } from '../constants';

import {Block, Text} from '../components';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import {colors} from '../constants/theme';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';

import DeviceInfo from 'react-native-device-info'

class Login extends ValidationComponent {
    constructor(props) {
        super(props);

        this.unsubscribe = null;
        this.state = {
            phone: '',
            otp: '',
            user: null,
            message: '',
            codeInput: '',
            cca2 : 'IN',
            callingCode: '91',
            country: null,
            callingCodeAndPhone: '',
            changeNumber: false,
            isLoading: false,
            login: false,
            errorPhone: ''
        }
        this.messages = {
            en: {
                required: "Please enter {0}.",
                numbers: "Please enter a valid {0} number.",
                minlength: "Please enter a valid {0}.",
                maxlength: "Please enter a valid {0}"
            },
            fr: {required: "erreur sur les nombres !"}
        };
    };

    async componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({user: user.toJSON()});
            } else {
                // User has been signed out, reset the state
                this.setState({
                    user: null,
                    message: '',
                    codeInput: '',
                    confirmResult: null,
                });
            }
        });
    }

    updateDevice = async () => {
        const { createUser } = this.props

        let deviceID = DeviceInfo.getDeviceId();
        let fcmToken = await messaging().getToken()
        let active = true
        let createdAt = new Date()

        console.log("updateDevice", createUser.user.uid, deviceID, fcmToken, active, createdAt)
        this.props.dispatch(updateDevice(createUser.user.uid, deviceID, fcmToken, active, createdAt))
    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
    }

    onSubmit = () => {
        this.validate({
            phone: {required: true, numbers: true, minlength:10},
        });
        if (this.state.phone != '' && this.state.phone.length >= 10) {
            this.setIsLoading(true)
            this.userExist();
        }
    }

    renderPhoneNumberInput = () => {
        return (
         <Block center container flex={false} style={{marginTop: 14, backgroundColor: '#000000'}}>
                <Logo style={{marginTop: 54, marginBottom: 54}} />
                <Text color={colors.gray2} h3 style={{alignSelf: 'flex-start', marginBottom: -16}}>Phone Number</Text>
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
                      errorMessage => <Text  style={{color: 'red', marginLeft: 70}}>{errorMessage}</Text>
                     )
                    }
                    <Text style={{color: 'red', marginLeft: 70, }}>{this.state.errorPhone !== '' ? this.state.errorPhone : ''}</Text>
                </Block>

                <Button isLoading={this.state.isLoading} onPress={this.onSubmit} title={"LOGIN"} small shadow />

                <Block style={{marginTop: 80}} flex={false} row>
                    <Text h2 gray>Don't have an account yet? </Text>
                    <Button textStyle={{fontSize: 16, fontFamily: "Roboto-Medium"}} onlyText title={"Sign Up"} onPress={() => this.props.navigation.navigate('Signup')} />
                </Block>
            </Block>
        );
    }

    setIsLoading = (isLoading) => {
        this.setState({
            isLoading
        });
    };

    renderVerificationCodeInput() {
        const { codeInput } = this.state;

        return (
         <Block container flex={false} style={{marginTop: 24}}>
             <Text h1 bold>Enter verification code below:</Text>
             <TextInput
              autoFocus
              ref="otp"
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

            if (flag) {
                this.setState({login: true})
                this.props.dispatch(createNewUser({phoneNumber: this.state.callingCodeAndPhone}));
            } else {
                this.setState({errorPhone: "Phone number already registered."})
                alert("User Not Exist.");
                this.setIsLoading(false)
            }
        });
    }

    changeNumber = async() => {
        this.setIsLoading(false)
        this.setState({errorPhone: ''})
        await this.props.dispatch(changeNumber())
    }

    confirmCode = async () => {
        const {codeInput} = this.state;
        const {createUser} = this.props;

        this.validate({
            otp: {required: true, numbers: true,},
        });

        if (createUser.confirmResult && codeInput.length) {
            this.setIsLoading(false)
            await this.props.dispatch(otpSuccess(createUser.confirmResult, codeInput));
            await this.updateDevice()
        }
    }

    selectCountry(country) {
        this.setState({
            cca2: country.cca2,
            callingCode: country.callingCode,
            country,
            callingCodeAndPhone: "+" + country.callingCode + this.state.phone
        });
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
                {!createUser.changeNumber && !createUser.isLoggedIn && !this.state.login && this.renderPhoneNumberInput()}

                {this.state.login && !createUser.changeNumber && createUser.confirmResult && !createUser.isUserId && this.renderVerificationCodeInput()}

                {createUser.changeNumber && this.renderPhoneNumberInput()}

                {createUser.isUserId && this.props.navigation.navigate('Home')}
             </ScrollView>
         </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = (state) => ({
    createUser: state.createUser
})

const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(Login);

export const styles = StyleSheet.create({
    countryBox: {
        marginTop: 28,
        marginRight: 8,
        flexDirection: 'row',
        borderRadius: 0,
        borderWidth: 0,
        borderBottomColor: colors.gray2,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 10,
    },
    signup: {
        flex: 1,
        justifyContent: 'center',
    },
})
