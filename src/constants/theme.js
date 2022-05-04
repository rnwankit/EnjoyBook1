import {theme} from './index';
import { Dimensions } from 'react-native';

const colors = {
 accent: "#BA000D",
 primary: "#6B9B36",
 primaryLight: 'rgba(107,155,54, 0.7)',
 tertiary: "#FFE358",
 black: "#000000",
 white: "#FFFFFF",
 gray: "#6B6B6B",
 gray2: "#707070",
 placeholder: 'rgba(107,107,107, 0.5)',
 placeholderLight: '#ccc',
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const sizes = {
 // global sizes
 base: 16,
 //font: 14,
 radius: 4,
 //padding: 25,

 // font sizes
 h1: 26,
 h2: 18,
 h3: 16,
 h4: 14,
 h5: 12,
 h6: 10,
 
 header: 24,
};

const fonts = {
 h1: {
  fontFamily: "Roboto-Regular",
  fontSize: sizes.h1,
 },
 h2: {
  fontFamily: "Roboto-Regular",
  fontSize: sizes.h2
 },
 h3: {
  fontFamily: "Roboto-Regular",
  fontSize: sizes.h3
 },
 h4: {
    fontFamily: "Roboto-Regular",
    fontSize: sizes.h4
 },
 h5: {
    fontFamily: "Roboto-Regular",
    fontSize: sizes.h5
 },
 h6: {
    fontFamily: "Roboto-Regular",
    fontSize: sizes.h6
 },
 
 header: {
  fontFamily: "Roboto-Medium",
  fontSize: sizes.header
 },
};

const style = {
 shadow: {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
 },
}

export { colors, sizes, fonts, screenHeight, screenWidth, style };
