import React, {Component} from 'react';
import {Image, View, StyleSheet, Text} from 'react-native';
import Block from '../components/Block';
import Swiper from 'react-native-web-swiper';
import {HeaderBackButton} from 'react-navigation-stack';
import {colors, fonts} from '../constants/theme';

class ProfilePhoto extends Component {
 static navigationOptions= ({navigation}) => ({
  title: navigation.state.params.headerTitle,
  headerLeft: (<HeaderBackButton onPress={() => {
   navigation.navigate(navigation.state.params.backScreen.toString(), {
    data: navigation.state.params.img
   })
  }}/>),
  headerTitleStyle: {
   color: colors.primary,
   font: fonts.header,
   marginLeft: -20
  }
 })

 constructor(props) {
  super(props);

  this.state = {
   data: this.props.navigation.getParam("img")
  }
 }

 componentDidMount() {

 }

 renderSlider = () => {
  return (
   <Swiper
    from={this.props.navigation.state.params.index}
    key={this.props.navigation.state.params.key}
   >
    {
     this.props.navigation.getParam("img").url.map((image) => (
      <View style={[styles.slideContainer]}>
      {console.log("222", image)}
      <Image
       style={{width: '100%', height: '100%', alignSelf: 'center', flexDirection: 'row',}}
       source={{uri: image.url}} />
     </View>
     ))
    }
   </Swiper>
  )
 }



 render()
{
 console.log("io", this.props.navigation.state.params.key)
 console.log("io1", this.props.navigation.getParam("img"))
 console.log("io2", this.state.data)
 /*this.props.navigation.state.params.img.url.split(",").map((image) => (
  console.log("oho", image)
 ))*/
 return (
  <View style={styles.container}>
   {
    this.props.navigation.getParam("img").url !== undefined ? this.renderSlider()
     :
     <View style={[styles.slideContainer]}>
      {console.log("222", this.props.navigation.getParam("img").uri)}
      <Image
       style={{width: '100%', height: '100%', alignSelf: 'center', flexDirection: 'row',}}
       source={this.props.navigation.getParam("img")}/>
     </View>
   }
  </View>
 );
}
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
 },
 slideContainer: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
 },
});

export default ProfilePhoto;
