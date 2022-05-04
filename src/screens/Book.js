import React, {Component} from 'react';
import {Block, Card, Text} from '../components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {
 Image,
 View,
 TouchableOpacity,
 StyleSheet,
 ScrollView,
 AsyncStorage,
 ActivityIndicator,
 FlatList,
 Dimensions
} from 'react-native';
import Swiper from 'react-native-web-swiper';
import {colors} from '../constants/theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getSellerInfo } from '../actions/user.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {theme} from '../constants';
import Loader from '../components/Loader';
import AsyncImage from '../components/AsyncImage';
import {addProductFav, removeProductFav, updateView} from '../actions/product.action';
import {Button} from '../components/Button';
import {exchangeRequest, myRequest} from '../actions/exchange.action';
import {buyChatRoom, createChatRoom} from '../actions/chat.action';
import {BottomSheet, CheckBox} from 'react-native-btr';
import {getBooks} from '../actions/mybooks.action';
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Dialog from 'react-native-dialog';
import Checkbox  from '../components/Checkbox';
import {Input} from '../components/Input';
import { color } from 'react-native-reanimated';
import { NavigationActions, StackActions } from 'react-navigation';

let {width, height} = Dimensions.get('screen');

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

class Book extends Component {

 constructor() {
  super();

  this.state = {
   DATA: [],
   data: '',
   isLoading: false,
   exchangeWith: '',
   visible: false,
   loader: false,
   visibleBuy: false,
   offer: 0,
   offerError: '',
   uid: '',
   width, 
   height
  }

  this.CheckedArrObject = new SelectedCheckboxes();

  // this.storeRowRef = this.storeRowRef.bind(this);
 }

 componentDidMount = async() => {
  const { exchange, chat, userReducer } = this.props
  console.log("DID Book", this.props.navigation.state.params.views)
 // this.setState({data: this.props.navigation.state.params.data !== undefined ? this.props.navigation.state.params.data : ''})
  if (!userReducer.SellerData.some(element => element.sid === this.props.navigation.state.params.data.modified_by)) {
   await this.props.dispatch(getSellerInfo(this.props.navigation.state.params.data.modified_by))
  }

  const uid = await AsyncStorage.getItem('uid')
  this.setState({
   uid: uid
  })
  if (!exchange.MyRequest) {
   await this.get_my_request_list(uid)
  }

  if (this.props.navigation.state.params.From !== "MyBooks") {
   console.log("okkkgg")
   await this.props.dispatch(updateView(this.props.navigation.state.params.PID))
  }

  if (chat.BuyChatRoom.length === 0) {
   await this.props.dispatch(buyChatRoom(uid))
  }

  await AsyncStorage.getItem('MyView')  

  await this.props.dispatch(getBooks(uid))
 }

 async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
  const { exchange } = this.props 
  console.log("componentDidUpdateReq y Reqqqqqqqqqqqqqqqq", JSON.stringify(prevProps.exchange.MyRequest) === JSON.stringify(exchange.MyRequest))

  if (JSON.stringify(prevProps.exchange.MyRequest) !== JSON.stringify(exchange.MyRequest)) {
   console.log("My Req componentDidUpdateReq Updateqqqqqq", prevProps.exchange.MyRequest, exchange.MyRequest)
   const uid = await AsyncStorage.getItem('uid')
   await this.get_my_request_list(uid)
  }
 }

 componentWillUnmount = () => {
  console.log("componentWillUnmountcomponentWillUnmountcomponentWillUnmount")
  this.setState({
   visible: false,
   visibleBuy: false,
  })
 }

 get_my_request_list = async (uid) => {
  const { exchange } = this.props
  console.log("get_my_request_list")
  await this.props.dispatch(myRequest(uid))
 }

 selectItem = async data => {
  console.log("selectItem1", data)
  const { product } = this.props;
  const uid = await AsyncStorage.getItem('uid');

  if (product.FavData.product_id.indexOf(data) !== -1) {
   await this.props.dispatch(removeProductFav(uid, data))
  } else {
   await this.props.dispatch(addProductFav(uid, data))
  }
 };

 /*storeRowRef(rowRef) {
  console.log("reff", rowRef);
  this.rowRefs.push(rowRef);
 }*/

 month_name = (dt) => {
  const mlist = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  return mlist[dt];
 };

 renderSellerInfo = () => {
  const { userReducer, product} = this.props
  //this.setState({isLoading: false})
  console.log("renderSellerInfo123", userReducer.SellerData)
  return(
    userReducer.SellerData.map((u) => {
     if (u.sid === this.props.navigation.state.params.data.modified_by) {
      return (
       <TouchableOpacity activeOpacity={0.7} onPress={() => {this.props.navigation.navigate("SellerInfo", {
        SellerData: u,
        backScreen: "Book",
        img: this.props.navigation.state.params.data,
        phone_visible: this.props.navigation.getParam("data").phone_visible
       })}}>
        <Block onPress={() => {this.props.navigation.navigate("MyBooks")}} row center flex={false}
               style={{height: 80,  borderBottomWidth: 1, borderBottomColor: "#FFF", justifyContent: 'space-between'}}>

         {u.user.imageUrl !== '' && u.user.imageUrl !== undefined ?
          <Image source={{uri: u.user.imageUrl}} style={{width: 50, height: 50, borderRadius: 50/ 2, marginRight: 16}}/>
          :
          <MaterialIcons
          style={{marginRight: theme.sizes.base, borderRadius: 56/ 2,}}
          color={theme.colors.gray} name="account-circle" size={56}/> }

         <Block>
          {!u.user ?  <Loader /> : <Text h3 capital>{u.user.name}</Text>}
          {!u.user ?  <Loader /> :
           <Text h4 gray>
            Member since {u.user.signUpSince}
           </Text>}
         </Block>
         <MaterialIcons style={{marginLeft: 65}} color={"#000"} name="keyboard-arrow-right" size={24}/>
        </Block>
       </TouchableOpacity>
      )
     }
    })
  )
 }

 exchangeWith = async () => {
console.log("HHHBHJBKBKBJ", this.state.visible)
 }

 _toggleBottomNavigationView = () => {
  //Toggling the visibility state of the bottom sheet
  this.setState({ visible: !this.state.visible });
 };

 _toggleBottomNavigationBuyView = () => {
  //Toggling the visibility state of the bottom sheet
  this.setState({ visibleBuy: !this.state.visibleBuy });
 };

 emptyBookList = () => {
  return (
   <Block>
    <Text h2 center style={{paddingBottom: 32}}>You have not upload any book.</Text>
    <Button
     title={"Add Book"}
     onPress = { () => {this.props.navigation.navigate("AddProduct"); this._toggleBottomNavigationView()}}
    />
   </Block>
  )
 }

 getUnique(arr, index) {
  const flagList = []
  arr.filter(function(item) {
   if (flagList.indexOf(item[index]) === -1) {
    //if (item.status == 'active') {
     console.log("1111", item.status)
     flagList.push(item)
     return true
    //}
   }
  })
  return {arr: flagList, length: flagList.length}
 }

 _handleLayout = event => {
    this.setState({
        width: event.nativeEvent.layout.width,
        height: event.nativeEvent.layout.height
    });
  }

 myBookList = () => {
  const { myBooks } = this.props;
  let data = this.getUnique(myBooks.MyBooks,'Product_id')
  console.log("myBookList121", this.CheckedArrObject.fetchArray().length)
  return (
   <Block
    onLayout={this._handleLayout}
    flex={false}
    style={[{backgroundColor: colors.white,  padding: 8, borderTopLeftRadius: 16, borderTopRightRadius: 16},
     myBooks.MyBooks !== undefined && data.length > 0 && this.state.width > 480 ?  {height: 250} : {height: 200*2}]}>
    <Block>
      <Text h2 style={{marginVertical: 8}} medium color={colors.primary} >Exchange with: </Text>
      <ScrollView>
      <FlatList
       // style={{padding: 16,}}
        data={data.arr}
        numColumns={1}
        keyExtractor={(item, index) => item.id }
        renderItem={({item, index}) => {
        return (
          
          <Block>
          <Card 
            shadow
            style={[{
            width: '99.5%',
            height: 96,
            marginTop: 1,
            padding: 0,
            borderLeftWidth: 4
            }, item.status == 'active' || item.status == 'available' ? {borderLeftColor: colors.primary,} : {borderLeftColor: 'gray',}]}
          >
            <Block  row style={{height: 96, zIndex: 99, padding: 12, elevation: 3,}}>
            <Block flex={false} row style={{flex: 8,}}>
              <Image style={{width: 50, height: 70, marginRight: 16}} source={{uri: item.url[0].url}}/>
              <TouchableOpacity
              onPress={() => this.props.navigation.navigate(
                "Book", {
                data: item,
                PID: item.Product_id,
                From: "MyBooks",
                views: myBooks.NumberOfViewsAndFav !== undefined ? myBooks.NumberOfViewsAndFav.find((data) => {
                  if (data.pid === item.Product_id) {
                  return data
                  }
                }) : null
                }
              )}
              >
              <Block middle>
                <Text h3 color={"#000"} style={{marginBottom: 4}}>{item.title.substring(0, 30)}</Text>
                <Text h3 medium color={"#000"}><FontAwesome name="rupee" size={13}/> {item.price}</Text>
              </Block>
              </TouchableOpacity>
              </Block>
              <Block center middle style={{flex: 1, }}>
              <Checkbox
                size={20}
                keyValue={item.Product_id}
                checked={false}
                color={colors.primary}
                labelColor="#000000"
                value={item.title}
                checkedObjArr={this.CheckedArrObject}/>
              </Block>
            </Block>
          </Card>
          </Block>
          
        )
        }
        }
        onScrollEndDrag={this.retrieveMore}
      />
      </ScrollView>
     </Block>
      <Button title={"Continue to Exchange"} onPress={() => {this.exchange(); this.setState({loader: true})}} />
   </Block>
  )
 }

 exchange = async () => {
  const { userReducer } = this.props
  console.log("this.CheckedArrObject.fetchArray()", this.CheckedArrObject.fetchArray().length)
  const uid = await AsyncStorage.getItem('uid')
  await this.props.dispatch(exchangeRequest(uid, userReducer.user.name,
   this.props.navigation.state.params.PID, this.props.navigation.getParam("data").title,
   this.props.navigation.state.params.data.modified_by, this.CheckedArrObject.fetchArray())
  )
  this.setState({
   visible: false,
   loader: false
  })
  this.props.navigation.navigate("MyRequestList")
 }

 makeOffer = () => {
  const { chat, userReducer } = this.props

  let thread = ''
  chat.BuyChatRoom.find(
   (element) => {
    if(element.pid === this.props.navigation.getParam("PID") && element.offer !== '') {
     thread = element._id
    }
   })

  return (
   chat.BuyChatRoom.length > 0 ?
    chat.BuyChatRoom.find(element => element.pid === this.props.navigation.getParam("PID") && element.offer !== '')  ?
     <Block
      flex={false}
      style={{backgroundColor: colors.white, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 16,
       borderTopLeftRadius: 16, borderTopRightRadius: 16, height: 200}}
     >
      <Text h2 medium color={colors.primary} style={{padding: 16}}>Already apply offer Found</Text>
      <Button style={{marginVertical: 32}} title={"Continue to Chat"}  onPress={() => {
       this.props.navigation.navigate(
        "Chat", {
         thread: thread,
         uid: this.state.uid,
         backScreen: 'Book',
         SellerData: userReducer.SellerData.find(element => element.sid === this.props.navigation.state.params.data.modified_by)
        }
       ); this._toggleBottomNavigationBuyView()}} />
     </Block>
     :
     <Block
      flex={false}
      style={{backgroundColor: colors.white, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 16,
       borderTopLeftRadius: 16, borderTopRightRadius: 16, height: 200}}
     >
      <Text h2 medium color={colors.primary} >Make Offer: </Text>
      <Input
       placeholder={"Please enter book price"}
       InputTitle={"Book Price"}
       keyboardType='numeric'
       onChangeText={(text) => this.setState({offer: text})}
      />
      <Text h4 color={'red'}>{this.state.offerError}</Text>
      <Button style={{marginVertical: 32}} title={"Buy"} onPress={() => {this.buy(); }} />
     </Block>
    : <Block
     flex={false}
     style={{backgroundColor: colors.white, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 16,
      borderTopLeftRadius: 16, borderTopRightRadius: 16, height: 200}}
    >
     <Text h2 medium color={colors.primary} >Make Offer: </Text>
     <Input
      placeholder={"Please enter book price"}
      InputTitle={"Book Price"}
      keyboardType='numeric'
      onChangeText={(text) => this.setState({offer: text})}
     />
     <Text h4 color={'red'}>{this.state.offerError}</Text>
     <Button style={{marginVertical: 32}} title={"Buy"} onPress={() => {this.buy(); }} />
    </Block>
  )
 }

 alreadyApplyForBuy = (thread) => {
  const { userReducer } = this.props

  return (
   <Block
    flex={false}
    style={{backgroundColor: colors.white, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 16,
     borderTopLeftRadius: 16, borderTopRightRadius: 16, height: 200}}
   >
    <Text h2 medium color={colors.primary} style={{padding: 16}}>Already apply offer Found</Text>
    <Button style={{marginVertical: 32}} title={"Continue to Chat"}  onPress={() => {
     this.props.navigation.navigate(
      "Chat", {
       thread: thread,
       uid: this.state.uid,
       backScreen: 'Book',
       SellerData: userReducer.SellerData.find(element => element.sid === this.props.navigation.state.params.data.modified_by)
      }
     ); this._toggleBottomNavigationBuyView()}} />
   </Block>
  )
 }

 buy = async () => {
  const { userReducer } = this.props
  if (this.state.offer <= 0) {
   this.setState({
    offerError: "Please enter valid offer.",
    loader: false
   })
  } else {
   this.setState({offerError: '', loader: false})
   const senderId = await AsyncStorage.getItem('uid')
   const { chat } = this.props
   const uid = await AsyncStorage.getItem('uid')
   const SellerData = userReducer.SellerData.find(element => element.sid === this.props.navigation.state.params.data.modified_by)
   console.log("SellerDataSellerDataSellerData", SellerData)
   await this.props.dispatch(createChatRoom(
    this.props.navigation, senderId,
    this.props.navigation.state.params.data.modified_by,
    this.props.navigation.getParam("PID"),
    this.state.offer,
    SellerData
   ))
   console.log("BuyChatRooooooom", chat.CreateChatRoom, chat)
   this.setState({
    visibleBuy: false,
   })
  }
 }

 continueToExchangeChat = () => {
  const { exchange } = this.props
  console.log("continueToExchangeChat4", exchange.MyRequest.find((element) => element.data.pid === this.props.navigation.getParam("PID")))
  console.log("continueToExchangeChat1111", this.props.navigation.getParam("PID"), exchange.MyRequest)
  return(
   <Block
    flex={false}
    style={{backgroundColor: colors.white, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 16,
     borderTopLeftRadius: 16, borderTopRightRadius: 16, height: 200}}
   >
    <Text h2 medium color={colors.primary} style={{paddingBottom: 16}}>Already apply for exchange</Text>

    <Button title={"VIEW REQUEST"} textStyle={{fontFamily: "Roboto-Medium", fontSize: 16}} small shadow white extraStyle={{marginVertical: 16}} onPress={() => {this.props.navigation.navigate("MyRequest", {
     item: exchange.MyRequest.find((element) => element.data.pid === this.props.navigation.getParam("PID"))
    }); this._toggleBottomNavigationView()}} />

    <Button shadow title={"Continue To Chat"} onPress={() => {this.continueToChatExchange(); this._toggleBottomNavigationView()}} />
   </Block>
  )
 }

 continueToChatExchange = async () => {
  const { userReducer, chat } = this.props
  console.log("CreateChatRoomCreateChatRoom123466", chat)

  let thread = ''
  chat.BuyChatRoom.find(
   (element) => {
    if(element.pid === this.props.navigation.getParam("PID") && element.senderId === this.state.uid && element.offer === '') {
     thread = element._id
    }
   })

  chat.SellChatRoom.find(
   (element) => {
    if(element.pid === this.props.navigation.getParam("PID") && element.receiverId === this.state.uid && element.offer === '') {
     thread = element._id
    }
   })

  this.props.navigation.navigate(
    "Chat", {
     thread: thread,
     uid: this.state.uid,
     backScreen: 'Book',
     pid: this.props.navigation.getParam("PID"),
     receiverId: this.props.navigation.state.params.data.modified_by,
     SellerData: userReducer.SellerData.find(element => element.sid === this.props.navigation.state.params.data.modified_by)
    }
   )

  // if (thread !== '') {
  //  this.props.navigation.navigate(
  //   "Chat", {
  //    thread: thread,
  //    uid: this.state.uid,
  //    backScreen: 'Book',
  //    SellerData: userReducer.SellerData.find(element => element.sid === this.props.navigation.state.params.data.modified_by)
  //   }
  //  )
  // } else {
  //  const senderId = await AsyncStorage.getItem('uid')
  //  const SellerData = userReducer.SellerData.find(element => element.sid === this.props.navigation.state.params.data.modified_by)
  //  console.log("SellerDataSellerDataSellerDataxxxxxx", SellerData)
  //  await this.props.dispatch(createChatRoom(
  //   this.props.navigation, senderId,
  //   this.props.navigation.state.params.data.modified_by,
  //   this.props.navigation.getParam("PID"),
  //   "",
  //   SellerData
  //  ))
  // }
 }

 render() {
  const { data } = this.props.navigation.getParam("data");
  const { userReducer, product, myBooks, exchange, chat } = this.props;
  console.tron.log("duta 12", exchange)
  let thread = ''
  
  return (
    exchange.MyRequest ? <Block>
     <Block style={{justifyContent: 'flex-end'}}>
      <ScrollView style={{marginBottom: 40,}}>
       <Block container>
        <Block  row flex={false} style={{justifyContent: 'space-between',}}>
         <TouchableOpacity style={{marginLeft: -5, paddingVertical: 8}} onPress={() => {
            this.props.navigation.navigate("Home") }}>
            {/* // this.props
            //    .navigation
            //    .dispatch(StackActions.reset(
            //      {
            //         index: 0,
            //         //key: 'HomeStack',
            //         actions: [
            //           NavigationActions.navigate({ routeName: 'Home'})
            //         ]
            //       }));}}> */}
          <MaterialIcons  name={"close"} size={26} color={"#000"} />
         </TouchableOpacity>

         <MaterialIcons style={{paddingVertical: 12}} name={"share"} size={24} color={"#000"} />
        </Block>
        <Block flex={false} center>
         <Block flex={false} style={styles.container}>
          <Swiper
           activeDotColor={colors.primary}
           controlsProps={{ DotComponent: ({ index, isActive, onPress }) => {
             if (isActive) {
              return <Entypo name={"dot-single"} size={36} color={colors.primary} style={{width: 22, marginTop: 32}}/>;
             }
             return <Entypo name={"dot-single"} size={36} color={colors.gray} style={{width: 22,marginTop: 32}}/>;
            }, prevTitle: '', nextTitle: '',}}>
           {
            this.props.navigation.state.params.data.url !== undefined ?
             this.props.navigation.state.params.data.url.map((image, index) => (
              <View style={styles.slideContainer}>
             {console.log("imank", image)}
             <TouchableOpacity activeOpacity={0.1} onPress={() => {this.props.navigation.navigate("ProfilePhoto", {
              img: this.props.navigation.state.params.data,
              index: index,
              key: image.url,
              backScreen: "Book",
              headerTitle: "Book Photo"
             })}} style={styles.container}>
              <Image style={this.props.style} source={{uri: image.url}} style={{width: '100%', height: '100%', alignSelf: 'center', flexDirection: 'row',}}/>
             </TouchableOpacity>
            </View>
            )) : null}
          </Swiper>
         </Block>
        </Block>
        <Block style={{marginTop: 16}}>
         {this.props.navigation.state.params.From !== "MyBooks" ? <Block row flex={false} style={{justifyContent: 'space-between',}}>
           <Text h2 medium><FontAwesome name="rupee" size={16} /> {this.props.navigation.getParam("data").price}</Text>
           <TouchableOpacity
            key={this.props.navigation.getParam("PID")}
            onPress={() => this.selectItem(this.props.navigation.getParam("PID"))}
           >
            <MaterialIcons
             backgroundColor="#900"
             borderRadius={0}
             key={this.props.navigation.getParam("data").Product_id}
             size={25}
             color={'red'}
             name={product.FavData.product_id !== undefined ? product.FavData.product_id.indexOf(this.props.navigation.getParam("PID")) !== -1 ? "favorite" : "favorite-border" : 'favorite-border'}
            />
           </TouchableOpacity>
          </Block> :
          <Block>
           <Block row style={{justifyContent: 'space-between',}}>
            <Block row style={{justifyContent: 'center'}}>
             <MaterialIcons style={{paddingTop: 2}} name={"visibility"} size={32} color={"#000"} />
             <Text h1 style={{paddingLeft: 16, marginBottom: 2}}>{this.props.navigation.state.params.views.views !== undefined ? this.props.navigation.state.params.views.views : 0}</Text>
            </Block>
            <Block row style={{justifyContent: 'center'}}>
             <MaterialIcons style={{paddingTop: 2}} name={"favorite"} size={32} color={"red"} />
             <Text h1 style={{paddingLeft: 16, marginBottom: 2}}>{this.props.navigation.state.params.views.favorite !== undefined ? this.props.navigation.state.params.views.favorite : 0}</Text>
            </Block>
           </Block>
          </Block> }
         <Block
          flex={false}
          style={{
           borderBottomColor: colors.gray2,
           borderBottomWidth: 2,
           width: '120%',
           alignSelf: 'center',
           marginTop: 8,
           marginBottom: 10
          }}
         />
         { this.props.navigation.state.params.From === "MyBooks" ? <Text headerLight medium><FontAwesome name="rupee" size={18} /> {this.props.navigation.getParam("data").price}</Text> : null}

         <Text h3 >{this.props.navigation.getParam("data").title}</Text>
         <Block row flex={false} style={{marginTop: 8, marginLeft: -3}}>
          <MaterialIcons style={{marginTop: 2}} color={colors.primary}  name="location-on" size={18}/>
          <Text h3 capital>
           {this.props.navigation.getParam("data").location}
          </Text>
         </Block>
         <Text h4 gray style={{marginLeft: 2}}>{this.props.navigation.getParam("data").distance} km far from your location</Text>
         <Block
          flex={false}
          style={{
           borderBottomColor: colors.gray2,
           borderBottomWidth: 2,
           width: '120%',
           alignSelf: 'center',
           marginTop: 8,
           marginBottom: 10
          }}
         />
        </Block>
        <Block>
         <Text h2 medium>Description</Text>
         <Text h3>{this.props.navigation.getParam("data").description} ooopp jjkl</Text>
         <Text h2 medium style={{marginTop: 8}}>Author</Text>
         <Text h3 capital>{this.props.navigation.getParam("data").author}</Text>
         <Block
          flex={false}
          style={{
           borderBottomColor: colors.gray2,
           borderBottomWidth: 2,
           width: '120%',
           alignSelf: 'center',
           marginTop: 8,
           marginBottom: 10
          }}
         />
        </Block>
        { this.props.navigation.state.params.From !== "MyBooks" ? <Block>
         <Text h2 medium>Seller Details</Text>
         {userReducer.SellerData !== undefined ? this.renderSellerInfo() : <ActivityIndicator animating={this.state.isLoading} />}
        </Block> : null}
       </Block>
      </ScrollView>
      <Block row style={{width: '100%',
       justifyContent: 'space-between', zIndex: 999, elevation: 3, position: 'absolute',}}>
       <Button
        half
        isLoading={this.state.isLoading}
        extraStyle={(exchange.MyRequest.some((n) => {
         if (this.props.navigation.getParam("PID") === n.data.pid) {
          return true
         } else {
          return false
         }
        })) ? {backgroundColor: colors.gray} : {backgroundColor: colors.primary}}

        onPress={this._toggleBottomNavigationView}
        title={"Exchange"} />
       <Button
        half
        isLoading={this.state.isLoading}
        onPress={this._toggleBottomNavigationBuyView}
        title={"Buy"} />
      </Block>
     </Block>
     <BottomSheet
      visible={this.state.visible}
      //setting the visibility state of the bottom shee
      onBackButtonPress={this._toggleBottomNavigationView}
      //Toggling the visibility state on the click of the back botton
      onBackdropPress={this._toggleBottomNavigationView}
      //Toggling the visibility state on the clicking out side of the sheet
     >

      {myBooks.MyBooks !== undefined && myBooks.MyBooks.length > 0 ?
       exchange.MyRequest.some((n) => {
        //return this.props.navigation.getParam("PID") !== n
        if (this.props.navigation.getParam("PID") === n.data.pid) {
         return true
        } else {
         return false
        }
       }) ? this.continueToExchangeChat() :
       this.myBookList() :
       this.emptyBookList()
      }
      {this.state.loader ? <Loader/> : null}
     </BottomSheet>
     <BottomSheet
      visible={this.state.visibleBuy}
      //setting the visibility state of the bottom shee
      onBackButtonPress={this._toggleBottomNavigationBuyView}
      //Toggling the visibility state on the click of the back botton
      onBackdropPress={this._toggleBottomNavigationBuyView}
      //Toggling the visibility state on the clicking out side of the sheet
     >
      {
       this.makeOffer()
      }
      {this.state.loader ? <Loader/> : null}
     </BottomSheet>
    </Block> : <Loader/>
  );
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

const mapStateToProps = (state) => ({
 userReducer: state.userReducer,
 product: state.product,
 exchange: state.exchangeReducer,
 myBooks: state.myBooksReducer,
 chat: state.chatReducer
})

const mapDispatchToProps = (dispatch) => ({
 dispatch
});

export default compose(
 connect(mapStateToProps, mapDispatchToProps),
)(Book);
