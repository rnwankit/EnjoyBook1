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
import {addBook} from '../actions/mybooks.action';
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

class AddProduct extends ValidationComponent {
 constructor(props) {
  super(props);
  this.state = {
   filePath: {},
   loading: 0,
   progress: '',
   title: '',
   description: '',
   author: '',
   price: '',
   photos: '',
   url: '',
   addProduct: '',
   ImageSource: '',
   ImageSourceviewarray: [],
   image: null,
   images: null,
   errorPhoto: '',
   disableBtn: false,
   imageSettingUri: '',
   cover: '',
   location: props.userReducer.user.location,
   switchValue: false,
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
   lng: props.userReducer.user.lng
  };

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
  const uid = await AsyncStorage.getItem('uid');
  this.setState({uid: uid})
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
  console.log("From Add Product Submit",
   this.isFormValid(), this.CheckedArrObject.fetchArray().length > 0, this.state.errorLocation === ''
   , this.state.ImageSourceViewArray !== undefined , this.state.errorPhotoEmpty === ''
   )
  if (this.isFormValid() && this.CheckedArrObject.fetchArray().length > 0 && this.state.errorLocation === ''
  && this.state.ImageSourceViewArray !== undefined && this.state.errorPhotoEmpty === '') {

   let counter = this.state.ImageSourceViewArray.length;

   this.state.ImageSourceViewArray.map((i, index) => {
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
          this.setState({url: urls.join(","), addProduct: 'complete'});
          if (counter > 0) {
           counter--;
          }

          if (counter === 0) {
           if (this.state.url !== '') {
            console.log("F Add P", urls)

            let d = urls.sort(function(a, b){return b.cover - a.cover});
            const values = {
             category: createCategory.category,
             subcategory: createCategory.subcategory,
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
             last_modified: new Date(),
             modified_by: this.state.uid
            }

            this.props.dispatch(addBook(values))
            this.props.navigation.navigate("MyBooks")
            this.setState({loading: 0})
           }
          }
         })
        });
     })
     .catch(err => {
       console.log("EmError", err)
     });
   })
  }
 }

 removeImage = (image) => {
  let array = [...this.state.ImageSourceViewArray]; // make a separate copy of the array
  let index = array.indexOf(image)

  if (index !== -1) {
   array.splice(index, 1);
   this.setState({ImageSourceViewArray: array, imageSettingUri: ''});
  }
  console.log("ababab", image.uri)
  console.log("ababab1", this.state.cover)
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

 setCoverPhoto = (img) => {
  this.setState({cover: img.uri})
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

 renderWithImage = () => {
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
         backScreen: "AddProduct"
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

  return(
   <Block>
   <ScrollView>

    <Block container>
     {this.state.loading === 1 ? <Loader progress={this.state.progress}/> : <Text></Text>}
      <Text gray h3 style={{marginBottom: 4}}>Category</Text>
      <Picker
       style={{height: 35}}
       selectedValue={createCategory.category}
       onValueChange={createCategory.dataSource.length > 0 ? this.onValueChange1.bind(this) : null}
      >
       {
        createCategory.dataSource.length > 0 ?
         createCategory.dataSource.map((category) => (
          <Picker.Item color={"#000"} label={category.value} value={category.key} />
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
       selectedValue={createCategory.subcategory !== undefined ? createCategory.subcategory : null}
       onValueChange={createCategory.dataSubCategory !== undefined ? this.onValueChange2.bind(this) : null}
      >
       {
        createCategory.dataSubCategory !== undefined  ?
         createCategory.dataSubCategory.map((subcategory) => (
          <Picker.Item color={"#000"} label={subcategory.value} value={subcategory.key} />
         )) : <Picker.Item color={"#000"} label="--Select Book Sub-Category--" value={null} />
       }
      </Picker>
      <View
       style={{
        borderBottomColor: colors.gray2,
        borderBottomWidth: 0.5,
       }}
      />
      {this.state.ImageSourceViewArray !== undefined ? this.renderWithImage() : this.renderNoImage() }
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
      <Input placeholder={"Please enter book title"} InputTitle={"Book Title"} ref="title" onChangeText={(text) => this.setState({title: text})} />
      {this.isFieldInError('title') && this.getErrorsInField('title').map(errorMessage => <Text style={{color: 'red'}}>{errorMessage}</Text>) }
     </Block>
     <Input placeholder={"Please enter book description"} InputTitle={"Book Description"} ref="description" onChangeText={(text) => this.setState({description: text})} />
     {this.isFieldInError('description') && this.getErrorsInField('description').map(errorMessage => <Text style={{color: 'red'}}>{errorMessage}</Text>) }

     <Input placeholder={"Please enter book author"} InputTitle={"Book Author"} onChangeText={(text) => this.setState({author: text})}/>
     {this.isFieldInError('author') && this.getErrorsInField('author').map(errorMessage => <Text style={{color: 'red'}}>{errorMessage}</Text>) }

      <Text gray h3 style={{marginTop: 24, marginBottom: 8}}>I want to</Text>
       <Block row style={{marginBottom:4}}>
        <Checkbox size={20}
                  keyValue={1}
                  checked={true}
                  color={colors.primary}
                  labelColor="#000000"
                  label="Exchange"
                  value="exchange"
                  checkedObjArr={this.CheckedArrObject} />
        <Checkbox size={20}
                  keyValue={2}
                  checked={true}
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

     <Input placeholder={"Please enter book price"} InputTitle={"Book Price"} keyboardType='numeric' onChangeText={(text) => this.setState({price: text})}/>
     {this.isFieldInError('price') && this.getErrorsInField('price').map(errorMessage => <Text style={{color: 'red'}}>{errorMessage}</Text>) }

     <Text color={colors.gray2} h3 style={{alignSelf: 'flex-start', marginTop: 24, marginBottom: -5}}>Location</Text>
     <GooglePlacesAutocomplete
      value={this.state.location}
      getDefaultValue={() => userReducer.user.location}
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
    title={"Post"} />
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
)(AddProduct);
