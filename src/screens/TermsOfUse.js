import React, {Component} from 'react';
import { Block, Text } from '../components/index';
import {HeaderBackButton} from 'react-navigation-stack';
import {colors, fonts} from '../constants/theme';

class TermsOfUse extends Component {
 static navigationOptions= ({navigation}) => ({
  title: navigation.state.params.headerTitle,
  headerLeft: (<HeaderBackButton onPress={() => {
   navigation.navigate(navigation.state.params.backScreen.toString())
  }}/>),
  headerTitleStyle: {
   color: colors.primary,
   font: fonts.header,
   marginLeft: -20
  }
 })
 render() {
  return (
   <Block flex={false} center>
    <Text>
     Terms and Conditions agreements act as a legal contract between you (the company)
     who has the website or mobile app and the user who access your website and mobile app.Having a Terms and Conditions agreement is completely optional. No laws require you to have one. Not even the super-strict and wide-reaching General Data Protection Regulation (GDPR). It's up to you to set the rules and guidelines that the user must agree to. If your website or mobile app allows users to create content and make that content public to other users, a Content section will inform users that they own the rights to the content they have created. You can think of your Terms and Conditions agreement as the legal agreement where you maintain your rights to exclude users from your app in the event that they abuse your app, where you maintain your legal rights against potential app abusers, and so on. Terms and Conditions are also known as Terms of Service or Terms of Use.
    </Text>
   </Block>
  );
 }
}

export default TermsOfUse;
