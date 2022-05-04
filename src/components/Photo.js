import React from 'react';
import {Button, Image, View} from 'react-native';

const Photo = (props) => {
  return (
   <View>
    <Image style={{width: 150, height: 150, resizeMode: 'contain', flexDirection: 'row',}} source={props.image} />
    <Button title={"X"} onPress={props.delEvent} />
   </View>
  )
}

export default Photo;
