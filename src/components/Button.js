import React from 'react';
import {StyleSheet, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import { theme } from '../constants/index';
import {colors} from '../constants/theme';

const width = theme.screenWidth;
const height = 48;


const Button = (props) => {
 const { container, btnText, } = styles;
 const { title, onPress, extraStyle, textStyle, isLoading, small, full, half, shadow, white, onlyText, disabled } = props;
 return (
  <TouchableOpacity style={[onlyText&&styles.onlyText || container,
   full&&styles.full,
   half&&styles.half,
   small&&styles.small,
   white&&styles.white,
   extraStyle&&extraStyle,
   shadow&&styles.shadow]}
                    onPress={onPress}
                     disabled={disabled}>
   {
    !isLoading &&
    <Text style={[white&&styles.white || onlyText&&styles.onlyText || btnText, textStyle && textStyle]}>
     {title}
    </Text>
    ||
    <ActivityIndicator
     animating={true}
     size='small'
     color={theme.colors.black}
    />
   }
  </TouchableOpacity>
 );
};

const styles = StyleSheet.create({
 container: {
  width: '100%',
  height,
  backgroundColor: theme.colors.primary,
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'center'
 },
 shadow: {
  shadowColor: '#30C1DD',
  shadowOffset: {height: 0, width: 0},
  shadowRadius: 3,
  shadowOpacity: 0.3,
  elevation: 3,
  zIndex:999,
 },
 small: {
  width: "100%",
  justifyContent: 'center',
  alignItems: 'center',
 },
 full: {
  position: 'absolute', zIndex: 999, elevation: 3,  left: 0, right: 0, bottom:0,
  justifyContent: 'center', alignItems: 'center',
 },
 half: {
  width: '49%',
 },
 white: {
  backgroundColor: theme.colors.white,
  color: colors.primary
 },
 onlyText: {
  color: colors.primary,
 },
 btnText: {
  fontSize: theme.sizes.h3,
  color: theme.colors.white,
  textTransform: 'uppercase',
  fontWeight: "bold"
 }
});
export { Button };
