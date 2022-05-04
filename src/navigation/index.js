
import React, {Component} from 'react';
import {Alert, ScrollView, Image, View, TouchableOpacity, SafeAreaView, ImageBackground, Dimensions, Platform} from 'react-native';
import {createAppContainer, createSwitchNavigator, NavigationContainer} from 'react-navigation';
import { createStackNavigator, HeaderBackButton } from 'react-navigation-stack'
import { createBottomTabNavigator, BottomTabBar, DrawerActions } from 'react-navigation-tabs';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';

import Home from '../screens/Home';
import Chat from '../screens/Chat';
import MyBooks from '../screens/MyBooks';

import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Settings from '../screens/Settings';

import HomeHeader from "../components/HomeHeader";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import CH from "../screens/CH";
import ImagePickerC from "../components/ImagePickerC";
import AddProduct from "../screens/AddProduct";
import Category from '../components/Category';

import {colors, fonts, sizes} from '../constants/theme';
import {theme} from '../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import BottomTab from '../components/BottomTab';
import Drawer from '../components/Drawer';
import MyWishlist from '../screens/MyWishlist';
import ExchangeRequest from '../screens/ExchangeRequest';
import BookBuySellOffer from '../screens/BookBuySellOffer';
import ContactUs from '../screens/ContactUs';
import {Text, Block} from '../components/index';
import Profile from '../screens/Profile';
import GPlaceAuto from '../components/GPlaceAuto';
import AuthLoading from '../screens/AuthLoading';
import AuthStart from '../screens/AuthStart';
import TermsOfUse from '../screens/TermsOfUse';
import ProfilePhoto from '../screens/ProfilePhoto';
import Buy from '../screens/Buy';
import Categories from '../screens/Categories';
import SubCategories from '../screens/SubCategories';
import Book from '../screens/Book';
import SellerInfo from '../screens/SellerInfo';
import EditBook from '../screens/EditBook';
import NotificationList from '../screens/NotificationList';
import ExchangeRequestList from '../screens/ExchangeRequestList';
import MyRequestList from '../screens/MyRequestList';
import MyRequest from '../screens/MyRequest';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import BuyChatRoom from '../screens/BuyChatRoom';
import SellChatRoom from '../screens/SellChatRoom'
import ExchangeChatRoom from '../screens/ExchangeChatRoom';
import {Input} from '../components/Input';
import ChatHeader from '../components/ChatHeader';
import { TextInput } from 'react-native';

const { width, height } = Dimensions.get('window');

const AuthStack = createStackNavigator({
//  AuthStart: {
//   screen: AuthStart,
//   navigationOptions: {
//    header: null,
//   }
//  },
 Signup: { screen: Signup },
 Login: {
  screen: Login,
 },
 TermsOfUse: { screen: TermsOfUse }
}, {
 defaultNavigationOptions: {
  headerTitleStyle: {
   color: colors.primary,
   font: fonts.header,
   marginLeft: -20
  },
  cardStyle: { backgroundColor: '#FFFFFF' },
 }
});

const HomeStack = createStackNavigator({
 Home: {
  screen: Home,
  navigationOptions: ({ navigation, screenProps }) => {
   return {
    header: <HomeHeader {...navigation} {...screenProps} />
   }}
 },
 Categories: Categories,
 SubCategories: SubCategories,
 NotificationList: {
  screen: NotificationList,
  navigationOptions: {
   headerTitle: "Notifications",
  }
 },
 Book: {
  screen: Book,
  navigationOptions: {
   header: null,
  }
 },
 /*Chat: {
  screen: Chat
 },*/
 ProfilePhoto: ProfilePhoto,
 SellerInfo: SellerInfo,
 AddProduct: {
  screen: AddProduct,
  navigationOptions: {
   headerTitle: "Post Your Book",
  }
 }
}, {
 defaultNavigationOptions: ({ navigation}) => {
  return {
   headerTitleStyle: {
    color: colors.primary,
    font: fonts.header,
    marginLeft: -20
   },
   cardStyle: { backgroundColor: '#FFFFFF' },
  }
 }
});

HomeStack.navigationOptions = ({ navigation }) => {
 let tabBarVisible;
 if (navigation.state.routes.length > 1) {
  navigation.state.routes.map(route => {
   if (route.routeName === "Home" || route.routeName === "Chat" || route.routeName === "MyBooks" ) {
    tabBarVisible = true;
   } else {
    tabBarVisible = false;
   }
  });
 }

 return {
  tabBarVisible
 };
};



const BookStack = createStackNavigator({
 Book: Book,
 ProfilePhoto: ProfilePhoto,
})

const MyBooksStack = createStackNavigator({
 MyBooks: {
  screen: MyBooks,
  navigationOptions:  ({ navigation }) => ({
   headerTitle: 'My Books',
   headerLeft: (<HeaderBackButton onPress={() => {
    navigation.navigate('Home')
   }}/>)
  })
 },
 EditBook: EditBook
}, {
 defaultNavigationOptions: ({ navigation}) => {
  return {
   headerTitleStyle: {
    color: colors.primary,
    font: fonts.header,
    marginLeft: -20
   },
   cardStyle: { backgroundColor: '#FFFFFF' },
  }
 }
});

const MyWishlistStack = createStackNavigator({
 MyWishlist: {
  screen: MyWishlist,
  navigationOptions:  ({ navigation }) => ({
   headerTitle: 'My Wishlist',
   headerLeft: (<HeaderBackButton onPress={() => {
    navigation.navigate('Home')
   }}/>)
  })
 },
}, {
 defaultNavigationOptions: ({ navigation}) => {
  return {
   headerTitleStyle: {
    color: colors.primary,
    font: fonts.header,
    marginLeft: -20
   },
   cardStyle: { backgroundColor: '#FFFFFF' },
  }
 }
});

const TopTabNavigator = createMaterialTopTabNavigator(
 {
  ExchangeRequestList: {
   screen: ExchangeRequestList,
   navigationOptions: {
    title: 'Exchange Request',
   }
  },
  MyRequestList: {
   screen: MyRequestList,
   navigationOptions: {
    title: 'My Request',
   },
  },
 },
 {
  tabBarOptions: {
   activeTintColor: colors.primary,
   inactiveTintColor: 'gray',
   showIcon: false,
   showLabel:true,
   style: {
    backgroundColor: 'none',
   },
   indicatorStyle: {
    backgroundColor: colors.primary
   },
   labelStyle: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
    fontSize: 14
   },
  },
  defaultNavigationOptions: ({ navigation}) => {
   return {
    headerTitleStyle: {
     color: colors.primary,
     font: fonts.header,
     marginLeft: -20
    },
    cardStyle: { backgroundColor: '#FFFFFF' },
   }
  }
 }
)
 
const TopTabNavigatorChat = createMaterialTopTabNavigator(
 {
  ExchangeChatRoom: {
   screen: ExchangeChatRoom,
   navigationOptions: {
    title: 'Exchange',
   }
  },
  BuyChatRoom: {
   screen: BuyChatRoom,
   navigationOptions: {
    title: 'Buy',
   },
  },
  SellChatRoom: {
   screen: SellChatRoom,
   navigationOptions: {
    title: 'Sell',
   },
  },
 },
 {
  tabBarOptions: {
   activeTintColor: colors.primary,
   inactiveTintColor: 'gray',
   showIcon: false,
   showLabel:true,
   style: {
    backgroundColor: 'none', 
   },  
   lazy: true,
   indicatorStyle: {
    backgroundColor: colors.primary  
   },
   labelStyle: { 
    textTransform: 'capitalize', 
    fontWeight: 'bold',
    fontSize: 14 
   },
   //backBehavior: 'history',
  },
  lazy: true,
  defaultNavigationOptions: ({ navigation}) => {
   return {
    tabBarOnPress: (scene, jumpToIndex) => {
      console.tron.log('onPress:', scene, jumpToIndex);
      navigation.popToTop();
     // navigation.state.params = undefined;
      navigation.navigate(navigation.state.routeName)
     // jumpToIndex(scene.index);
    },
   } 
  }
 }
) 

//const {params = {}} = navigation.state;

TopTabNavigatorChat.navigationOptions = ({ navigation, screenProps }) => {
  console.tron.log("000000000", navigation) 
  if (navigation.state.routes[navigation.state.index].params !== undefined) {
    if (navigation.state.routes[navigation.state.index].params.searchClick) {
      return {
        header: (
          <ChatHeader {...navigation} {...screenProps} />
          ),
      }
    } else {
      return {
        headerLeft: (  
          navigation.state.routes[navigation.state.index].params !== undefined ? 
            <HeaderBackButton onPress={() => {  
              navigation.state.routes[navigation.state.index].params.handleBack !== undefined ? 
                navigation.state.routes[navigation.state.index].params.handleBack(
                  navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? 
                  navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
                  navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : 
                  navigation.state.routes[navigation.state.index].params.itemDelete) :
                navigation.navigate('Home')  
            }}/> : 
            <HeaderBackButton onPress={() => { navigation.navigate('Home') }}/>
        ),
        title:  
          navigation.state.routes[navigation.state.index].params !== undefined ? 
            navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
              navigation.state.routes[navigation.state.index].params.itemDelete.length : 'Chat' 
          : 'Chat',
        headerRight: (
          navigation.state.routes[navigation.state.index].params !== undefined ?
            navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ?
              <TouchableOpacity  
                onPress = {() => { 
                  Alert.alert(
                    'Delete Chat?',
                    'Delete ' + navigation.state.routes[navigation.state.index].params.itemDelete.length + ' selected chats?',
                    [ 
                        { 
                            text: 'Cancel', 
                            onPress: () => console.tron.log('Not Deleted'),
                            style: ' cancel'
                        },
                        {
                            text: 'DELETE',
                            onPress: () => {
                              navigation.state.routes[navigation.state.index].params.handleSave(navigation.state.routes[navigation.state.index].params.itemDelete),
                              navigation.state.routes[navigation.state.index].params.handleBack(navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : navigation.state.routes[navigation.state.index].params.itemDelete)
                            }
                        }
                    ],
                    { cancelable: false }
                  );  
                }}
              ><MaterialIcons style={{margin: 16}} color={colors.black}  name="delete" size={20}/></TouchableOpacity> : 
            <TouchableOpacity onPress={() => {navigation.state.routes[navigation.state.index].params.handleSearch()}}>
              <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
            </TouchableOpacity>  : 
          navigation.state.params === undefined ? 
            <TouchableOpacity onPress={() => {navigation.state.routes[navigation.state.index].params.handleSearch()}}>
              <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
            </TouchableOpacity> : 
            <TouchableOpacity onPress={() => {navigation.state.routes[navigation.state.index].params.handleSearch()}}>
                <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
              </TouchableOpacity>
        )
      }  
    } 
  } else {
    return {
      headerLeft: (  
        navigation.state.routes[navigation.state.index].params !== undefined ? 
          <HeaderBackButton onPress={() => {  
            navigation.state.routes[navigation.state.index].params.handleBack !== undefined ? 
              navigation.state.routes[navigation.state.index].params.handleBack(
                navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? 
                navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
                navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : 
                navigation.state.routes[navigation.state.index].params.itemDelete) :
              navigation.navigate('Home')  
          }}/> : 
          <HeaderBackButton onPress={() => { navigation.navigate('Home') }}/>
      ),
      title:  
        navigation.state.routes[navigation.state.index].params !== undefined ? 
          navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
            navigation.state.routes[navigation.state.index].params.itemDelete.length : 'Chat' 
        : 'Chat',
      headerRight: (
        navigation.state.routes[navigation.state.index].params !== undefined ?
          navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ?
            <TouchableOpacity  
              onPress = {() => { 
                Alert.alert(
                  'Delete Chat?',
                  'Delete ' + navigation.state.routes[navigation.state.index].params.itemDelete.length + ' selected chats?',
                  [ 
                      { 
                          text: 'Cancel', 
                          onPress: () => console.tron.log('Not Deleted'),
                          style: ' cancel'
                      },
                      {
                          text: 'DELETE',
                          onPress: () => {
                            navigation.state.routes[navigation.state.index].params.handleSave(navigation.state.routes[navigation.state.index].params.itemDelete),
                            navigation.state.routes[navigation.state.index].params.handleBack(navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : navigation.state.routes[navigation.state.index].params.itemDelete)
                          }
                      }
                  ],
                  { cancelable: false }
                );  
              }}
            ><MaterialIcons style={{margin: 16}} color={colors.black}  name="delete" size={20}/></TouchableOpacity> : 
          <TouchableOpacity onPress={() => {navigation.state.routes[navigation.state.index].params.handleSearch()}}>
            <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
          </TouchableOpacity>  : 
        navigation.state.params === undefined ? 
          <TouchableOpacity onPress={() => {navigation.state.routes[navigation.state.index].params.handleSearch()}}>
            <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
          </TouchableOpacity> : 
          <TouchableOpacity onPress={() => {navigation.state.routes[navigation.state.index].params.handleSearch()}}>
              <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
            </TouchableOpacity>
      )
    }  
  }
  // if (navigation.state.routes[navigation.state.index].params !== undefined) {
  //   console.tron.log("11111111", navigation)
  //   if (navigation.state.routes[navigation.state.index].params.searchClick) {
  //     console.tron.log("22222222", navigation)
  //     return {
  //       header: (
  //         <ChatHeader {...navigation} {...screenProps} />
  //         ),
  //       }
  //   } else {
  //     console.tron.log("444444444", navigation)
  //     return {
  //       headerLeft: (   
  //         navigation.state.routes[navigation.state.index].params !== undefined ? 
  //         <HeaderBackButton onPress={() => {  
  //           navigation.state.routes[navigation.state.index].params.handleBack !== undefined ? 
  //             navigation.state.routes[navigation.state.index].params.handleBack(
  //               navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? 
  //               navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
  //               navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : 
  //               navigation.state.routes[navigation.state.index].params.itemDelete) :
  //             navigation.navigate('Home')  
  //         }}/> : <HeaderBackButton onPress={() => { navigation.navigate('Home') }}/>),
  //         title:  
  //         navigation.state.routes[navigation.state.index].params !== undefined ? 
  //           navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
  //             navigation.state.routes[navigation.state.index].params.itemDelete.length : 'Chat' 
  //         : 'Chat',
  //         headerRight: (
  //         navigation.state.routes[navigation.state.index].params !== undefined ?
  //           navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ?
  //             <TouchableOpacity  
  //               onPress = {() => { 
  //                 Alert.alert(
  //                   'Delete Chat?',
  //                   'Delete ' + navigation.state.routes[navigation.state.index].params.itemDelete.length + ' selected chats?',
  //                   [ 
  //                       { 
  //                           text: 'Cancel', 
  //                           onPress: () => console.tron.log('Not Deleted'),
  //                           style: ' cancel'
  //                       },
  //                       {
  //                           text: 'DELETE',
  //                           onPress: () => {
  //                             navigation.state.routes[navigation.state.index].params.handleSave(navigation.state.routes[navigation.state.index].params.itemDelete),
  //                             navigation.state.routes[navigation.state.index].params.handleBack(navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : navigation.state.routes[navigation.state.index].params.itemDelete)
  //                           }
  //                       }
  //                   ],
  //                   { cancelable: false }
  //                 );  
  //               }}
  //             >
  //               <MaterialIcons style={{margin: 16}} color={colors.black}  name="delete" size={20}/>
  //             </TouchableOpacity> : 
  //             <TouchableOpacity onPress={() => {navigation.setParams({
  //               searchClick: true
  //             })}}>
  //               <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
  //             </TouchableOpacity>  : 
  //             <TouchableOpacity onPress={() => <ChatHeader {...navigation} {...screenProps} />}>
  //               <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
  //             </TouchableOpacity>
  //       )
  //     }  
  //   } 
  // } else {
  //   if (navigation.state.params.searchClick !== undefined) {
  //     if (navigation.state.params.searchClick) {
  //       return {
  //         header: (
  //           <ChatHeader {...navigation} {...screenProps} />
  //           ),
  //         }
  //     } else {
  //       return {
  //         headerLeft: (   
  //           navigation.state.routes[navigation.state.index].params !== undefined ? 
  //           <HeaderBackButton onPress={() => {  
  //             navigation.state.routes[navigation.state.index].params.handleBack !== undefined ? 
  //               navigation.state.routes[navigation.state.index].params.handleBack(
  //                 navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? 
  //                 navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
  //                 navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : 
  //                 navigation.state.routes[navigation.state.index].params.itemDelete) :
  //               navigation.navigate('Home')  
  //           }}/> : <HeaderBackButton onPress={() => { navigation.navigate('Home') }}/>),
  //           title:  
  //           navigation.state.routes[navigation.state.index].params !== undefined ? 
  //             navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
  //               navigation.state.routes[navigation.state.index].params.itemDelete.length : 'Chat' 
  //           : 'Chat',
  //           headerRight: (
  //           navigation.state.routes[navigation.state.index].params !== undefined ?
  //             navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ?
  //               <TouchableOpacity  
  //                 onPress = {() => { 
  //                   Alert.alert(
  //                     'Delete Chat?',
  //                     'Delete ' + navigation.state.routes[navigation.state.index].params.itemDelete.length + ' selected chats?',
  //                     [ 
  //                         { 
  //                             text: 'Cancel', 
  //                             onPress: () => console.tron.log('Not Deleted'),
  //                             style: ' cancel'
  //                         },
  //                         {
  //                             text: 'DELETE',
  //                             onPress: () => {
  //                               navigation.state.routes[navigation.state.index].params.handleSave(navigation.state.routes[navigation.state.index].params.itemDelete),
  //                               navigation.state.routes[navigation.state.index].params.handleBack(navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : navigation.state.routes[navigation.state.index].params.itemDelete)
  //                             }
  //                         }
  //                     ],
  //                     { cancelable: false }
  //                   );  
  //                 }}
  //               >
  //                 <MaterialIcons style={{margin: 16}} color={colors.black}  name="delete" size={20}/>
  //               </TouchableOpacity> : 
  //               <TouchableOpacity onPress={() => {navigation.setParams({
  //                 searchClick: true
  //               })}}>
  //                 <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
  //               </TouchableOpacity>  : 
  //               <TouchableOpacity onPress={() => <ChatHeader {...navigation} {...screenProps} />}>
  //                 <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
  //               </TouchableOpacity>
  //         )
  //       }  
  //     }
  //   } else {
  //     return {
  //       headerLeft: (   
  //         navigation.state.routes[navigation.state.index].params !== undefined ? 
  //         <HeaderBackButton onPress={() => {  
  //           navigation.state.routes[navigation.state.index].params.handleBack !== undefined ? 
  //             navigation.state.routes[navigation.state.index].params.handleBack(
  //               navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? 
  //               navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
  //               navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : 
  //               navigation.state.routes[navigation.state.index].params.itemDelete) :
  //             navigation.navigate('Home')  
  //         }}/> : <HeaderBackButton onPress={() => { navigation.navigate('Home') }}/>),
  //         title:  
  //         navigation.state.routes[navigation.state.index].params !== undefined ? 
  //           navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
  //             navigation.state.routes[navigation.state.index].params.itemDelete.length : 'Chat' 
  //         : 'Chat',
  //         headerRight: (
  //         navigation.state.routes[navigation.state.index].params !== undefined ?
  //           navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ?
  //             <TouchableOpacity  
  //               onPress = {() => { 
  //                 Alert.alert(
  //                   'Delete Chat?',
  //                   'Delete ' + navigation.state.routes[navigation.state.index].params.itemDelete.length + ' selected chats?',
  //                   [ 
  //                       { 
  //                           text: 'Cancel', 
  //                           onPress: () => console.tron.log('Not Deleted'),
  //                           style: ' cancel'
  //                       },
  //                       {
  //                           text: 'DELETE',
  //                           onPress: () => {
  //                             navigation.state.routes[navigation.state.index].params.handleSave(navigation.state.routes[navigation.state.index].params.itemDelete),
  //                             navigation.state.routes[navigation.state.index].params.handleBack(navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : navigation.state.routes[navigation.state.index].params.itemDelete)
  //                           }
  //                       }
  //                   ],
  //                   { cancelable: false }
  //                 );  
  //               }}
  //             >
  //               <MaterialIcons style={{margin: 16}} color={colors.black}  name="delete" size={20}/>
  //             </TouchableOpacity> : 
  //             <TouchableOpacity onPress={() => {navigation.setParams({
  //               searchClick: true
  //             })}}>
  //               <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
  //             </TouchableOpacity>  : 
  //             <TouchableOpacity onPress={() => <ChatHeader {...navigation} {...screenProps} />}>
  //               <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
  //             </TouchableOpacity>
  //       )
  //     }  
  //   }
  //   console.tron.log("333333333", navigation)
  //   return {
  //     headerLeft: (   
  //       navigation.state.routes[navigation.state.index].params !== undefined ? 
  //       <HeaderBackButton onPress={() => {  
  //         navigation.state.routes[navigation.state.index].params.handleBack !== undefined ? 
  //           navigation.state.routes[navigation.state.index].params.handleBack(
  //             navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? 
  //             navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
  //             navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : 
  //             navigation.state.routes[navigation.state.index].params.itemDelete) :
  //           navigation.navigate('Home')  
  //       }}/> : <HeaderBackButton onPress={() => { navigation.navigate('Home') }}/>),
  //       title:  
  //       navigation.state.routes[navigation.state.index].params !== undefined ? 
  //         navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
  //           navigation.state.routes[navigation.state.index].params.itemDelete.length : 'Chat' 
  //       : 'Chat',
  //       headerRight: (
  //       navigation.state.routes[navigation.state.index].params !== undefined ?
  //         navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ?
  //           <TouchableOpacity  
  //             onPress = {() => { 
  //               Alert.alert(
  //                 'Delete Chat?',
  //                 'Delete ' + navigation.state.routes[navigation.state.index].params.itemDelete.length + ' selected chats?',
  //                 [ 
  //                     { 
  //                         text: 'Cancel', 
  //                         onPress: () => console.tron.log('Not Deleted'),
  //                         style: ' cancel'
  //                     },
  //                     {
  //                         text: 'DELETE',
  //                         onPress: () => {
  //                           navigation.state.routes[navigation.state.index].params.handleSave(navigation.state.routes[navigation.state.index].params.itemDelete),
  //                           navigation.state.routes[navigation.state.index].params.handleBack(navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : navigation.state.routes[navigation.state.index].params.itemDelete)
  //                         }
  //                     }
  //                 ],
  //                 { cancelable: false }
  //               );  
  //             }}
  //           >
  //             <MaterialIcons style={{margin: 16}} color={colors.black}  name="delete" size={20}/>
  //           </TouchableOpacity> : 
  //           <TouchableOpacity onPress={() => {navigation.setParams({
  //             searchClick: true
  //           })}}>
  //             <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
  //           </TouchableOpacity>  : 
  //           <TouchableOpacity onPress={() => <ChatHeader {...navigation} {...screenProps} />}>
  //             <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
  //           </TouchableOpacity>
  //     )
  //   }
  // }
  // if (navigation.state.params === undefined) {
  //   console.tron.log("111111111111UUUUUUUUUUUUUUUUUUUUU0", navigation)
  //   return {
  //     headerLeft: (   
  //       navigation.state.routes[navigation.state.index].params !== undefined ? 
  //       <HeaderBackButton onPress={() => {  
  //         navigation.state.routes[navigation.state.index].params.handleBack !== undefined ? 
  //           navigation.state.routes[navigation.state.index].params.handleBack(
  //             navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? 
  //             navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
  //             navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : 
  //             navigation.state.routes[navigation.state.index].params.itemDelete) :
  //           navigation.navigate('Home')  
  //       }}/> : <HeaderBackButton onPress={() => { navigation.navigate('Home') }}/>),
  //       title:  
  //       navigation.state.routes[navigation.state.index].params !== undefined ? 
  //         navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
  //           navigation.state.routes[navigation.state.index].params.itemDelete.length : 'Chat' 
  //       : 'Chat',
  //       headerRight: (
  //       navigation.state.routes[navigation.state.index].params !== undefined ?
  //         navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ?
  //           <TouchableOpacity  
  //             onPress = {() => { 
  //               Alert.alert(
  //                 'Delete Chat?',
  //                 'Delete ' + navigation.state.routes[navigation.state.index].params.itemDelete.length + ' selected chats?',
  //                 [ 
  //                     { 
  //                         text: 'Cancel', 
  //                         onPress: () => console.tron.log('Not Deleted'),
  //                         style: ' cancel'
  //                     },
  //                     {
  //                         text: 'DELETE',
  //                         onPress: () => {
  //                           navigation.state.routes[navigation.state.index].params.handleSave(navigation.state.routes[navigation.state.index].params.itemDelete),
  //                           navigation.state.routes[navigation.state.index].params.handleBack(navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : navigation.state.routes[navigation.state.index].params.itemDelete)
  //                         }
  //                     }
  //                 ],
  //                 { cancelable: false }
  //               );  
  //             }}
  //           >
  //             <MaterialIcons style={{margin: 16}} color={colors.black}  name="delete" size={20}/>
  //           </TouchableOpacity> : 
  //           <TouchableOpacity onPress={() => {navigation.setParams({
  //             searchClick: true
  //           })}}>
  //             <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
  //           </TouchableOpacity>  : 
  //           <TouchableOpacity onPress={() => <ChatHeader {...navigation} {...screenProps} />}>
  //             <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
  //           </TouchableOpacity>
  //     )
  //   } 
  // } else if (!navigation.state.routes[navigation.state.index].params.searchClick) {
  //   console.tron.log("2222222222UUUUUUUUUUUUUUUUUUUUU0", navigation)
  //   return {
  //     header: (
  //       <ChatHeader {...navigation} {...screenProps} />
  //       ),
  //     }
  // } else {
  //   console.tron.log("33333333UUUUUUUUUUUUUUUUUUUUU0", navigation)
  //   return {
  //     headerLeft: (  
  //       navigation.state.routes[navigation.state.index].params !== undefined ? 
  //         <HeaderBackButton onPress={() => {  
  //           navigation.state.routes[navigation.state.index].params.handleBack !== undefined ? 
  //             navigation.state.routes[navigation.state.index].params.handleBack(
  //               navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? 
  //               navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
  //               navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : 
  //               navigation.state.routes[navigation.state.index].params.itemDelete) :
  //             navigation.navigate('Home')  
  //         }}/> : 
  //         <HeaderBackButton onPress={() => { navigation.navigate('Home') }}/>
  //     ),
  //     title:  
  //       navigation.state.routes[navigation.state.index].params !== undefined ? 
  //         navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
  //           navigation.state.routes[navigation.state.index].params.itemDelete.length : 'Chat' 
  //       : 'Chat',
  //     headerRight: (
  //       navigation.state.routes[navigation.state.index].params !== undefined ?
  //         navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ?
  //           <TouchableOpacity  
  //             onPress = {() => { 
  //               Alert.alert(
  //                 'Delete Chat?',
  //                 'Delete ' + navigation.state.routes[navigation.state.index].params.itemDelete.length + ' selected chats?',
  //                 [ 
  //                     { 
  //                         text: 'Cancel', 
  //                         onPress: () => console.tron.log('Not Deleted'),
  //                         style: ' cancel'
  //                     },
  //                     {
  //                         text: 'DELETE',
  //                         onPress: () => {
  //                           navigation.state.routes[navigation.state.index].params.handleSave(navigation.state.routes[navigation.state.index].params.itemDelete),
  //                           navigation.state.routes[navigation.state.index].params.handleBack(navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : navigation.state.routes[navigation.state.index].params.itemDelete)
  //                         }
  //                     }
  //                 ],
  //                 { cancelable: false }
  //               );  
  //             }}
  //           ><MaterialIcons style={{margin: 16}} color={colors.black}  name="delete" size={20}/></TouchableOpacity> : 
  //         <TouchableOpacity onPress={() => {navigation.setParams({
  //           searchClick: true
  //         })}}>
  //           <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
  //         </TouchableOpacity>  : 
  //       navigation.state.params === undefined ? 
  //         <TouchableOpacity onPress={() => {navigation.setParams({searchClick: true})}}>
  //           <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
  //         </TouchableOpacity> : 
  //         <TouchableOpacity onPress={() => {navigation.setParams({searchClick: true})}}>
  //             <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
  //           </TouchableOpacity>
  //     )
  //   }
  // }
}
 
const ChatStack = createStackNavigator({ 
 TopTabNavigatorChat: {
  screen: TopTabNavigatorChat,  
  navigationOptions: ({ navigation, screenProps }) => ({    
    headerLeft: (  
      navigation.state.routes[navigation.state.index].params !== undefined ? 
        <HeaderBackButton onPress={() => {  
          navigation.state.routes[navigation.state.index].params.handleBack !== undefined ? 
            navigation.state.routes[navigation.state.index].params.handleBack(
              navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? 
              navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
              navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : 
              navigation.state.routes[navigation.state.index].params.itemDelete) :
            navigation.navigate('Home')  
        }}/> : 
        <HeaderBackButton onPress={() => { navigation.navigate('Home') }}/>
    ),
    title:  
      navigation.state.routes[navigation.state.index].params !== undefined ? 
        navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? 
          navigation.state.routes[navigation.state.index].params.itemDelete.length : 'Chat' 
      : 'Chat',
    headerRight: (
      navigation.state.routes[navigation.state.index].params !== undefined ?
        navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ?
          <TouchableOpacity  
            onPress = {() => { 
              Alert.alert(
                'Delete Chat?',
                'Delete ' + navigation.state.routes[navigation.state.index].params.itemDelete.length + ' selected chats?',
                [ 
                    { 
                        text: 'Cancel', 
                        onPress: () => console.tron.log('Not Deleted'),
                        style: ' cancel'
                    },
                    {
                        text: 'DELETE',
                        onPress: () => {
                          navigation.state.routes[navigation.state.index].params.handleSave(navigation.state.routes[navigation.state.index].params.itemDelete),
                          navigation.state.routes[navigation.state.index].params.handleBack(navigation.state.routes[navigation.state.index].params.itemDelete === undefined ? navigation.state.routes[navigation.state.index].params.itemDelete.length > 0 ? navigation.state.routes[navigation.state.index].params.itemDelete.length : 0 : navigation.state.routes[navigation.state.index].params.itemDelete)
                        }
                    }
                ],
                { cancelable: false }
              );  
            }}
          ><MaterialIcons style={{margin: 16}} color={colors.black}  name="delete" size={20}/></TouchableOpacity> : 
        <TouchableOpacity onPress={() => {navigation.state.routes[navigation.state.index].params.handleSearch()}}>
          <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
        </TouchableOpacity>  : 
      navigation.state.params === undefined ? 
        <TouchableOpacity onPress={() => {navigation.state.routes[navigation.state.index].params.handleSearch()}}>
          <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
        </TouchableOpacity> : 
        <TouchableOpacity onPress={() => {navigation.state.routes[navigation.state.index].params.handleSearch()}}>
            <MaterialIcons style={{margin: 16}} color={colors.black}  name="search" size={24}/>
          </TouchableOpacity>
    )
  }),
 },
 Chat: Chat, 
 SellerInfo: SellerInfo,
 ProfilePhoto: ProfilePhoto
})  
  
const BookExchangeRequestStack = createStackNavigator({
 TopTabNavigator: {
  screen: TopTabNavigator,
  navigationOptions: {
   title: "Book Exchange Request"
  }
 },
 ExchangeRequest: {
  screen: ExchangeRequest,
  navigationOptions:  ({ navigation }) => ({
   title: "Exchange Request",
   headerLeft: (<HeaderBackButton onPress={() => {
    navigation.navigate('ExchangeRequestList')
   }}/>),
   headerTitleStyle: {
    color: colors.primary,
    font: fonts.header,
    marginLeft: -20
   },
  })
 },
 MyRequest: {
  screen: MyRequest,
  navigationOptions:  ({ navigation }) => ({
   title: "My Request",
   headerLeft: (<HeaderBackButton onPress={() => {
    navigation.navigate('MyRequestList')
   }}/>),
   headerTitleStyle: {
    color: colors.primary,
    font: fonts.header,
    marginLeft: -20
   },
  })
 }
},{
 defaultNavigationOptions: ({ navigation}) => {
  return {
   headerLeft: (<HeaderBackButton onPress={() => {
    navigation.navigate('Home')
   }}/>),
   headerTitleStyle: {
    color: colors.primary,
    font: fonts.header,
    marginLeft: -20
   },
   cardStyle: { backgroundColor: '#FFFFFF' },
  }
 }
})

const BookBuySellOfferStack = createStackNavigator({
 BookBuySellOfferStack: {
  screen: BookBuySellOffer,
  navigationOptions: {
   headerTitle: 'Book Buy/ Sell Offer',
  },
 },
});

const SettingsStack = createStackNavigator({
 Settings: {
  screen: Settings,
  navigationOptions: {
   headerTitle: 'Settings',
  },
 },
}, {
 defaultNavigationOptions: {
  cardStyle: { backgroundColor: '#FFF' },
 }
});

const ContactUsStack = createStackNavigator({
 ContactUs: {
  screen: ContactUs,
  navigationOptions: {
   headerTitle: 'Contact Us',
  },
 },
});

const ProfileStack = createStackNavigator({
 Profile: {
  screen: Profile,
  navigationOptions:  ({ navigation }) => ({
   headerLeft: (<HeaderBackButton onPress={() => {
    navigation.navigate('Home')
   }}/>)
  })
 },
 ProfilePhoto: {
  screen: ProfilePhoto,
 /* navigationOptions:  ({ navigation }) => ({
   headerTitle: navigation.state.params.title,
   headerLeft: (<HeaderBackButton onPress={() => {
    navigation.goBack({ routeName: 'Profile' })
   }}/>)
  })*/
/*  navigationOptions: {
   headerTitle: 'Photos',
  },*/
 },
 Book: {
  screen: Book,
  navigationOptions: {
   header: null,
  }
 },
},{
 defaultNavigationOptions: {
  headerTitleStyle: {
   color: colors.primary,
   font: fonts.header,
   marginLeft: -20
  },
  cardStyle: { backgroundColor: '#FFFFFF' },
 }
});

const MainDrawer = createDrawerNavigator({
 Home: HomeStack,
 Profile: ProfileStack,
 Book1: BookStack,
 MyBooks: MyBooksStack,
 ChatScreen: ChatStack,
 MyWishlist: MyWishlistStack,
 BookExchangeRequest: BookExchangeRequestStack,
 BookBuySellOffer: BookBuySellOfferStack,
 Settings: SettingsStack,
 ContactUs: ContactUsStack,
 GPlaceAuto: GPlaceAuto
}, {
 contentComponent: (props) => (
  <Drawer {...props} />
 ),
 cardStyle: { backgroundColor: '#FFFFFF' },
});

const App1 = createSwitchNavigator({
 Starter: AuthLoading,
 Auth: {
  screen: AuthStack,
 },
 App: {
  screen: MainDrawer,
 },
},{
 initialRouteName: 'Starter',
});

export default createAppContainer(App1);
