import React, {Component} from 'react';
import {Image, ImageBackground, TouchableOpacity} from 'react-native';
import {theme} from '../constants';
import {Block, Text} from './index';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationActions, StackActions } from 'react-navigation';

class BottomBar extends Component {
 render() {
  const { onPress, chat, mybooks, onNav } = this.props
  console.log("Bottttt", onPress)
  return (
   <Block style={{
    position: 'absolute', zIndex: 999, elevation: 3,  left: 0, right: 0, bottom: 0, width: '100%', 
    justifyContent: 'center', alignItems: 'center'
   }}>
    <ImageBackground
     source={require('../assets/extra/bb.png')}
     style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 52,
      border:0, 
      width: '100%',
     }}
    >
      <Block row
        style={{justifyContent: 'space-around'}}
      >
        <TouchableOpacity 
          style={{zIndex: 9999, elevation: 4,}} 
          title={"My Books"} 
          onPress={() => onPress.navigate("MyBooks")}
        >
          <Entypo name="book" size={24} style={[{ color:  mybooks }, {top: 4, }]} />
          <Text caption color={"#FFF"} style={[{ color:  mybooks },{marginTop: 4, left: -16}]}>My Books</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{zIndex: 9999, elevation: 4, }} 
          title={"My Books"} 
          onPress={() => {onNav.navigate('TopTabNavigatorChat')}}
          // onPress={() => {onPress(StackActions.reset(
          //        {
          //           index: 0,
          //           key: 'ChatScreen',
          //           actions: [
          //             NavigationActions.navigate({ routeName: 'TopTabNavigatorChat'})
          //           ]
          //         }));}}
        >
          <Ionicons style={[{ color: chat }, {top: 6,}]} name="md-chatbubbles" size={24}/>
          <Text caption color={"#FFF"} style={[{ color:  mybooks },{left: -2, marginTop: 4}]}>Chat</Text>
        </TouchableOpacity>
      </Block>
    </ImageBackground>
    <TouchableOpacity
     onPress={() => onPress.navigate("AddProduct")}>
      <Image 
        style={{
          width: 90,
          height: 90, 
          bottom: 8
        }} 
        source={require('../assets/extra/FAB.png')} 
      />
    </TouchableOpacity>
   </Block>
  );
 }
}

export default BottomBar;
