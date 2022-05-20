import React, {Component} from 'react';
import {Image, ImageBackground, TouchableOpacity} from 'react-native';
import {theme} from '../constants';
import {Block, Text} from './index';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { NavigationActions, StackActions } from 'react-navigation';

class BottomBar extends Component {
 render() {
  const { onPress, chat, mybooks, onNav } = this.props
  console.log("Bottttt", onPress)
  return (
   <Block style={{
    position: 'absolute', zIndex: 999, left: 0, right: 0, bottom: 0, width: '100%', height: 60,
     backgroundColor: theme.colors.primary
   }}>
    
      <Block row
        style={{justifyContent: 'space-around', top: 4}}
      >
        <TouchableOpacity 
          style={{zIndex: 9999, elevation: 4, justifyContent: 'center'}} 
          title={"My Books"} 
          onPress={() => onPress.navigate("MyBooks")}
        >
          <FontAwesome name="diamond" size={24} style={[{ color:  mybooks }, {left: 30}]} />
          <Text caption color={"#FFF"} style={[{ color:  mybooks },{marginTop: 4}]}>My Diamond</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{zIndex: 9999, elevation: 4,}} 
          title={"My Books"} 
          onPress={() => onPress.navigate("MyBooks")}
        >
          <AntDesign name="shoppingcart" size={28} style={[{ color:  mybooks }, {top: 4, }]} />
          <Text caption color={"#FFF"} style={[{ color:  mybooks },{marginTop: 4}]}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{zIndex: 9999, elevation: 4,}} 
          title={"My Books"} 
          onPress={() => onPress.navigate("MyBooks")}
        >
          <Entypo name="export" size={24} style={[{ color:  mybooks }, {top: 4,}]} />
          <Text caption color={"#FFF"} style={[{ color:  mybooks },{marginTop: 8}]}>Sell</Text>
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
          <AntDesign style={[{ color: chat }, {top: 6, left: 18}]} name="calculator" size={24}/>
          <Text caption color={"#FFF"} style={[{ color:  mybooks },{left: -2, marginTop: 8}]}>Calculator</Text>
        </TouchableOpacity>
      </Block>
    
    {/* <TouchableOpacity
     onPress={() => onPress.navigate("AddProduct")}>
      <Image 
        style={{
          width: 90,
          height: 90, 
          bottom: 8
        }} 
        source={require('../assets/extra/FAB.png')} 
      />
    </TouchableOpacity> */}
   </Block>
  );
 }
}

export default BottomBar;
