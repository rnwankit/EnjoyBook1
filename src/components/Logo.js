import React from 'react';
import { Image } from 'react-native';

const Logo = (props) => {
 const { style } = props;
 return (
  <Image
    source={require('../assets/logo/logo_green.png')}
    style={[style&&style || {height:100,width:100}]}
    resizeMode={'contain'}

  />
 );
}

export { Logo };
