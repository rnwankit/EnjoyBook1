import React, {Component} from 'react';
import {Badge, Block, Card, Text} from '../components';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {buyChatRoom, deleteChatList} from '../actions/chat.action';
import {AsyncStorage, FlatList, Image, TouchableOpacity, View} from 'react-native';
import {theme} from '../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, fonts} from '../constants/theme';
import {getBooks} from '../actions/mybooks.action';
import {HeaderBackButton} from 'react-navigation-stack';
import {getSellerInfo} from '../actions/user.action';

class BuyChatRoom extends Component {
  constructor() {
    super();
  
    this.state = {
      uid: '',
      itemDelete: [],
      itemDeleteColor: '',
      longPress: false,
    }
  }

  componentDidMount = async () => {
    const { myBooks, chat } = this.props

    this.props.navigation.setParams({
      itemDelete: [],
      searchClick: false,
      handleSearch: this._handleSearch,
      handleBack: this._handleBack
    })

    const uid = await AsyncStorage.getItem('uid')
    this.setState({
      uid: uid,
      itemDelete: [],
      longPress: false,
    })

    if (myBooks.MyBooks.length <= 0) {
    await this.props.dispatch(getBooks(uid))
    }

    if (chat.BuyChatRoom.length === 0) {
    await this.get_chat_list_room_buy(uid)
    }

    this.props.navigation.addListener('didBlur', (route) => { 
      //route.state.params = undefined; 
        this.setState({
          itemDelete: [],
          itemDeleteColor: '',
          longPress: false, 
        })
        this.props.navigation.setParams({
          itemDelete: [],
          searchClick: false,
          handleSearch: this._handleSearch,
          handleBack: this._handleBack
        })
    });
 }

  async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const { chat } = this.props
    if (prevProps.chat.BuyChatRoom.length !== chat.BuyChatRoom.length) {
      await this.get_formatted_list_buy(this.state.uid)
    }
  }

  _handleSearch = () => {
    this.props.navigation.setParams({
      searchClick: true
    })
  }

  get_chat_list_room_buy = async (uid) => {
    await this.get_formatted_list_buy(this.state.uid)
    await this.props.dispatch(buyChatRoom(uid))
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

  _saveDetails = (d) => {
    this.setState({
      itemDelete: [],
      longPress: false
    })
    this.props.dispatch(deleteChatList(d, this.state.uid, "BuyChatRoom"))
  }

  _handleBack = (d) => {
    if (d === "SearchBack") {
      this.props.navigation.setParams({
        itemDelete: [],
        searchClick: false,
        handleSearch: this._handleSearch,
        handleBack: this._handleBack
      })
      this.setState({ 
        itemDelete: [],
      })
      this.props.navigation.navigate('BuyChatRoom') 
    }


    if (typeof(d) === 'object') {
      this.props.navigation.setParams({ 
        itemDelete: [],
      }) 
      this.setState({
        itemDelete: [],
        longPress: false
      })
      this.props.navigation.navigate('BuyChatRoom')
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
    
    let d = [...this.state.itemDelete]
    if (d.some(el => el === data._id)) {
      var index = d.indexOf(data._id)
      if (index !== -1) {
        d.splice(index, 1);
      }
    } else {
      d.push(data._id)
    }

    this.setState({
      itemDelete: d,
      longPress: !this.state.longPress,
      thread: data._id
    })

    this.props.navigation.setParams({
      itemDelete: d,
      handleSave: this._saveDetails,
      handleBack: this._handleBack,
      handleSearch: this._handleSearch
    })
  }

  renderMsg = (item) => {
    return (
      <Text color={"#6B6B6B"} style={{marginTop: 2}}>{item.text}</Text>
    )
  }

  renderBuyChatList = (item, index, element) => {
    const {chat, product, userReducer} = this.props
    let book, bookImage = ''
    console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY", index, chat.BuyChatRoom.filter(el => el.offer !== 0 && el.delete !== this.state.uid).length)
    book = product.Products.find((element) => element.Product_id === item.pid)

    if (book) {
      bookImage = book.url[0].url
    } else {
      this.getProductData(item.pid, userReducer.user.lat, userReducer.user.lng)
      book = product.Products.find((element) => element.Product_id === item.pid)
      bookImage = book.url[0].url
    }

    console.tron.display({name: "renderBuyChatList", value: item.latestMessage !== undefined ? item.latestMessage.text : item.offer })
    return (
      chat.SearchBuyChatRoom.data !== undefined && chat.SearchBuyChatRoom.data !== '' ? 
        element.user.name.includes(chat.SearchBuyChatRoom !== undefined ? chat.SearchBuyChatRoom.data : '') ?
          <TouchableOpacity
          onPress={this.state.itemDelete.length === 0 && !this.state.longPress ? () => this.props.navigation.navigate(
            "Chat", {
            thread: item._id,
            uid: item.senderId,
            SellerData: element,
            backScreen: 'BuyChatRoom'
          }
          ) : () => this.selectItem(item)} 
          onLongPress={this.state.itemDelete.length > 0 && !this.state.longPress ? () => this.selectItem(item) : () => this.props.navigation.navigate(
            "Chat", {
            thread: item._id,
            uid: item.senderId,
            SellerData: element,
            backScreen: 'BuyChatRoom'
          }
          )}
          style={
            this.state.itemDelete !== undefined ? 
              this.state.itemDelete.some(el => el === item._id) && this.props.navigation.state.params !== undefined ? 
                this.props.navigation.state.params.itemDelete.length > 0 ? 
                {backgroundColor: '#CCCCCC'} : this.state.itemDelete.length === 0 ? null : {backgroundColor: '#CCCCCC'} 
              : null 
            : null
          }
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
          {item.latestMessage !== undefined ? this.renderMsg(item.latestMessage) : <Text color={"#6B6B6B"} style={{marginTop: 2}}>{"My Offer " + item.offer}</Text> }
          </Block>
        </Block> 
        {chat.BuyChatRoom.filter(el => el.offer !== 0 && el.delete !== this.state.uid).length - 1 === index ? null :
          <View
            style={{
            borderBottomColor: colors.gray2,
            borderBottomWidth: 0.5,
            marginHorizontal: 16,
            marginTop: 4
            }}
          />
        }
              </TouchableOpacity>
          : null
      :  <TouchableOpacity 
          onPress={this.state.itemDelete.length === 0 && !this.state.longPress ? () => this.props.navigation.navigate(
            "Chat", {
            thread: item._id,
            uid: item.senderId,
            SellerData: element,
            backScreen: 'BuyChatRoom'
          }
          ) : () => this.selectItem(item)} 
          onLongPress={this.state.itemDelete.length > 0 || !this.state.longPress ? () => this.selectItem(item) : () => this.props.navigation.navigate(
            "Chat", {
            thread: item._id,
            uid: item.senderId,
            SellerData: element,
            backScreen: 'BuyChatRoom'
          }
          )}
          style={
            this.state.itemDelete !== undefined ? 
              this.state.itemDelete.some(el => el === item._id) && this.props.navigation.state.params !== undefined ? 
                this.props.navigation.state.params.itemDelete.length > 0 ? 
                {backgroundColor: '#CCCCCC'} : this.state.itemDelete.length === 0 ? null : {backgroundColor: '#CCCCCC'} 
              : null 
            : null
          }
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
        <Block style={{marginVertical: 8, marginHorizontal: 16}}>
          <Text h2>
            {element.user.name}
          </Text>
          {item.latestMessage !== undefined ? this.renderMsg(item.latestMessage) : <Text color={"#6B6B6B"} style={{marginTop: 2}}>{"My Offer " + item.offer}</Text> }
        </Block>
      </Block>
      {chat.BuyChatRoom.filter(el => el.offer !== 0 && el.delete !== this.state.uid).length - 1 === index ? null :
        <View
          style={{
          borderBottomColor: colors.gray2,
          borderBottomWidth: 0.5,
          marginHorizontal: 16,
          marginTop: 4
          }}
        />
      }
            </TouchableOpacity>
      )
  }

 renderChat = () => { 
  const {chat, myBooks, userReducer} = this.props
  
  return (
    <Block>
      <FlatList
        style={{marginTop: 16,}}
        data={chat.BuyChatRoom}
        numColumns={1}
        keyExtractor={(item, index) => item._id}
        extraData={this.state.itemDelete}
        renderItem={({item, index}) => {
          return (
          <Block>
            {
              item.offer !== '' && item.delete !== this.state.uid ?
                userReducer.SellerData.some(element => element.sid === item.receiverId) ?
                  this.renderBuyChatList(item, index, userReducer.SellerData.find(element => element.sid === item.receiverId)) : null
              : null
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

  return (
    (this.state.uid !== '' && userReducer.SellerData.length > 0) && (chat.BuyChatRoom.length > 0) ? 
      this.renderChat() 
    :
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
)(BuyChatRoom);

