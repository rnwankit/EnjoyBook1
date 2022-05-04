import React, {Component} from "react";
import PushNotification from "react-native-push-notification";
import * as StackActions from 'react-navigation';
import * as NavigationActions from 'react-navigation';

export default class PushController extends Component{

 componentDidMount(){

  PushNotification.configure({

   onRegister: function(token) {
    console.log("TOKEN:", token);
   },


   onNotification: function(notification) {
    console.log("NOTIFICATION1:", notification.data.type);


   },
   onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION2:", notification.data.type);

   },

   onRegistrationError: function(err) {
    console.error("FFFFFFFFF", err.message, err);
   },


   senderID: "231740187987",

   permissions: {
    alert: true,
    badge: true,
    sound: true
   },
   popInitialNotification: true,
   requestPermissions: true
  });
 }

 render(){
  return null;
 }
}
