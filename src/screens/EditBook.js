import React, {useState} from 'react';
import {
 StyleSheet,
 View,
 ScrollView,
 ImageBackground,
 Picker,
 TouchableOpacity,
 FlatList,
 Switch
} from 'react-native';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import uuid from 'react-native-uuid';
import firebase from '@react-native-firebase/app';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Loader from '../components/Loader';
import { editBook, deleteImage } from '../actions/mybooks.action';
import Dialog from 'react-native-dialog';
import ValidationComponent from 'react-native-form-validator';
import ImageResizer from 'react-native-image-resizer';
import {Block, Text} from '../components';
import {Input} from '../components/Input';
import {colors} from '../constants/theme';
import { onValueChange1, onValueChange2} from '../actions/category.action';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Checkbox  from '../components/Checkbox';
import {
 Menu,
 MenuOptions,
 MenuOption,
 MenuTrigger,
} from 'react-native-popup-menu';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import { Button } from '../components/Button';
import {theme} from '../constants';
import {BottomSheet} from 'react-native-btr';
import AsyncStorage from '@react-native-community/async-storage';

class SelectedCheckboxes {
 constructor() {
  this.selectedCheckboxes = [];
 }

 addItem(option) {
  this.selectedCheckboxes.push(option);
 }

 fetchArray() {
  return this.selectedCheckboxes;
 }
}

class EditBook extends ValidationComponent {
 constructor(props) {
  super(props);
  const { data } = this.props.navigation.state.params
  this.state = {
   filePath: {},
   loading: 0,
   progress: '',
   title: data.title,
   description: data.description,
   author: data.author,
   price: data.price,
   photos: data.url,
   url: '',
   addProduct: '',
   ImageSource: '',
   ImageSourceviewarray: [],
   image: null,
   images: null,
   errorPhoto: '',
   disableBtn: false,
   imageSettingUri: '',
   //cover: data.url.map((d) => {if (d.cover) { return d.url }}).toString(),
   cover: '',
   location: props.userReducer.user.location,
   switchValue: data.phone_visible,
   checkedEx: false,
   checked: false,
   isLoading: false,
   pickedElements: '',
   errorCheckBox: '',
   errorLocation: '',
   visible: false,
   errorPhotoEmpty: '',
   uid: '',
   lat: props.userReducer.user.lat,
   lng: props.userReducer.user.lng,
   deleteImage: []
  };

  console.log("construcccccc", this.state.cover)
  this.messages = {
   en: {
    required: "Please enter {0}.",
    numbers: "Please enter a valid {0} number.",
    minlength: "A minimum length of 10 characters is required.",
    maxlength: "{0} length must be within 500 characters."
   },
   fr: {required: "erreur sur les nombres !"}
  };

  this.CheckedArrObject = new SelectedCheckboxes();

 }

 async componentDidMount() {
  const {data} = this.props.navigation.state.params
  const uid = await AsyncStorage.getItem('uid');
  let arr = []
  await data.url.map((d) => {
   arr.push({uri: d.url})
  })

  this.setState({uid: uid, ImageSourceViewArray: arr})
  //console.log("jijijijijiji", this.state.ImageSourceViewArray)
 }

 chooseFileFromGallery = () => {
  this.setState({visible: false})
  ImagePicker.openPicker({
   width: 300,
   height: 400,
   multiple: true,
  }).then(response => {
   let tempArray = []

   this.setState({filePath: response})

   response.forEach((item) => {
    let image = {
     uri: item.path,
    }
    if (this.state.ImageSourceViewArray !== undefined) {
     if (this.state.ImageSourceViewArray.length > 4) {
      this.setState({disableBtn: true, errorPhoto: "Upload maximum five photo."})
     } else {
      this.state.ImageSourceViewArray.push(image)
      this.setState({errorPhoto: "", errorPhotoEmpty: ""})
     }
    } else {
     if (tempArray.length > 4) {
      this.setState({disableBtn: true, errorPhoto: "Upload maximum five photo."})
     } else {
      tempArray.push(image)
      this.setState({photos: "valid", errorPhotoEmpty: "", ImageSourceViewArray: tempArray})
     }
    }
   })

   if (this.state.ImageSourceViewArray === undefined) {
    this.setState({ImageSourceViewArray: tempArray})
   } else if (this.state.ImageSourceViewArray.length > 5) {
    this.setState({disableBtn: true, errorPhoto: "Upload maximum five photo."})
   }
  })
 }

 chooseFileFromCamera = () => {
  let tempArray = [];
  this.setState({visible: false});
  ImagePicker.openCamera({
   width: 300,
   height: 400,
   cropping: true,
   includeBase64: true
  }).then(image => {
   let img = {
    uri: image.path,
   }
   if (this.state.ImageSourceViewArray !== undefined) {
    if (this.state.ImageSourceViewArray.length > 4) {
     this.setState({errorPhoto: "Upload maximum five photo."})
    } else {
     this.state.ImageSourceViewArray.push(img)
     this.setState({photos: "valid", errorPhoto: ""})
    }
   } else {
    tempArray.push(img);
    this.setState({photos: "valid", ImageSourceViewArray: tempArray, errorPhoto: ""})
   }
  });
 }

 submit1 = async () => {
  const { createCategory, createUser, userReducer } = this.props;
  let urls = [];
  this.validate({
   title: {required: true},
   description: {minlength:10, maxlength:500, required: true},
   author: {required: true},
   price: {required: true, numbers: true,},
   photos: {required: true},
   location: {required: true}
  });

  if (this.CheckedArrObject.fetchArray().length == 0) {
   this.setState({errorCheckBox: "Please select any one option"})
  } else {
   this.setState({errorCheckBox: ""})
  }

  if (this.state.location == '') {
   this.setState({errorLocation: "Please select location"})
  }

  if (this.state.ImageSourceViewArray === undefined) {
   this.setState({errorPhotoEmpty: "Please upload atleast one photo. "})
  }

  if (this.state.ImageSourceViewArray !== undefined) {
   if (this.state.ImageSourceViewArray.length === 0) {
    this.setState({errorPhotoEmpty: "Please upload atleast one photo. "})
   }
  }
  /*console.log("err", this.getErrorMessages())
  console.log("err", this.state.ImageSourceViewArray)
  console.log("From Add Product Submit",
   this.isFormValid(), this.CheckedArrObject.fetchArray().length > 0, this.state.errorLocation === ''
   , this.state.ImageSourceViewArray !== undefined , this.state.errorPhotoEmpty === ''
  )*/
  if (this.isFormValid() && this.CheckedArrObject.fetchArray().length > 0 && this.state.errorLocation === ''
   && this.state.ImageSourceViewArray !== undefined && this.state.errorPhotoEmpty === '') {

   let counter = this.state.ImageSourceViewArray.length;
   let values = '', d = ''

   await this.state.ImageSourceViewArray.map((i, index) => {
    console.log("counter", counter)
    /*console.log("iii4", i.uri)
    console.log("iii43", this.state.cover, index)*/
    if (i.uri.includes("https://")) {
     if (this.state.cover === '') {
      if (index === 0) {

       urls.push({cover: true, url: i.uri});
       counter--
       console.log("counter with empty and 0", counter)
      } else {
       urls.push({cover: false, url: i.uri});
       counter--
       console.log("counter with empty", counter)
      }
     } else if (this.state.cover === i.uri) {
      urls.push({cover: true, url: i.uri});
      counter--
      console.log("counter not empty", counter)
     } else {
      urls.push({cover: false, url: i.uri});
      counter--
      console.log("counter not matched", counter)
     }
     /*if (this.state.cover === '' && index === 0) {
      urls.push({cover: true, url: i.uri});
      counter--
     }
     if (this.state.cover == i.uri) {
      console.log("1", urls)
      urls.push({cover: true, url: i.uri});
      counter--
     }*/
    } else {

     const fileExtension = i.uri.split('.').pop();
     const uid = uuid.v4();
     let fileName = ''

     if (this.state.cover === '' && index === 0 ) {
      fileName = `Cover${uid}.${fileExtension}`;
     } else if (this.state.cover.toString() == i.uri.toString()) {
      fileName = `Cover${uid}.${fileExtension}`;
     } else {
      fileName = `${uid}.${fileExtension}`;
     }

      ImageResizer.createResizedImage(i.uri, 800, 600, 'JPEG', 50)
      .then(response => {
       const storageRef = firebase.storage().ref(`Pictures/images/${fileName}`);

       const uploadTask  = storageRef
        .putFile(response.uri)
        .on(
         firebase.storage.TaskEvent.STATE_CHANGED,
         snapshot => {

          if (((snapshot.bytesTransferred / snapshot.totalBytes) * 100) !== 100) {
           this.setState({loading: 1, progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100});
          } else {
           this.setState({addProduct: 'done'});
          }
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {

          }
         },
         error => {
          unsubscribe();
          console.log("image upload error: " + error.toString());
         },
         async () => {
          storageRef.getDownloadURL().then((url) => {

           if (url.includes("Cover")) {
            urls.push({cover: true, url});
           } else {
            urls.push({cover: false, url});
           }
           console.log("4", url)
           this.setState({url: urls.join(","), addProduct: 'complete'});
           if (counter > 0) {
            counter--;
           }
           if (counter === 0) {

             console.log("F Add P", urls)

             d = urls.sort(function(a, b){return b.cover - a.cover});
             values =  {
              data: {
               category: this.props.navigation.state.params.data.category,
               subcategory: this.props.navigation.state.params.data.subcategory,
               title: this.state.title,
               description: this.state.description,
               author: this.state.author,
               price: this.state.price,
               location: this.state.location,
               lat: this.state.lat,
               lng: this.state.lng,
               phone_visible: this.state.switchValue,
               url: d,
               choice: this.CheckedArrObject.fetchArray().map(res => res.value).join(),
               status: "active",
        //       last_modified: this.props.navigation.state.params.data.last_modified,
          //     expired_at: new Date(this.props.navigation.state.params.data.last_modified.toDate().setDate(this.props.navigation.state.params.data.last_modified.toDate().getDate() + 30)).toDateString(),
               modified_by: this.state.uid,
              },
              Product_id: this.props.navigation.state.params.data.Product_id
             }

             this.setState({loading: 0})

            this.props.dispatch(editBook(values))
            this.props.navigation.navigate("MyBooks")

            console.log("with update", values)
           }
          })
         });
      })
      .catch(err => {
       console.log("EmError", err)
      });

    }

   })

   if (counter === 0) {
    d = urls.sort(function(a, b){return b.cover - a.cover});
    values = {
     data: {
      category: this.props.navigation.state.params.data.category,
      subcategory: this.props.navigation.state.params.data.subcategory,
      title: this.state.title,
      description: this.state.description,
      author: this.state.author,
      price: this.state.price,
      location: this.state.location,
      lat: this.state.lat,
      lng: this.state.lng,
      phone_visible: this.state.switchValue,
      url: d,
      choice: this.CheckedArrObject.fetchArray().map(res => res.value).join(),
      status: "active",
     // last_modified: this.props.navigation.state.params.data.last_modified,
      //expired_at: new Date(this.props.navigation.state.params.data.last_modified.toDate().setDate(this.props.navigation.state.params.data.last_modified.toDate().getDate() + 30)).toDateString(),
      modified_by: this.state.uid,
     },
     Product_id: this.props.navigation.state.params.data.Product_id
    }
    this.props.dispatch(editBook(values))
    this.props.navigation.navigate("MyBooks")
    console.log("Final Updateeee", values)
   }
   console.log("lalalal1", this.state.deleteImage)
   if (this.state.deleteImage.length > 0) {
    console.log("lalalal", this.state.deleteImage)
    await this.props.dispatch(deleteImage(this.state.deleteImage))
   }
  }
 }

 removeImage = async (image) => {
  console.log("removeeee", image)
  let array = [...this.state.ImageSourceViewArray]; // make a separate copy of the array
  let index = array.indexOf(image)

  if (image.uri.includes("https://")) {
    this.state.deleteImage.push(image.uri)
  }

  if (index !== -1) {
   array.splice(index, 1);
   this.setState({ImageSourceViewArray: array, imageSettingUri: '',});
  }

  if (image.uri === this.state.cover) {
   this.setState({
    cover: ''
   })
  }

  if (array.length < 5) {
   this.setState({errorPhoto: ''})
  }

  if (array.length < 1) {
   this.setState({photos: '',})
  }
 }

 editImage = (img) => {
  ImagePicker.openCropper({
   path: img.uri,
   width: 300,
   height: 400
  }).then(image => {
   let array = [...this.state.ImageSourceViewArray]; // make a separate copy of the array
   let index = array.indexOf(img)

   console.log("e", index)
   console.log("e", array)

   if (index !== -1) {
    array[index] = {uri : image.path}
   }

   this.setState({ImageSourceViewArray: array,})
   this.renderWithImage()
  });
 }

 setCoverPhoto = async (img) => {
  console.log("inniin", img.uri)

  await this.setState({cover: img.uri})
  console.log("inniin1", this.state.cover)
 }

 onValueChange1(value: string) {
  const values = {
   category: value,
   dataSubCategory: ''
  }
  this.props.dispatch(onValueChange1(values))
 }

 onValueChange2(value: string) {
  const values = {
   subcategory: value
  }
  this.props.dispatch(onValueChange2(values))
 }

 renderNoImage = () => {
  return (
   <Block center style={{flex: 1, marginVertical: 24, alignContent: 'space-between'}}>
    {this.state.ImageSourceViewArray === undefined ?
     <Block center>
      <TouchableOpacity style={{borderWidth: 0.5, marginVertical: 24, alignItems: 'center', padding: 10, borderColor: colors.primary }}
                        onPress={this._toggleBottomNavigationView} >
       <MaterialIcons name={"add-a-photo"} color={colors.primary} size={24} />
       <Text h3 color={colors.gray}>Add Photos</Text>
      </TouchableOpacity>
      <Text bold h3>You can add upto 5 photos.</Text>
      <Text h3>First Photo will be cover photo.</Text>
      {this.bottomSheet()}
     </Block>
     : <Text></Text> }
   </Block>
  )
 }

 _toggleBottomNavigationView = () => {
  this.setState({ visible: !this.state.visible });
 };

 bottomSheet = () => {
  return (
   <BottomSheet
    visible={this.state.visible}
    onBackButtonPress={this._toggleBottomNavigationView}
    onBackdropPress={this._toggleBottomNavigationView}
   >
    <Block flex={false} style={{height: 160, backgroundColor: colors.white, padding: 16}}>
     <Text h2 bold color={colors.primary} style={{marginBottom: 16, fontSize: 20}}>
      Book Photo
     </Text>
     <Block row>
      <Block column>
       <MaterialIcons onPress={() => this.chooseFileFromCamera()}
                      style={{borderRadius: 50/ 2, padding:8, margin: 10,
                       backgroundColor: theme.colors.primary, alignSelf: 'center'}}
                      color={theme.colors.white} name="photo-camera" size={24}/>
       <Text h3 center color={colors.gray}>Camera</Text>
      </Block>
      <Block column>
       <MaterialIcons onPress={() => this.chooseFileFromGallery()}
                      style={{borderRadius: 50/ 2, padding:8,margin: 10,
                       backgroundColor: theme.colors.tertiary, alignSelf: 'center'}}
                      color={theme.colors.white} name="photo" size={24}/>
       <Text h3 center color={colors.gray}>Gallery</Text>
      </Block>
     </Block>
    </Block>
   </BottomSheet>
  )
 }

/* renderWithImage = () => {
  const {data} = this.props.navigation.state.params
  console.log("kkkkkkkkkkkkkkk", this.state.ImageSourceViewArray)
  /!*data.url.map((d) => {
   this.state.ImageSourceViewArray.push(d.url)
  })
  console.log("jijijijijiji")*!/
  return (
   <Block>
    <Block row style={{flexWrap: 'wrap', width: '100%'}}>
     <ScrollView horizontal={true} >
      {data.url.length > 0 ?
       <FlatList
        style={{marginVertical:12, marginHorizontal: 8}}
        horizontal
        data={data.url}
        renderItem={({item, index}) =>{
         return (
          <ImageBackground
           style={{width: 110, height: 125, resizeMode: 'contain', marginRight: 8, flexDirection: 'row',}}
           source={{uri: item.url}} >
           <Menu style={{position: 'absolute', zIndex: 1000, elevation:4, top: 2, right: 4}}>
            <MenuTrigger>
             <MaterialCommunityIcons name={"dots-horizontal"} size={24} color={colors.white} />
            </MenuTrigger>
            <MenuOptions>
             <MenuOption onSelect={() => this.editImage(item)} >
              <Text style={{color: '#000'}}>Edit Image</Text>
             </MenuOption>
             <MenuOption onSelect={() => this.removeImage(item)} >
              <Text style={{color: '#000'}}>Delete Image</Text>
             </MenuOption>
             <MenuOption onSelect={() => this.setCoverPhoto(item)} >
              <Text style={{color: '#000'}}>Set as a Cover Photo</Text>
             </MenuOption>
            </MenuOptions>
           </Menu>
           {this.state.cover === '' && index === 0 ?
            <Text style={{position: 'absolute', bottom: 2, width: '100%', textAlign: 'center', opacity: 0.7, backgroundColor: "yellow", padding: 8}}>Cover Photo</Text>
            : this.state.cover == item.uri ? <Text style={{position: 'absolute', bottom: 2, width: '100%', textAlign: 'center', opacity: 0.7, backgroundColor: "yellow", padding: 8}}>Cover Photo</Text> : <Text></Text>}
          </ImageBackground>
         )
        }
        }
       /> : <Text></Text> }
     </ScrollView>
    </Block>
    <Block row style={{marginVertical: 4}}>
     {data.url.length > 0  ?
      <Block center style = {{flex: 1, marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-around'}} >
       <TouchableOpacity style={data.url.length > 4 ?
        {borderWidth: 0.5, flexDirection: 'row', alignItems: 'center', padding: 8, borderColor: colors.gray, backgroundColor: colors.placeholder} :
        {borderWidth: 0.5, flexDirection: 'row', alignItems: 'center', padding: 8, borderColor: colors.primary,}}
                         onPress={this._toggleBottomNavigationView}
                         disabled={data.url.length > 4 ? true : false}
       >
        <MaterialIcons name={"add-a-photo"}
                       style={{marginRight: 4}} color={data.url.length < 5 ? colors.primary : colors.white}
                       size={24} />
        <Text h3 color={data.url.length < 5 ? colors.primary : colors.white}>Add</Text>
       </TouchableOpacity>
       <Text>{data.url.length}/5 photos</Text>
       <TouchableOpacity onPress={() => this.props.navigation.navigate(
        "ProfilePhoto", {
         img: data.url,
         headerTitle: "Photos",
         backScreen: "EditProduct"
        })} style={{ borderWidth: 0.5, flexDirection: 'row', alignItems: 'center', padding: 10, borderColor: colors.primary }}
       >
        <Text h3 color={colors.gray}>View All</Text>
       </TouchableOpacity>
       {this.bottomSheet()}
      </Block>
      : <Block center>
       <TouchableOpacity style={{borderWidth: 0.5, marginVertical: 24, alignItems: 'center', padding: 10, borderColor: colors.primary }}
                         onPress={this._toggleBottomNavigationView} >
        <MaterialIcons name={"add-a-photo"} color={colors.primary} size={24} />
        <Text h3 color={colors.gray}>Add Photos</Text>
       </TouchableOpacity>
       <Text bold h3>You can add upto 5 photos.</Text>
       <Text h3>First Photo will be cover photo.</Text>
       {this.bottomSheet()}
      </Block> }
    </Block>
   </Block>
  )
 }*/

 renderWithImage = () => {
  console.log("ohohoho", this.state.cover)
  return (
   <Block>
    <Block row style={{flexWrap: 'wrap', width: '100%'}}>
     <ScrollView horizontal={true} >
      {this.state.ImageSourceViewArray.length > 0 ?
       <FlatList
        style={{marginVertical:12, marginHorizontal: 8}}
        horizontal
        data={this.state.ImageSourceViewArray}
        renderItem={({item, index}) =>{
         return (
          <ImageBackground
           style={{width: 110, height: 125, resizeMode: 'contain', marginRight: 8, flexDirection: 'row',}}
           source={{uri: item.uri}} >
           <Menu style={{position: 'absolute', zIndex: 1000, elevation:4, top: 2, right: 4}}>
            <MenuTrigger>
             <MaterialCommunityIcons name={"dots-horizontal"} size={24} color={colors.white} />
            </MenuTrigger>
            <MenuOptions>
             <MenuOption onSelect={() => this.editImage(item)} >
              <Text style={{color: '#000'}}>Edit Image</Text>
             </MenuOption>
             <MenuOption onSelect={() => this.removeImage(item)} >
              <Text style={{color: '#000'}}>Delete Image</Text>
             </MenuOption>
             <MenuOption onSelect={async () => await this.setCoverPhoto(item)} >
              <Text style={{color: '#000'}}>Set as a Cover Photo</Text>
             </MenuOption>
            </MenuOptions>
           </Menu>
           {this.state.cover === '' && index === 0 ?
            <Text style={{position: 'absolute', bottom: 2, width: '100%', textAlign: 'center', opacity: 0.7, backgroundColor: "yellow", padding: 8}}>Cover Photo</Text>
            : this.state.cover == item.uri ? <Text style={{position: 'absolute', bottom: 2, width: '100%', textAlign: 'center', opacity: 0.7, backgroundColor: "yellow", padding: 8}}>Cover Photo</Text> : <Text></Text>}
          </ImageBackground>
         )
        }
        }
       /> : <Text></Text> }
     </ScrollView>
    </Block>
    <Block row style={{marginVertical: 4}}>
     {this.state.ImageSourceViewArray.length > 0  ?
      <Block center style = {{flex: 1, marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-around'}} >
       <TouchableOpacity style={this.state.ImageSourceViewArray.length > 4 ?
        {borderWidth: 0.5, flexDirection: 'row', alignItems: 'center', padding: 8, borderColor: colors.gray, backgroundColor: colors.placeholder} :
        {borderWidth: 0.5, flexDirection: 'row', alignItems: 'center', padding: 8, borderColor: colors.primary,}}
                         onPress={this._toggleBottomNavigationView}
                         disabled={this.state.ImageSourceViewArray.length > 4 ? true : false}
       >
        <MaterialIcons name={"add-a-photo"}
                       style={{marginRight: 4}} color={this.state.ImageSourceViewArray.length < 5 ? colors.primary : colors.white}
                       size={24} />
        <Text h3 color={this.state.ImageSourceViewArray.length < 5 ? colors.primary : colors.white}>Add</Text>
       </TouchableOpacity>
       <Text>{this.state.ImageSourceViewArray.length}/5 photos</Text>
       <TouchableOpacity onPress={() => this.props.navigation.navigate(
        "ProfilePhoto", {
         img: this.state.ImageSourceViewArray,
         headerTitle: "Photos",
         backScreen: "EditBook"
        })} style={{ borderWidth: 0.5, flexDirection: 'row', alignItems: 'center', padding: 10, borderColor: colors.primary }}
       >
        <Text h3 color={colors.gray}>View All</Text>
       </TouchableOpacity>
       {this.bottomSheet()}
      </Block>
      : <Block center>
       <TouchableOpacity style={{borderWidth: 0.5, marginVertical: 24, alignItems: 'center', padding: 10, borderColor: colors.primary }}
                         onPress={this._toggleBottomNavigationView} >
        <MaterialIcons name={"add-a-photo"} color={colors.primary} size={24} />
        <Text h3 color={colors.gray}>Add Photos</Text>
       </TouchableOpacity>
       <Text bold h3>You can add upto 5 photos.</Text>
       <Text h3>First Photo will be cover photo.</Text>
       {this.bottomSheet()}
      </Block> }
    </Block>
   </Block>
  )
 }

 locationValidate = (text) => {
  if (text.toString().length <= 0) {
   this.setState({errorLocation: "Please search location."})
  }
 }
 render() {
  const { createCategory, userReducer} = this.props;
  const {data} = this.props.navigation.state.params

  console.log("MYYY", data.last_modified)

  return(
   <Block>
    <ScrollView>

     <Block container>
      {this.state.loading === 1 ? <Loader progress={this.state.progress}/> : <Text></Text>}
      <Text gray h3 style={{marginBottom: 4}}>Category</Text>
      <Picker
       style={{height: 35}}
       selectedValue={data.category}
       onValueChange={createCategory.dataSource.length > 0 ? this.onValueChange1.bind(this) : null}
       enabled={false}
      >
       {
        createCategory.dataSource.length > 0 ?
         createCategory.dataSource.map((category) => (
          <Picker.Item color={colors.gray} label={category.value} value={category.key} />
         )) : null
       }
      </Picker>
      <View
       style={{
        borderBottomColor: colors.gray2,
        borderBottomWidth: 0.5,
       }}
      />
      <Text gray h3 style={{marginTop: 24, marginBottom: 4}}>Sub-Category</Text>
      <Picker
       style={{height: 35}}
       selectedValue={data.subcategory !== undefined ? data.subcategory : null}
       onValueChange={createCategory.dataSubCategory !== undefined ? this.onValueChange2.bind(this) : null}
       enabled={false}
      >
       {
        createCategory.dataSubCategory !== undefined  ?
         createCategory.dataSubCategory.map((subcategory) => (
          <Picker.Item color={colors.gray} label={subcategory.value} value={subcategory.key} />
         )) : <Picker.Item color={"#000"} label="--Select Book Sub-Category--" value={null} />
       }
      </Picker>
      <View
       style={{
        borderBottomColor: colors.gray2,
        borderBottomWidth: 0.5,
       }}
      />
      {this.state.ImageSourceViewArray !== undefined ? this.state.ImageSourceViewArray.length > 0 ? this.renderWithImage() : this.renderNoImage() : <Loader/>}
      <View
       style={{
        borderBottomColor: colors.gray2,
        borderBottomWidth: 0.5,

       }}
      />
      {this.state.errorPhotoEmpty !== '' || this.state.errorPhoto !== '' ? <Block style={{height: 20,}}>
       {this.state.errorPhotoEmpty !== '' ? <Text style={{color: 'red'}}>{this.state.errorPhotoEmpty}</Text> : null}
       {this.state.errorPhoto !== '' ? <Text style={{color: 'red'}}>{this.state.errorPhoto}</Text> : null}
      </Block> : null}

      <Block>
       <Input defaultValue={data.title} placeholder={"Please enter book title"} InputTitle={"Book Title"} ref="title" onChangeText={(text) => this.setState({title: text})} />
       {this.isFieldInError('title') && this.getErrorsInField('title').map(errorMessage => <Text style={{color: 'red'}}>{errorMessage}</Text>) }
      </Block>
      <Input defaultValue={data.description} placeholder={"Please enter book description"} InputTitle={"Book Description"} ref="description"
             onChangeText={(text) => this.setState({description: text})} />
      {this.isFieldInError('description') && this.getErrorsInField('description').map(errorMessage => <Text style={{color: 'red'}}>{errorMessage}</Text>) }

      <Input defaultValue={data.author} placeholder={"Please enter book author"} InputTitle={"Book Author"} onChangeText={(text) => this.setState({author: text})}/>
      {this.isFieldInError('author') && this.getErrorsInField('author').map(errorMessage => <Text style={{color: 'red'}}>{errorMessage}</Text>) }

      <Text gray h3 style={{marginTop: 24, marginBottom: 8}}>I want to{data.choice}</Text>
      <Block row style={{marginBottom:4}}>
       <Checkbox size={20}
                 keyValue={1}
                 checked={data.choice.includes("exchange") ? true : false}
                 color={colors.primary}
                 labelColor="#000000"
                 label="Exchange"
                 value="exchange"
                 checkedObjArr={this.CheckedArrObject} />
       <Checkbox size={20}
                 keyValue={2}
                 checked={data.choice.includes("sell") ? true : false}
                 color={colors.primary}
                 labelColor="#000000"
                 label="Sell"
                 value="sell"
                 checkedObjArr={this.CheckedArrObject} />
      </Block>
      <View
       style={{
        borderBottomColor: colors.gray2,
        borderBottomWidth: 0.5,
       }}
      />
      {this.state.errorCheckBox !== '' ? <Text style={{color: 'red',}}>{this.state.errorCheckBox}</Text> : null }

      <Input defaultValue={data.price} placeholder={"Please enter book price"} InputTitle={"Book Price"} keyboardType='numeric'
             onChangeText={(text) => this.setState({price: text})}/>
      {this.isFieldInError('price') && this.getErrorsInField('price').map(errorMessage => <Text style={{color: 'red'}}>{errorMessage}</Text>) }

      <Text color={colors.gray2} h3 style={{alignSelf: 'flex-start', marginTop: 24, marginBottom: -5}}>Location</Text>
      <GooglePlacesAutocomplete
       value={this.state.location}
       getDefaultValue={() => data.location}
       currentLocation={true}
       placeholder='Search location'
       minLength={2}
       autoFocus={false}
       returnKeyType={'search'}
       keyboardAppearance={'light'}
       listViewDisplayed='true'
       fetchDetails={true}
       onPress={(data, details = null) => {
        if (data && details) {
         this.setState({
          location: data.description ? data.description : details.name + ", " + details.formatted_address,
          lat: details.geometry.location.lat ? details.geometry.location.lat : data.geometry.location.lat,
          lng: details.geometry.location.lng ? details.geometry.location.lng : data.geometry.location.lng,
          errorLocation: ''
         })
        }
       }}
       nearbyPlacesAPI='GooglePlacesSearch'
       GooglePlacesSearchQuery={{
        rankby: 'distance',
       }}
       query={{
        key: 'AIzaSyCK9195rpO4FJm0UvXImv28Dek6iEBHI4k',
       }}
       styles={{
        textInputContainer: {
         backgroundColor: 'rgba(0,0,0,0)',
         borderTopWidth: 0,
         borderBottomWidth: 0,
        },
        textInput: {
         marginLeft: -5,
         marginRight: 0,
         //paddingBottom: 12,
         height: 38,
         color: '#000',
         fontSize: 14,
        },
        description: {
         color: "#000"
        },
        predefinedPlacesDescription: {
         color: '#1faadb',
        },
       }}
       textInputProps={{
        onChangeText: (text) => this.locationValidate(text),
        onBlur: () => {}
       }}

       GooglePlacesDetailsQuery={{ fields: ['geometry', 'formatted_address'] }}
       debounce={300}
      />
      <View
       style={{
        borderWidth: 0,
        borderBottomColor: colors.gray2,
        borderBottomWidth: StyleSheet.hairlineWidth,
       }}
      />
      {this.isFieldInError('location') && this.getErrorsInField('location').map(errorMessage => <Text style={{color: 'red'}}>{errorMessage}</Text>) }
      {this.state.errorLocation !== '' ? <Text style={{color: 'red'}}>{this.state.errorLocation}</Text> : <Text></Text>}

      <Block row center style = {{marginVertical: 16, justifyContent: 'flex-end'}} >
       <Text h3 style={{flex: 3}}>Show my phone number on this book</Text>
       <Switch
        trackColor={{true: colors.primary, false: colors.gray}}
        thumbColor={this.state.switchValue ? colors.primary : "#CBCBCB"}
        value={this.state.switchValue}
        onValueChange ={(switchValue)=>this.setState({switchValue})}/>
      </Block>

      <Block row middle style={{marginBottom: 56, marginTop: 16}}>
       <Text gray h3>
        By proceeding, you agree to our
       </Text>
       <TouchableOpacity
        onPress={() => this.props.navigation.navigate(
         "TermsOfUse", {
          headerTitle: "Terms of Use",
          backScreen: "AddProduct"
         }
        )}>
        <Text h3 color={colors.primary}> Terms of Use</Text>
       </TouchableOpacity>
       <Text>.</Text>
      </Block>
     </Block>


    </ScrollView>
    <Button
     full
     isLoading={this.state.isLoading}
     onPress={() => this.submit1()}
     title={"UPDATE"} />
   </Block>
  )
 }
}

const mapStateToProps = (state) => ({
 createUser: state.createUser,
 createCategory: state.createCategory,
 myBooks: state.myBooksReducer,
 userReducer: state.userReducer
})

const mapDispatchToProps = (dispatch) => ({
 dispatch
});

export default compose(
 connect(mapStateToProps, mapDispatchToProps),
)(EditBook);
