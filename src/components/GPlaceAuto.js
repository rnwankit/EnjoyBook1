import React, {Component} from 'react';
import {Text, ScrollView, View, Alert, PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {createNewUser, getUser} from '../actions/auth.actions';
import {update_location} from '../actions/user.action';
import store from '../config/store'
class GPlaceAuto extends Component {
    constructor() {
        super();
        this.state = {
            uid: '',
            disLocation: '',
            lat: '',
            lng: ''
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Set Location',
            header: null,
            headerTitleStyle :{color:'#fff'},
            headerStyle: {backgroundColor:'#3c3c3c'},
            headerRight: <MaterialIcons
             style={{ marginLeft:15,color:'#fff' }}
             name="check" size={25} onPress={() => params.handleSave()} />,
           // headerLeft: "null"
        };
    };

    _saveDetails() {
        //this.props.navigation.navigate("Home");
        console.log("Save Details", this.props);
    }
    async componentDidMount(): void {
        const uid = await AsyncStorage.getItem('uid');
        const { createUser } = this.props;
        console.log("errereerer", uid)
        this.setState({uid: uid})
        /*if (createUser.user.uid !== undefined) {
            console.log("em");
         //   this.props.dispatch(getUser(createUser.user.uid))
        }
        */
        this.props.navigation.setParams({ handleSave: this._saveDetails });
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'ReactNativeCode Location Permission',
                    'message': 'ReactNativeCode App needs access to your location '
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
                    .then(data => {

                    }).catch(err => {
                    Alert.alert("Google Location Permission Not Granted");
                });
            } else {
                Alert.alert("Location Permission Not Granted");
            }
        } catch (err) {
            console.warn(err)
        }
    }

    renderLocation () {
        return(
            <View>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View keyboardShouldPersistTaps="handled" >
                        <GooglePlacesAutocomplete
                            currentLocation={true}
                            placeholder='Enter your location'
                            minLength={2} // minimum length of text to search
                            autoFocus={false}
                            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                            listViewDisplayed='true'    // true/false/undefined
                            fetchDetails={true}
                            //renderDescription={row => row.description || row.formatted_address || row.name}
                            // renderDescription={(row) => row.description} // custom description render
                            //components='country:ind'
                            onPress={(data, details = null) => {
                                //let address = details.formatted_address.split(', ');
                                console.log("DATAA", data);
                                console.log("details", details.name + ", " + details.formatted_address);
                                if (data && details) {
                                    this.setState({
                                        disLocation: data.description ? data.description : details.name + ", " + details.formatted_address,
                                        lat: details.geometry.location.lat ? details.geometry.location.lat : data.geometry.location.lat,
                                        lng: details.geometry.location.lng ? details.geometry.location.lng : data.geometry.location.lng
                                    })
                                }
                            }}
                            nearbyPlacesAPI='GooglePlacesSearch'
                            GooglePlacesSearchQuery={{
                                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                rankby: 'distance',
                               // type: 'cafe'
                            }}
                            getDefaultValue={() => ''}
                            query={{
                                // available options: https://developers.google.com/places/web-service/autocomplete
                                key: 'AIzaSyCK9195rpO4FJm0UvXImv28Dek6iEBHI4k',
                                //language: 'fr', // language of the results
                                //types: 'address', // default: 'geocode'
                                //  components: 'country:ca' // added  manually
                            }}
                            styles={{
                                textInputContainer: {
                                    width: '100%'
                                },
                                description: {
                                    fontWeight: 'bold'
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb'
                                }
                            }}
                            textInputProps={{ onBlur: () => {} }}
                            //GooglePlacesDetailsQuery={{ fields: 'formatted_address' }}
                            GooglePlacesDetailsQuery={{ fields: ['geometry', 'formatted_address'] }}
                            debounce={300} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }

    /*renderDisplay () {
        const { createUser, handleSubmit } = this.props;
        //console.log("GPlace create user", createUser.user.uid)
        //console.log("Srore data", store.getState().authReducer)
        if (createUser.user.uid !== undefined) {
            this.setState({uid: createUser.user.uid})
        }
        this.props.dispatch(update_location(this.state.uid, this.state.disLocation, this.state.lat, this.state.lng))
        return(
            <View>
                <Text>Location: {this.state.disLocation}</Text>
                <Text>Latitude: {this.state.lat}</Text>
                <Text>Longitude: {this.state.lng}</Text>
                {/!*{this.props.navigation.goBack()}*!/}
            </View>
        )
    }*/

    render() {
        //const { createUser } = this.props;
        //console.log("From GPlace render", createUser.user.uid)
        return (
         <View>
             <ScrollView keyboardShouldPersistTaps="handled">
                 <View keyboardShouldPersistTaps="handled" >
                     <GooglePlacesAutocomplete
                      currentLocation={true}
                      placeholder='Enter your location'
                      minLength={2} // minimum length of text to search
                      autoFocus={false}
                      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                      keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                      listViewDisplayed='true'    // true/false/undefined
                      fetchDetails={true}
                      //renderDescription={row => row.description || row.formatted_address || row.name}
                      // renderDescription={(row) => row.description} // custom description render
                      //components='country:ind'
                      onPress={(data, details = null) => {
                          //let address = details.formatted_address.split(', ');
                          console.log("DATAA", data);
                          console.log("details", details.name + ", " + details.formatted_address);
                          if (data && details) {
                              this.setState({
                                  disLocation: data.description ? data.description : details.name + ", " + details.formatted_address,
                                  lat: details.geometry.location.lat ? details.geometry.location.lat : data.geometry.location.lat,
                                  lng: details.geometry.location.lng ? details.geometry.location.lng : data.geometry.location.lng
                              })
                              this.props.dispatch(update_location(this.state.uid, this.state.disLocation, this.state.lat, this.state.lng))
                              this.props.navigation.navigate("Home");
                          }
                      }}
                      nearbyPlacesAPI='GooglePlacesSearch'
                      GooglePlacesSearchQuery={{
                          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                          rankby: 'distance',
                          // type: 'cafe'
                      }}
                      getDefaultValue={() => ''}
                      query={{
                          // available options: https://developers.google.com/places/web-service/autocomplete
                          key: 'AIzaSyCK9195rpO4FJm0UvXImv28Dek6iEBHI4k',
                          //language: 'fr', // language of the results
                          //types: 'address', // default: 'geocode'
                          //  components: 'country:ca' // added  manually
                      }}
                      styles={{
                          textInputContainer: {
                              width: '100%',
                              color: '#000'
                          },
                          description: {
                              color: '#000'
                          },
                          predefinedPlacesDescription: {
                              color: '#1faadb'
                          }
                      }}
         //             textInputProps={{ onBlur: () => {} }}
                      //GooglePlacesDetailsQuery={{ fields: 'formatted_address' }}
                      GooglePlacesDetailsQuery={{ fields: ['geometry', 'formatted_address'] }}
                      debounce={300} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                     />
                 </View>
             </ScrollView>
         </View>
        );
    }
}

const mapStateToProps = (state) => ({
    createUser: state.createUser
})

const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default compose(
 connect(mapStateToProps, mapDispatchToProps),
)(GPlaceAuto);
