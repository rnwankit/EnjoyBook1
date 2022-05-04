import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

export const isLoading = () => {
    return async (dispatch) => {
        try {
            {dispatch({type: "Loading"})}
        } catch (e) {
            {dispatch({type: "Error"})}
        }
    }
}

export const createNewUser = (payload) => {
    return async (dispatch) => {
        try {
            {dispatch({type: "Loading"})}
            auth().signInWithPhoneNumber(JSON.stringify(payload.phoneNumber))
             .then(confirmResult =>  {dispatch({type: "OTP", payload: confirmResult})})
             .catch(error => {dispatch({type: "Error", payload: error})});
        } catch (e) {
            alert("Error: ",e);
        }
    }
}

export const signOut = (uid, fcmToken) => {
    return async (dispatch) => {
        try {
            await firestore().collection('devices')
             .doc(uid)
             .update({
               "active": false
             })

            auth().signOut();

            {dispatch({type: "signOut"})}

            AsyncStorage.clear()
        } catch (e) {
            alert("Error: ",e);
        }
    }
}

export const otpSuccess = (confirmResult, codeInput) =>  {
    console.log("otpSuccessotpSuccess")
    return async (dispatch) => {
        try {
            await confirmResult.confirm(codeInput)
             .then((user) => {
                 if (user) {
                     AsyncStorage.setItem('userToken', "true");
                     AsyncStorage.setItem('uid', user.uid);
                     dispatch({type: "Success", payload: {user: user, uid: user.uid}})
                 }
             })
             .catch(error => dispatch({type: "Error", payload: error}));
        } catch (e) {
            dispatch({type: "Error", payload: e})
        }
    }
}

export const signupSuccess = (user) =>  {
    return async (dispatch) => {
        try {
            AsyncStorage.setItem('userToken', "true");
            AsyncStorage.setItem('uid', user.uid);
            dispatch({type: "Success", payload: {user: user, uid: user.uid}})
        } catch (e) {
            dispatch({type: "Error", payload: e})}
    }
}

export const changeNumber = () => {
    return async (dispatch) => {
        try {
            dispatch({type: "ChangeNumber"})
        } catch (e) {

        }
    }
}

export const updateDevice = (uid, deviceID, fcmToken, active, createdAt) => {
    console.log("updateDeviceupdateDevice", fcmToken)

    return async (dispatch) => {
        try {
            await firestore().collection('devices')
             .doc(uid)
             .set({
                 "uid": uid,
                 "deviceID": firebase.firestore.FieldValue.arrayUnion(deviceID),
                 "fcmToken": firebase.firestore.FieldValue.arrayUnion(fcmToken),
                 "active": active,
                 "createdAt": createdAt
             });
            dispatch({type: "ChangeNumber"})
        } catch (e) {

        }
    }
}
