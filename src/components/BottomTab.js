import React, {Component} from 'react';
import {View, Image} from 'react-native';

class BottomTab extends Component {
 render() {
  return (
   <View>
    <Image
     style={{ width: '100%', height: 50 }}
     source={ require('../assets/extra/bottom_bar.png')}/>
   </View>
  );
 }
}

export default BottomTab;
