import React, {Component} from 'react';
import {Badge, Block, Card, Text} from '../components';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {buyChatRoom, sellChatRoom, deleteChatList} from '../actions/chat.action';
import {AsyncStorage, FlatList, Image, TouchableOpacity, View, Keyboard} from 'react-native';
import {theme} from '../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, fonts} from '../constants/theme';
import {getBooks} from '../actions/mybooks.action';
import {HeaderBackButton} from 'react-navigation-stack';
import {getProduct} from '../actions/product.action';
import {getSellerInfo} from '../actions/user.action';
import Animated from 'react-native-reanimated';
import ChatHeader from '../components/ChatHeader';

class ExchangeChatRoom extends Component {

  constructor() {
    super();

    this.state = {
      uid: '',
      itemDelete: [],
      itemDeleteColor: '',
      longPress: false,
      searchBarFocused: false,
      searchClick: false
    }
  }

//   static navigationOptions = ({ navigation }) => {
//     const { params } = navigation.state;
//     return params;
// };

 componentDidMount = async () => {
   console.tron.log("componentDidMountExChatRoom")
  const { myBooks, userReducer, chat } = this.props
  this.props.navigation.setParams({
    itemDelete: [],
    searchClick: false,
    handleSearch: this._handleSearch,
    handleBack: this._handleBack
  })

  this.keyboardDidShow = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
  this.keyboardWillShow = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
  this.keyboardWillHide = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)

  const uid = await AsyncStorage.getItem('uid')
  this.setState({uid: uid})

  await this.get_chat_list_room_sell(uid)

  if (myBooks.MyBooks.length <= 0) {
   await this.props.dispatch(getBooks(uid))
  }

  if (chat.BuyChatRoom.length === 0) {
   await this.get_chat_list_room_buy(uid)
  }

  if (chat.SellChatRoom.length === 0) {
   await this.get_chat_list_room_sell(uid)
  }

  // this.props.navigation.addListener('willFocus', (route) => { 
  //   console.tron.log("willFocusExChatRoom")
  //   this.props.navigation.setParams({
  //     handleSearch: this._handleSearch,
  //     itemDelete: [],
  //   })
  // })

  this.props.navigation.addListener('didBlur', (route) => { 
    console.tron.log("didBlurExChatRoom")
    //route.state.params = undefined; 
       this.setState({
        itemDelete: [],
        itemDeleteColor: '',
        longPress: false, 
        searchClick: false
      })
      this.props.navigation.setParams({
        itemDelete: [],
        searchClick: false
      })
      //console.tron.log("EEEEEEEEEEEE", this.props.navigation)
      // if (this.props.navigation.state.params !== undefined) {
      //   this.props.navigation.state.params == undefined
      //   console.tron.log("SEA EX", this.props.navigation.state)
      // } else {
      //   this.props.navigation.setParams({
      //     itemDelete: [],
      //     searchClick: false
      //   })
      // }
        
      //this.props.navigation.state.params.searchClick = false
    console.tron.log("Tab ChangedEX", this.props.navigation) 
  });
 }

keyboardDidShow = () => {
  this.setState({ searchBarFocused: true })
}

keyboardWillShow = () => {
  this.setState({ searchBarFocused: true })
}

keyboardWillHide = () => {
  this.setState({ searchBarFocused: false })
}

 async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
  const { chat } = this.props
  if (prevProps.chat.BuyChatRoom.length !== chat.BuyChatRoom.length) {
   await this.get_formatted_list_buy(this.state.uid)
  }

  if (prevProps.chat.SellChatRoom.length !== chat.SellChatRoom.length) {
   await this.get_formatted_list_sell(this.state.uid)
  }
 }

 _handleSearch = () => {
  this.props.navigation.setParams({
    searchClick: true
  })
    console.tron.log("Clicked From ExChatRoom", this.props.navigation)
 }

 get_chat_list_room_buy = async (uid) => {
  await this.props.dispatch(buyChatRoom(uid))
 }

 get_chat_list_room_sell = async (uid) => {
  const { chat } = this.props
  await this.props.dispatch(sellChatRoom(uid))
 }

 get_formatted_list_buy = async () => {
  const { chat, userReducer } = this.props
  let receiverId = []

  await chat.BuyChatRoom.map((list) => {              // Collect all unique senderId
   if (receiverId.indexOf(list.receiverId) === -1) {       //senderId is not in a array
    receiverId.push(list.receiverId)
   }
  })

  await  userReducer.SellerData.map((u) => {
     const index = receiverId.indexOf(u.sid);           //If exist then remove from array
     if (index > -1) {
      receiverId.splice(index, 1);
     }
    })

  if (receiverId.length > 0) {
   await this.props.dispatch(getSellerInfo(receiverId))
  }
 }

 get_formatted_list_sell = async () => {
  const { chat, userReducer } = this.props
  let senderId = []

  await chat.SellChatRoom.map((list) => {              // Collect all unique senderId
   if (senderId.indexOf(list.senderId) === -1) {       //senderId is not in a array
    senderId.push(list.senderId)
   }
  })

  await userReducer.SellerData.map((u) => {
   const index = senderId.indexOf(u.sid);           //If exist then remove from array
   if (index > -1) {
    senderId.splice(index, 1);
   }
  })

  if (senderId.length > 0) {
   await this.props.dispatch(getSellerInfo(senderId))
  }
 }

 getProductData = async (uid, lat, lng) => {
  await this.props.dispatch(getProduct(uid, lat, lng))
 }

 _saveDetails = (d) => {
  console.tron.log("HEyyyyyyyy", d)
  this.props.dispatch(deleteChatList(d, this.state.uid, "ExchangeChatRoom"))
 }

 _handleBack = (d) => {
   console.tron.log("_handleBackEX", d)

   if (d === "SearchBack") {
    console.tron.log("HEyyyyyyyy11", d)
    this.props.navigation.setParams({
      itemDelete: [],
      searchClick: false,
      handleSearch: this._handleSearch,
      handleBack: this._handleBack
    })
    this.setState({ 
      itemDelete: [],
    })
    this.props.navigation.navigate('ExchangeChatRoom') 
  }


   if (typeof(d) === 'object') {
    console.tron.log("HEyyyyyyyy1123", typeof(d))
    this.props.navigation.setParams({ 
      itemDelete: [],
    }) 
    this.setState({
      itemDelete: [],
      longPress: !this.state.longPress
    })
    this.props.navigation.navigate('ExchangeChatRoom')
   }

   if (d.length === 0) {
    this.props.navigation.navigate('Home')
   }
 }

 selectItem = (data) => {   
  this.props.navigation.setParams({
    itemDelete: [],
    searchClick: false,
    handleSearch: this._handleSearch,
    handleBack: this._handleBack
  })
   console.tron.log("SSSS", this.props.navigation)
   
  let d = [...this.state.itemDelete]
   if (d.some(el => el === data._id)) {
    //var array = [...this.state.itemDelete] // make a separate copy of the array
    var index = d.indexOf(data._id)
    if (index !== -1) {
      d.splice(index, 1);
    }
   } else {
    d.push(data._id)
   }

  console.tron.log("selectItem", d) 

  this.setState({
    itemDelete: d,
    longPress: !this.state.longPress,
  })

  this.props.navigation.setParams({
    itemDelete: d,
    handleSave: this._saveDetails,
    handleBack: this._handleBack,
    handleSearch: this._handleSearch
  })

  console.tron.log("selectItem", this.state.itemDelete) 

  // this.state.itemDelete.some(el => el === data._id) ? this.setState({
  //   itemDeleteColor: 'red'
  //  }) : this.setState({
  //   itemDeleteColor: 'yellow'
  //  })
 }
 
 renderExChatList = (item, element, type, deleteData) => {
  
  const {chat, myBooks, userReducer, product} = this.props
  console.tron.log("xxxxxxxxxxx", chat.SearchExchangeChatRoom.data)
  //console.tron.log("DELELEEL", element.user.name.includes(chat.SearchExchangeChatRoom !== undefined ? chat.SearchExchangeChatRoom.data : ''))
  let book, bookImage = ''
  
  if (type === 'sent') {
   book = product.Products.find((element) => element.Product_id === item.pid)

   if (book) {
    bookImage = book.url[0].url
   } else {
    this.getProductData(item.pid, userReducer.user.lat, userReducer.user.lng)
    book = product.Products.find((element) => element.Product_id === item.pid)
    bookImage = book.url[0].url
   }
  } else {
   let book = myBooks.MyBooks.find((element) => element.Product_id === item.pid)

   if (book) {
    bookImage = book.url[0].url 
   } else {
    this.getProductData(item.pid, userReducer.user.lat, userReducer.user.lng)
    book = product.Products.find((element) => element.Product_id === item.pid)
    bookImage = book.url[0].url
   }
  }

  return (
    chat.SearchExchangeChatRoom.data !== undefined && chat.SearchExchangeChatRoom.data !== '' ? 
      element.user.name.includes(chat.SearchExchangeChatRoom !== undefined ? chat.SearchExchangeChatRoom.data : '') ?
        <TouchableOpacity 
        onPress={this.state.itemDelete.length === 0 && !this.state.longPress ? () => this.props.navigation.navigate(
          "Chat", {
          thread: item._id,
          uid: type === 'sent' ? item.senderId : item.receiverId,
          SellerData: element,
          backScreen: 'ExchangeChatRoom'
          }
        ) : () => this.selectItem(item)} 
        onLongPress={this.state.itemDelete.length > 0 || !this.state.longPress ? () => this.selectItem(item) : () => this.props.navigation.navigate(
          "Chat", {
          thread: item._id,
          uid: type === 'sent' ? item.senderId : item.receiverId,
          SellerData: element,
          backScreen: 'ExchangeChatRoom'
          } 
        )}
        style={this.state.itemDelete !== undefined ? this.state.itemDelete.some(el => el === item._id) && this.props.navigation.state.params !== undefined ? this.props.navigation.state.params.itemDelete.length > 0 ? {backgroundColor: '#CCCCCC'} : this.state.itemDelete.length === 0 ? null : {backgroundColor: '#CCCCCC'} : null : null}
      >
      <Block row middle style={{margin: 8}}>
      {
        bookImage !== '' ?
        <Image style={{marginLeft: 5, marginTop: 6, marginBottom: 7, marginRight: 4, borderRadius: 50/ 2, width: 50, height: 50}}
                source={{uri: bookImage}}
        /> :
        <MaterialIcons
          style={{margin: 0, borderRadius: 50/ 2,}}
          color={theme.colors.gray} name="image" size={56}/>
      }
      <Block style={{position: 'absolute', left: 30, bottom: -3, zIndex: 999, elevation: 3,}}>
        {
        element.user.imageUrl !== '' ?
          <Image style={{width: 30, height: 30, borderRadius: 30/ 2,}} source={{uri: element.user.imageUrl}} /> :
          <MaterialIcons
          style={{margin: 0, borderRadius: 30/ 2, zIndex: 9999, elevation: 5,}}
          color={theme.colors.gray} name="account-circle" size={30} />
        }
      </Block>
      <Block style={{marginVertical: 8, marginHorizontal: 8}}>
        <Text h2>
        {element.user.name}
        </Text>
        <Text style={{marginTop: 2}}>{item.offer}</Text>
      </Block>
      </Block>
      <View
        style={{
        borderBottomColor: colors.gray2,
        borderBottomWidth: 0.5,
        marginHorizontal: 16,
        marginTop: 4
        }}
      />
    </TouchableOpacity>
      : null
      : <TouchableOpacity 
      onPress={this.state.itemDelete.length === 0 && !this.state.longPress ? () => this.props.navigation.navigate(
        "Chat", {
        thread: item._id,
        uid: type === 'sent' ? item.senderId : item.receiverId,
        SellerData: element,
        backScreen: 'ExchangeChatRoom'
        }
      ) : () => this.selectItem(item)} 
      onLongPress={this.state.itemDelete.length > 0 || !this.state.longPress ? () => this.selectItem(item) : () => this.props.navigation.navigate(
        "Chat", {
        thread: item._id,
        uid: type === 'sent' ? item.senderId : item.receiverId,
        SellerData: element,
        backScreen: 'ExchangeChatRoom'
        } 
      )}
      style={this.state.itemDelete !== undefined ? this.state.itemDelete.some(el => el === item._id) && this.props.navigation.state.params !== undefined ? this.props.navigation.state.params.itemDelete.length > 0 ? {backgroundColor: '#CCCCCC'} : this.state.itemDelete.length === 0 ? null : {backgroundColor: '#CCCCCC'} : null : null}
    >
    <Block row middle style={{margin: 8}}>
    {
      bookImage !== '' ?
      <Image style={{marginLeft: 5, marginTop: 6, marginBottom: 7, marginRight: 4, borderRadius: 50/ 2, width: 50, height: 50}}
              source={{uri: bookImage}}
      /> :
      <MaterialIcons
        style={{margin: 0, borderRadius: 50/ 2,}}
        color={theme.colors.gray} name="image" size={56}/>
    }
    <Block style={{position: 'absolute', left: 30, bottom: -3, zIndex: 999, elevation: 3,}}>
      {
      element.user.imageUrl !== '' ?
        <Image style={{width: 30, height: 30, borderRadius: 30/ 2,}} source={{uri: element.user.imageUrl}} /> :
        <MaterialIcons
        style={{margin: 0, borderRadius: 30/ 2, zIndex: 9999, elevation: 5,}}
        color={theme.colors.gray} name="account-circle" size={30} />
      }
    </Block>
    <Block style={{marginVertical: 8, marginHorizontal: 8}}>
      <Text h2>
      {element.user.name}
      </Text>
      <Text style={{marginTop: 2}}>{item.offer}</Text>
    </Block>
    
    </Block>
    <View
      style={{
      borderBottomColor: colors.gray2,
      borderBottomWidth: 0.5,
      marginHorizontal: 16,
      marginTop: 4
      }}
    />
  </TouchableOpacity>
  )
 }

 getUid = async () => {
  const uid = await AsyncStorage.getItem('uid')
  return uid
 }

 renderChat = () => {
  const {chat, myBooks, userReducer, product} = this.props

  let bookImage = ''

  let uid = this.getUid()

  let ExchangeChatRoom = chat.BuyChatRoom.filter(item => item.offer === '').concat(
   chat.SellChatRoom.filter(item => item.offer === '')
  ).sort((a, b) => (a.timeCreated > b.timeCreated) ? 1 : -1)

  let userInfo = ''
   return (
   <Block>
    <FlatList
     style={{marginTop: 16,}}
     data={ExchangeChatRoom}
     numColumns={1}
     keyExtractor={(item, index) => item._id}
     extraData={this.state.itemDelete}
     renderItem={({item, index}) => {
      return (
       <Block>
        {
         item.senderId === this.state.uid && item.delete !== this.state.uid ?
          userReducer.SellerData.some(element => element.sid === item.receiverId) ?
           this.renderExChatList(item, userReducer.SellerData.find(element => element.sid === item.receiverId), "sent", this.state.itemDelete) : null :
          userReducer.SellerData.some(element => element.sid === item.senderId) ?
           this.renderExChatList(item, userReducer.SellerData.find(element => element.sid === item.senderId), "receive", this.state.itemDelete) : null
        }
       </Block>
      )
     }}
    />
   </Block>
  )
 }

 render() {
  
  const { chat, userReducer } = this.props
  console.tron.log("Ex chat room is", chat)
  return (
   (this.state.uid !== '' && userReducer.SellerData.length > 0) && (chat.BuyChatRoom.length > 0 || chat.SellChatRoom.length > 0) ? this.renderChat() :
    <Block><Text>You have not any Chat.</Text></Block>
  );
 }
}

const mapStateToProps = (state) => ({
 chat: state.chatReducer,
 myBooks: state.myBooksReducer,
 userReducer: state.userReducer,
 product: state.product,
})

const mapDispatchToProps = (dispatch) => ({
  dispatch
 });

export default compose(
 connect(mapStateToProps, mapDispatchToProps),
)(ExchangeChatRoom);