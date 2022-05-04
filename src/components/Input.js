import React, {Component} from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import {colors, sizes} from '../constants/theme';
import {Block, Text} from './index';

const Input = (props) => {
  const { secureTextEntry, placeholder, onChangeText, value, keyboardType, extraInputStyle, InputTitle, editable, defaultValue} = props;
  return (
   <Block style={{marginTop: 24}} flex={false}>
     <Text h3 gray>{InputTitle}</Text>
     <TextInput
      style={[styles.inputText, extraInputStyle&&extraInputStyle]}
      secureTextEntry={secureTextEntry}
      placeholder={placeholder}
      autoCorrect={false}
      onChangeText={onChangeText}
      value={value}
      editable={editable}
      placeholderTextColor={colors.placeholder}
      underlineColorAndroid='transparent'
      keyboardType={keyboardType || 'default'}
      defaultValue={defaultValue}
     />
    <View
     style={{
      borderBottomColor: colors.gray2,
      borderBottomWidth: 0.5,
     }}
    />
   </Block>
  );
}

const styles = StyleSheet.create({
  inputText: {
   fontSize: 16,
   marginTop: 0,
   paddingBottom: 4,
   paddingTop: 8,
   paddingHorizontal: 0,
   fontFamily: 'Roboto-Regular',

  }
})

export { Input }
