import React from 'react';
import { Image } from 'react-native';

const Logo = (props) => {
 const { style } = props;
 return (
  <Image
    source={require('../assets/logo/logo.png')}
    style={{marginTop: 16, marginBottom: 16, alignSelf: 'center', height:200,width:200}}
    resizeMode={'contain'}

  />
 );
}

export { Logo };
