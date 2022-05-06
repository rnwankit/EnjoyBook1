import React, { Component } from 'react'
import {
 Dimensions,
 Image,
 StyleSheet,
 ScrollView,
 TouchableOpacity,
 Platform,
 StatusBar,
 FlatList,
 AsyncStorage,
 ImageBackground,
 ActivityIndicator,
 View
} from 'react-native';

import { theme, mocks } from '../constants';
import Cards from '../components/Cards';
import {compose} from "redux";
import {connect} from "react-redux";
import Animated from "react-native-reanimated";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {getUser, notificationList} from '../actions/user.action';
import {getProduct, addProductFav, getProductFav, removeProductFav} from '../actions/product.action';
import firestore from '@react-native-firebase/firestore';


import Orientation from 'react-native-orientation-locker';
import {colors, sizes} from '../constants/theme';
import {BottomTabBar} from 'react-navigation-tabs';
import { get_category_list } from '../actions/category.action';
import { Text, Block, Card } from '../components';
import Loader from '../components/Loader';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomBar from '../components/BottomBar';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';

//const { width } = Dimensions.get('window');
const HEADER_HEIGHT = Platform.OS == 'ios' ? 60 : 88;

const scrollY = new Animated.Value(0);
const diffClampScrollY = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);

let {width, height} = Dimensions.get('screen');

class Home extends Component {

 constructor() {
    super();
    this.rowRefs = [];
    this.storeRowRef = this.storeRowRef.bind(this);
    //this._renderRow = this._renderRow.bind(this);
    this.state = {
     uid: '',
     isLoading: true,
     flagImage: false,
     fill: false,
     data: [],
     limit: 6,
     // startAt removed.  start at the end of data
     loading: false,
     DATA: [],
     product: '',
     isSelect: false,
     width,
     height
    }

    // AsyncStorage.setItem('uid', 'J5x6ltQG4Tg1LKQxN1N8a8EH1Iw1');
  }

 storeRowRef(rowRef) {
  this.rowRefs.push(rowRef);
  console.log("reff", rowRef);
 }

 async componentDidMount() {
  messaging().onNotificationOpenedApp(remoteMessage => {
   console.log(
    'Notification caused app to open from background state:',
    remoteMessage.notification,
   );
   this.props.navigation.navigate(remoteMessage.data.type);
  });
/*  console.log("Hommee Did")
  let fcmToken = await firebase.iid().getToken();
  console.log("MY token unique", fcmToken)*/
  //await AsyncStorage.setItem('fcmToken', '0');
  const uid = await AsyncStorage.getItem('uid');
  console.log("componentDidMount get_category_list before")
  await this.get_category_list();
  console.log("componentDidMount get_category_list after")
  await this.get_user_info();

  //await this.getProduct(uid);
  await this.props.dispatch(getProductFav(uid))

  this.props.navigation.setParams({
   headerY: new Animated.interpolate(diffClampScrollY, {
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT]
   }),
  });
   this.setState({ categories: this.props.categories, uid: uid });

  // await this.props.dispatch(notificationList(uid))
 }

 async checkPermission() {
  const enabled = await messaging().hasPermission();
  if (enabled) {
  // this.getToken();
  } else {
   //this.requestPermission();
  }
 }

 getProduct = async (uid, lat, lng) => {
  console.log("piyuuuu",)
  const product = await this.props.dispatch(getProduct(uid, lat, lng))
  this.setState({
   product: product
  })
 }

 get_category_list = () => {
  console.log("get_category_list in")
  this.props.dispatch(get_category_list())
  console.log("get_category_list out")
 }

 get_user_info = async () => {
  const {createUser} = this.props;
  console.log("before get_user_info", this.state.uid)
  await this.props.dispatch(getUser(await AsyncStorage.getItem('uid')));
  let userAllData = await AsyncStorage.getItem('userAllData');
  console.log("after get_user_info async", JSON.parse(userAllData).lat)
  this.setState({isLoading: false})
  this.getProduct(await AsyncStorage.getItem('uid'), JSON.parse(userAllData).lat, JSON.parse(userAllData).lng)
 }

 handleTab = tab => {
    const { categories } = this.props;
    const filtered = categories.filter(
      category => category.tags.includes(tab.toLowerCase())
    );

    this.setState({ active: tab, categories: filtered });
 };

  renderTab(tab) {
    const { active } = this.state;
    const isActive = active === tab;

    return (
      <TouchableOpacity
        key={`tab-${tab}`}
        onPress={() => this.handleTab(tab)}
        style={[
          styles.tab,
          isActive ? styles.active : null
        ]}
      >
        <Text size={16} medium gray={!isActive} secondary={isActive}>
          {tab}
        </Text>
      </TouchableOpacity>
    )
  }

  selectItem = async data => {
   const { product } = this.props;
   const uid = await AsyncStorage.getItem('uid');
   if (product.FavData.product_id !== undefined) {
    if (product.FavData.product_id.indexOf(data.Product_id) !== -1) {
     await this.props.dispatch(removeProductFav(uid, data.Product_id))
    } else {
     await this.props.dispatch(addProductFav(uid, data.Product_id))
    }
   } else {
    await this.props.dispatch(addProductFav(uid, data.Product_id))
   }
  };

  favourite = (id) => {
   console.log("iddd", id);
  this.setState({
   flagImage:!this.state.flagImage,
   fill: true
  });

  this.rowRefs[id-1].setNativeProps({
   style: {
    color: 'blue',
   },
  })
 }

 retrieveMore = async () => {
  console.log("lasttttt");
 };

 favProduct (id, pid) {
  console.log("favProduct", pid)
  const { product } = this.props
  if (pid == product.FavData.product_id) {
   this.setState({isSelect: true})
   return (
    <MaterialIcons
     backgroundColor="#900"
     borderRadius={0}
     key={id}
     ref={(ref)=>this.storeRowRef(ref)}
     size={25}
     color={'red'}
     //name={product.FavData.product_id.map() item.isSelect === false ? "favorite-border" : "favorite"}
     name={"favorite-border"}
    />
   )
  } else {
   this.setState({isSelect: false})
   return (
    <MaterialIcons
     backgroundColor="#900"
     borderRadius={0}
     key={item.id}
     ref={(ref)=>this.storeRowRef(ref)}
     size={25}
     color={'red'}
     //name={product.FavData.product_id.map() item.isSelect === false ? "favorite-border" : "favorite"}
     name={"favorite"}
    />
   )
  }
 } 

 _handleLayout = event => {
    this.setState({
        width: event.nativeEvent.layout.width,
        height: event.nativeEvent.layout.height
    });
  }

 renderHome () {
  const { createCategory, product } = this.props;
  
  width = this.state.width;
  height = this.state.height;

  return(
    <Block>
      <BottomBar onPress={this.props.navigation.dispatch} onNav={this.props.navigation} />
      <Animated.ScrollView
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: HEADER_HEIGHT,  }}
        onScroll={Animated.event([
          {
          nativeEvent: { contentOffset: {y: scrollY} }
          }
        ])}
        style={{paddingTop:HEADER_HEIGHT,}}
      >
        <Block container>
          <Block onLayout={this._handleLayout}>
            <Text h2 medium color={colors.primary} style={{marginVertical: 16}}>Browse categories</Text>
            <FlatList
              columnWrapperStyle={{flex: 1,justifyContent: 'space-between'}}
              data={createCategory.dataSource !== undefined ?
                createCategory.dataSource.sort((a, b) => (a.value > b.value) ? 1 : -1) : ""
              }
              numColumns={3}
              keyExtractor={(item, index) => item.key }
              renderItem={({item, index}) =>{
                if (index < 8) {  
                return (
                  <TouchableOpacity onPress={() => this.props.navigation.navigate(
                    "SubCategories", {
                      catId: item.key,
                      catName: item.value
                    }
                  )}>
                    <Card middle center shadow
                      style={{
                        width: this.state.width/3.6,
                        height: 26,
                        marginHorizontal: 2,
                        marginTop: 1,
                        paddingHorizontal: 4,
                        paddingVertical: 20, 
                      }}
                    >
                      <Text h3 center>
                        {
                          this.state.width/3.6 < 92 ? 
                            (item.value).length > 10 ? 
                              (item.value).substring(0,8) +  ".." : 
                              item.value :
                          item.value
                        }    
                      </Text>
                    </Card>
                  </TouchableOpacity>
                )
                } else if(index === 8) {
                return (
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("Categories")}>
                    <Card middle center shadow
                        style={{
                          width: this.state.width/3.6,
                          height: 26,
                          marginHorizontal: 2,
                          marginTop: 1,
                          paddingHorizontal: 0,
                          paddingVertical: 20, 
                        }}>
                    <Text h3>View All</Text>
                  </Card>
                  </TouchableOpacity>
                )
                }
              }
            }
            />
        </Block>
          <Block style={{marginBottom: 40}} onLayout={this._handleLayout} flex={false}>
          <Text h2 medium color={colors.primary} style={{ marginVertical: 16}}>Books near you</Text>
          <FlatList
            //columnWrapperStyle={{justifyContent: 'space-between'}}
            data={product.Products !== undefined ? product.Products : ""}
            numColumns={this.state.width > 480 ? 3 : 2}
            key={(this.state.width > 480 ? 'h' : 'v')}
            keyExtractor={(item, index) => item.id }
            renderItem={({item, index}) =>{
              if (index != 8) {
              return (
                <TouchableOpacity onPress={() => this.props.navigation.navigate(
                "Book", {
                  data: item,
                  PID: item.Product_id,
                  From: ''
                }
                )}> 
                <Card shadow
                  style={{
                    width: this.state.width > 480 ? this.state.width/3.2 : this.state.width/2.13,
                    borderRadius: 4,
                    height: 210,
                    margin: 0,
                    overflow: 'hidden',
                    marginHorizontal: 6,
                    padding: 0
                  }}> 
                    <TouchableOpacity 
                      key={item.id}
                      onPress={() => this.selectItem(item)}
                      style={{position: 'absolute', zIndex: 1000, top: 5, right: 4}}
                    >
                      <MaterialIcons
                        backgroundColor="#900"
                        borderRadius={0}
                        key={item.id}  
                        ref={(ref)=>this.storeRowRef(ref)}
                        size={25}
                        color={'red'}
                        //name={product.FavData.product_id.map() item.isSelect === false ? "favorite-border" : "favorite"}
                        name={product.FavData.product_id !== undefined ? product.FavData.product_id.indexOf(item.Product_id) !== -1 ? "favorite" : "favorite-border" : 'favorite-border'}
                      />
                    </TouchableOpacity>
                    <Block center flex={false}>
                     <Image style={{width: this.state.width > 480 ? this.state.width/3.2 : this.state.width/2.1, height: 154}} source={{uri: item.url[0].url}} />
                    </Block>
                    <Block flex={false} style={{padding: 8, justifyContent: 'space-around'}}>
                      <Text h3 bold><FontAwesome name="rupee" size={13} /> {this.state.width}</Text>
                      <Text h4>{item.title.substring(0,17)}</Text>
                      <Block row>
                        <MaterialIcons style={{marginTop: 2}} color={colors.primary}  name="location-on" size={13}/>
                        <Text h5>
                          {item.location.length > 20 ? item.location.substring(0,20) + "..." : item.location}
                        </Text>
                      </Block> 
                      {/* <Text caption gray>{item.distance} km ago</Text> */}
                    </Block>
                </Card>
                </TouchableOpacity>
              )
              } else {
              return (
                <Cards loadmore={true} more={"Load More..."} />
              )
              }
            }
            }
            onScrollEndDrag={this.retrieveMore}
          />
          </Block>
        </Block>
    </Animated.ScrollView>
    </Block>
  )
 } 

  render() {
   const { userReducer } = this.props;

    return (
     userReducer.user ? this.renderHome() : <ActivityIndicator animating={this.state.isLoading} />
    )
  }
}

Home.defaultProps = {
  profile: mocks.profile,
  categories: mocks.categories,
};

const mapStateToProps = (state) => ({
 createCategory: state.createCategory,
 createUser: state.createUser,
 userReducer: state.userReducer,
 product: state.product,
 myBooks: state.myBooksReducer,
})

const mapDispatchToProps = (dispatch) => ({
 dispatch
});

export default compose(
 connect(mapStateToProps, mapDispatchToProps),
)(Home);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatar: {
    height: 16 * 2.2,
    width: 16 * 2.2,
  },
  tabs: {
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2,
  },
  tab: {
    marginRight: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base
  },
  active: {
    borderBottomColor: theme.colors.secondary,
    borderBottomWidth: 3,
  },
  categories: {
    flexWrap: 'wrap',
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5,
  },
  category: {
    // this should be dynamic based on screen width
    minWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
  },
 list: {
  backgroundColor: 'black',
  color: 'black'
 },
 selected: {
   backgroundColor: "red",
   color: 'red',
  fontSize: 50
 },
});
