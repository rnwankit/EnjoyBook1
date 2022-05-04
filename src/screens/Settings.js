import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {Block, Input} from '../components';
import {
 Menu,
 MenuOptions,
 MenuOption,
 MenuTrigger,
} from 'react-native-popup-menu';
import {colors} from '../constants/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class Settings extends Component {
 componentDidMount() {
  console.log("Chatttt")
  Orientation.addDeviceOrientationListener(this._onOrientationDidChange);
 }
 _onOrientationDidChange = (orientation) => {
  console.log("didchange  setting")
  Orientation.unlockAllOrientations();
 };
 render() {
  const triggerStyles = {
   triggerText: {
    color: 'white',
   },
   triggerOuterWrapper: {
    backgroundColor: 'orange',
    padding: 15,
    flex: 1,
   },
   triggerWrapper: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
   },
   triggerTouchable: {
    underlayColor: 'darkblue',
    activeOpacity: 70,
    style : {
     flex: 1,
    },
   },
  };
  return (
   <View>
    <Text style={{color: "#000"}}>kbkbk</Text>
    <Menu>
     <MenuTrigger>
      <MaterialCommunityIcons name={"dots-vertical"} size={24} color={colors.black} />
     </MenuTrigger>
     <MenuOptions>
      <MenuOption onSelect={() => alert(`Delete`)} >
       <Text style={{color: '#000'}}>Edit Image</Text>
      </MenuOption>
      <MenuOption onSelect={() => alert(`Delete`)} >
       <Text style={{color: '#000'}}>Delete Image</Text>
      </MenuOption>
      <MenuOption onSelect={() => alert(`Delete`)} >
       <Text style={{color: '#000'}}>Set as a Cover Photo</Text>
      </MenuOption>
     </MenuOptions>
   </Menu>
   </View>
  );
 }
}

export default Settings;
