import React, {Component} from 'react';
import {Block, Text} from '../components/index';
import { HeaderBackButton } from 'react-navigation-stack';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Loader from '../components/Loader';
import {
 ActivityIndicator,
 TouchableOpacity,
 Image,
 KeyboardAvoidingView,
 ScrollView,
 StyleSheet,
 TextInput,
 View,
 AsyncStorage,
} from 'react-native';
import {Logo} from '../components/Logo';
import {colors} from '../constants/theme';
import {theme} from '../constants';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import styles from '../styles';
import CountryPicker from 'react-native-country-picker-modal';
import {Button} from '../components/Button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from "react-native-image-crop-picker";
import Dialog from 'react-native-dialog';
import { BottomSheet } from 'react-native-btr';
import ValidationComponent from 'react-native-form-validator';
import uuid from 'react-native-uuid';
import ImageResizer from "react-native-image-resizer";
import firebase from '@react-native-firebase/app';
import { update_user_data } from '../actions/user.action';
import {Input} from '../components/Input';

class Profile extends ValidationComponent {
 static navigationOptions = ({navigation}) => {
  return {
   title: 'My Account',
  }
 }
 constructor(props) {
  super(props);
  const {userReducer} = this.props;
  this.state = {
   name: userReducer.user.name ? userReducer.user.name : '',
   phoneNumber: userReducer.user.phoneNumber ? userReducer.user.phoneNumber : '',
   location: userReducer.user.location ? userReducer.user.location : '',
   lat: userReducer.user.lat ? userReducer.user.lat : '',
   lng: userReducer.user.lng ? userReducer.user.lng : '',
   uid: '',
   isLoading: false,
   isDialogVisible: false,
   visible: false,
   uri: '',
   url: '',
   loading: 0,
   loaded: false,
   progress: '',
   errorLocation: ''
  }
  this.messages = {
   en: {
    required: "Please enter {0}.",
    numbers: "Please enter a valid {0} number.",
    minlength: "Please enter a valid {0}.",
    maxlength: "Please enter a valid {0}"
   },
   fr: {required: "erreur sur les nombres !"}
  };
 }

 async componentDidMount() {
  const uid = await AsyncStorage.getItem('uid');
  console.log("Did Uid", uid)
  this.setState({uid: uid})
 }

 _toggleBottomNavigationView = () => {
  //Toggling the visibility state of the bottom sheet
  this.setState({ visible: !this.state.visible });
 };

 chooseFileFromGallery = () => {
  console.log("from gallery")
  ImagePicker.openPicker({
   width: 300,
   height: 400,
   cropping: true,
  }).then(response => {
   let image = {
    uri: response.path,
   }
   this.setState({uri: image, visible: false})
    console.log("response in profime", image)
   })
 }

 chooseFileFromCamera = () => {
  console.log("from camara")
  ImagePicker.openCamera({
   width: 300,
   height: 400,
   includeBase64: true
  }).then(image => {
   let img = {
    uri: image.path,
   }
   this.setState({uri: img, visible: false})
   console.log("response in profime camera", img)
  });
 }

 _onLoad = () => {
  this.setState(() => ({ loaded: true }))
 }

 renderPhoneNumberInput() {
  const { userReducer } = this.props;

  const uriImg = {
   uri: userReducer.user.imageUrl ? userReducer.user.imageUrl : ''
  }
  console.log("uiui", userReducer.user)
  return (
   /*<View>
    <GooglePlacesAutocomplete
     value={this.state.location}
     getDefaultValue={() => this.state.location}
     currentLocation={true}
     placeholder='Search location'
     minLength={2} // minimum length of text to search
     autoFocus={false}
     returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
     keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
     listViewDisplayed='true'    // true/false/undefined
     fetchDetails={true}
     onPress={(data, details = null) => {
      if (data && details) {
       this.setState({
        location: data.description ? data.description : details.name + ", " + details.formatted_address,
        lat: details.geometry.location.lat ? details.geometry.location.lat : data.geometry.location.lat,
        lng: details.geometry.location.lng ? details.geometry.location.lng : data.geometry.location.lng
       })
      }
     }}
     nearbyPlacesAPI='GooglePlacesSearch'
     GooglePlacesSearchQuery={{
      rankby: 'distance',
     }}
     query={{
      key: 'AIzaSyBqx2MjWI9n9ZHpy0oxxGZr1oaXLgnxlrQ',
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
     textInputProps={{ onBlur: () => {} }}
     GooglePlacesDetailsQuery={{ fields: ['geometry', 'formatted_address'] }}
     debounce={300} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
    />
   </View>*/
   <Block>
    <ScrollView>

     <Block container>
    {userReducer.user.imageUrl !== '' || this.state.uri !== '' ?
     <TouchableOpacity onPress={() => this.props.navigation.navigate(
      "ProfilePhoto", {
       img: [this.state.uri !== '' ? this.state.uri : uriImg],
       headerTitle: "Profile Photo",
       backScreen: "Profile"
      })}>
      {console.log("this.state.uri0", this.state.uri)}
      {console.log("this.state.uri1", uriImg)}
     <Image
      onLoad={this._onLoad}
      style={{marginVertical: 24, width: 125, height: 125, borderRadius: 125/ 2, alignSelf: 'center',}}
      source={this.state.uri !== '' ? this.state.uri : uriImg} />
     </TouchableOpacity>:
     <MaterialIcons
      style={{marginVertical: 16,  borderRadius: 120/ 2, alignSelf: 'center'}}
      color={theme.colors.gray} name="account-circle" size={120}/>
    }
    <MaterialIcons onPress={this._toggleBottomNavigationView} style={{top: -70, left: 40, borderRadius: 50/ 2, padding:8, backgroundColor: theme.colors.primary, alignSelf: 'center'}}
                   color={theme.colors.white} name="edit" size={24}/>
    <BottomSheet
     visible={this.state.visible}
     //setting the visibility state of the bottom shee
     onBackButtonPress={this._toggleBottomNavigationView}
     //Toggling the visibility state on the click of the back botton
     onBackdropPress={this._toggleBottomNavigationView}
     //Toggling the visibility state on the clicking out side of the sheet
    >
     {/*Bottom Sheet inner View*/}
     <Block flex={false} style={{height: 160, backgroundColor: colors.white, padding: 16}}>
       <Text h2 bold color={colors.primary} style={{marginBottom: 16, fontSize: 20}}>
        Profile Photo
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
        <Block column>
         <MaterialIcons onPress={() => this.chooseFileFromGallery()}
                        style={{borderRadius: 50/ 2, padding:8,margin: 10,
                         backgroundColor: 'red', alignSelf: 'center'}}
                        color={theme.colors.white} name="delete" size={24}/>
         <Text center h3 color={colors.gray}>Remove Photo</Text>
        </Block>
       </Block>
     </Block>
    </BottomSheet>
    {/*<Text color={colors.gray2} h3 style={{alignSelf: 'flex-start', marginBottom: -16}}>Name</Text>
    <TextInput
     style={{
      width: theme.screenWidth - 43,marginTop: 15, borderRadius: 0, paddingBottom: 4,
      borderWidth: 0,
      borderBottomColor: colors.gray2,
      borderBottomWidth: StyleSheet.hairlineWidth,
     }}
     value={this.state.name}
     placeholder={"Please enter your name"}
     onChangeText={(name) => this.setState({name})}
    />*/}
    <Input
     placeholder={"Please enter your name"}
     InputTitle={"Name"}
     ref="name"
     value={this.state.name}
     onChangeText={(text) => this.setState({name: text})}
    />
    {this.isFieldInError('name') && this.getErrorsInField('name').map(errorMessage => <Text style={{color: 'red'}}>{errorMessage}</Text>) }
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
      <Block style={{marginTop: -16}}>
      <Input
       placeholder={"Please enter your phone number"}
       InputTitle={"Phone Number"}
       ref="phoneNumber"
       editable={false}
       value={this.state.phoneNumber}

       onChangeText={(text) => this.setState({phoneNumber: text})}
      />
      {this.isFieldInError('phoneNumber') && this.getErrorsInField('phoneNumber').map(errorMessage => <Text style={{color: 'red'}}>{errorMessage}</Text>) }
      </Block>
      </Block>
    </ScrollView>
    <Button
     full
     isLoading={this.state.isLoading}
     onPress={() => this.onSubmit()}
     title={"Update"}
    />
   </Block>
  );
 }

 locationValidate = (text) => {
  if (text.toString().length <= 0) {
   this.setState({errorLocation: "Please search location."})
  }
 }

 onSubmit = () => {
  this.validate({
   name: {required: true},
   phoneNumber: {required: true},
   location: {required: true},
  });
  if (this.isFormValid() && this.state.errorLocation === '') {
    const fileExtension = this.state.uri.uri.split('.').pop();
    const uid = uuid.v1();
    const fileName = `${uid}.${fileExtension}`;
    console.log("fL", fileName)
    ImageResizer.createResizedImage(this.state.uri.uri, 800, 600, 'JPEG', 50)
     .then(response => {
      const storageRef = firebase.storage().ref(`Pictures/images/${fileName}`);
      console.log("")
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
          console.log("urlurl", url)
          if (url !== '') {

            const user = {
             uid: this.state.uid,
             name: this.state.name,
             location: this.state.location,
             lat: this.state.lat,
             lng: this.state.lng,
             imageUrl: url,
             phoneNumber: this.state.phoneNumber,
             last_modified: new Date(),
             modified_by: this.state.uid,
            }
            this.props.dispatch(update_user_data(user))
           this.setState({loading: 0})
           }
         })
        });
     })
     .catch(err => {

     });
  }
 }

 render() {
  const { userReducer } = this.props;
  return (
    <Block>
     {this.state.loading === 1 ? <Loader progress={this.state.progress}/> : <Text></Text>}
     {userReducer.user ? this.renderPhoneNumberInput() : <ActivityIndicator animating={this.state.isLoading} />}
    </Block>
  );
 }
}

const mapStateToProps = (state) => ({
 userReducer: state.userReducer
})

const mapDispatchToProps = (dispatch) => ({
 dispatch
});

export default compose(
 connect(mapStateToProps, mapDispatchToProps),
)(Profile);
