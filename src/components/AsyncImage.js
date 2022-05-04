import React from 'react';
import {View, ActivityIndicator, Image, TouchableOpacity, StyleSheet} from 'react-native';
import firebase from '@react-native-firebase/app';

export default class AsyncImage extends React.Component {

 constructor(props) {
  super(props);
  this.state =
   {
    loading: true,
    mounted: true,
    image: "/images/logoblue.jpg",
    url: "",
   }
 }

 componentDidMount() {
  this.setState({ isMounted: true })
  this.getAndLoadHttpUrl()

 }

 async getAndLoadHttpUrl() {
  let fileName = '';
  console.log("ooooo", this.props.image)
  if (this.props.image.cover) {

   fileName = `Cover${this.props.image.url.substr(94, 45)}`
   this.setState({url: fileName})
   console.log("File name Cover", fileName)
  } else {
   fileName = this.props.image.url.substr(94, 40)
   console.log("File name", fileName)
  }

  if (this.state.mounted == true) {
   const ref = firebase.storage().ref(`Pictures/images/${fileName}`);

   ref.getDownloadURL().then(data => {
    console.log("1234", data)
    this.setState({ url: data })
    this.setState({ loading: false })
   }).catch(error => {
    console.log("etet", error)
    this.setState({ url: "/images/logoblue.jpg" })
    this.setState({ loading: false })
   })
  }
 }

 componentWillUnmount() {
  this.setState({ isMounted: false })
 }


 componentWillReceiveProps(props) {
  /*this.props = props
  if (this.props.refresh == true) {

  }*/
 }


 render() {
  console.log("klklklk", this.props)
  if (this.state.mounted == true) {
   if (this.state.loading == true) {
    return (
     <View key={this.props.image} style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }} >
      <ActivityIndicator />
     </View>
    )
   }
   else {
    return (
     /*<TouchableOpacity onPress={() => this.props.navigation.navigate("ProfilePhoto", {
      img: data.url.split(","),
      backScreen: "Book",
      headerTitle: "Book Photo"
     })} style={styles.container}>*/
      <Image style={this.props.style} source={{uri: this.state.url}} style={{width: '100%', height: '100%', alignSelf: 'center', flexDirection: 'row',}}/>
    /* </TouchableOpacity>*/
      )
   }
  }
  else {
   return null
  }
 }

}

const styles = StyleSheet.create({
 container: {
  width: 186,
  height: 286,
  justifyContent: 'center'
  //flex: 1,
 },
 slideContainer: {
  //flex: 1,
  height: '95%',
  alignItems: 'center',
  justifyContent: 'center',
 },
})
