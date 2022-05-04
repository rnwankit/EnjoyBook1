import React, {Component} from 'react';
import {Badge, Block, Card, Text} from '../components';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {AsyncStorage, FlatList, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import {exchangeRequestList, exchangeBookInfo, deleteRequest} from '../actions/exchange.action';
import {colors, sizes} from '../constants/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Button} from '../components/Button';
import Loader from '../components/Loader';
import {getBooks} from '../actions/mybooks.action';
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../constants';
import Dialog from 'react-native-dialog';

class ExchangeRequestList extends Component {

 constructor() {
  super();

  this.state = {
   books: [],
   isDialogVisible: false,
   deleteData: ''
  }

  this.get_exchange_request_list = this.get_exchange_request_list.bind(this);
  this.get_exchange_book_info = this.get_exchange_book_info.bind(this);
 }
 async componentDidMount() {
  const { exchange, myBooks } = this.props
  const uid = await AsyncStorage.getItem('uid')
  console.log("componentDidMount get_exchange_request_list before")
  if (!myBooks.MyBooks.length > 0) {
   await this.props.getBooks(uid)
  }
  await this.get_exchange_request_list(uid);
 /* console.log("get_exchange_book_info compo did", exchange.ExchangeRequestList)
  if (exchange.ExchangeRequestList.length > 0) {
   await this.get_exchange_book_info(exchange.ExchangeRequestList)
  }*/
  /*this.setState({
   books: exchange.ExchangeRequestBook
  })*/
  console.log("get_exchange_request_list out", exchange.ExchangeRequestBook, exchange.ExchangeRequestBook)
 }

 get_exchange_request_list = async (uid) => {
  const { exchange } = this.props
  console.log("get_exchange_request_list in")
  await this.props.exchangeRequestList(uid)
  await this.get_exchange_book_info(exchange.ExchangeRequestList)
  console.log("get_exchange_request_list outget_exchange_request_list", exchange.ExchangeRequestBook, exchange.ExchangeRequestBook)
 }

 get_exchange_book_info = async () => {
  const { exchange, myBooks } = this.props
  let bookId = [], uniqueBookId = []
  console.log("get_exchange_book_info in", exchange.ExchangeRequestList)
  await exchange.ExchangeRequestList.map(async (e) => {
   console.log("get_exchange_book_info e", e.data.exchangeBookID)
   await e.data.exchangeBookID.map((p) => {
    bookId.push(p)
   })
  })
  await bookId.filter(function(item) {
   if (uniqueBookId.indexOf(item) === -1) {
    uniqueBookId.push(item)
    return true
   }
  })
  console.log("get_exchange_book_info bookId", uniqueBookId)

  if (uniqueBookId.length > 0) {
   await this.props.exchangeBookInfo(uniqueBookId)
  }

  console.log("get_exchange_book_info out", exchange.ExchangeRequestBook)
 }

 acceptRequest = () => {

 }

 deleteRequest = async () => {

  const { exchange, myBooks, user } = this.props

  console.log("hjhjhj", this.state.deleteData.id, this.state.deleteData.data)

  let title = '', message = '', myBook = '', exchangeBook = []

  title = user.user.name + " reject exchange book request."

  myBooks.MyBooks.map((m) => {
   console.log("myBooks matching", m.Product_id, this.state.deleteData.pid)
   if (m.Product_id === this.state.deleteData.data.pid) {
    myBook = m.title
   }
  })
  console.log("hjhjhj", myBook)

  this.state.deleteData.data.exchangeBookID.map((id) => {
   return exchange.ExchangeRequestBook.map((book) => {
    if (book.id === id) {
     exchangeBook.push(book.data.title)
    }
   })
  })
  console.log("hjhjhj", exchangeBook)

  message = myBook + " <> " + exchangeBook.join(" & ")

  console.log("TiTLEjjjjjjjjjjjjj", title)
  console.log("Messagggggggggggggg", message)
  await this.props.deleteRequest(this.state.deleteData.id, this.state.deleteData.data.from, title, message, "ExchangeRequest")
  this.setState({
   isDialogVisible: false
  })
  this.props.navigation.navigate("ExchangeRequestList")
 }

 renderExList = () => {
  const { exchange, myBooks } = this.props
  console.log("renderExListrenderExList")
  let title='', url
  return (
   <Block>
    <FlatList
     style={{marginTop: 16,}}
     data={exchange.ExchangeRequestList}
     numColumns={1}
     keyExtractor={(item, index) => item.id}
     renderItem={({item, index}) => {
      return (
       <Block>
        <Card
         middle
         center
         shadow
         style={{
          paddingVertical: 8,
          paddingHorizontal: 8,
          marginHorizontal: 8,
         }}
        >
         <Block style={{width: 40, marginBottom: 16, zIndex: 1000, elevation: 4, position: 'absolute', padding: 4, top: 0,  right: 1}}>
          <Menu>
           <MenuTrigger>
            <MaterialCommunityIcons name={"dots-horizontal"} size={24} color={colors.black} />
           </MenuTrigger>
           <MenuOptions>
            <MenuOption onSelect={() => this.acceptRequest(item)} >
             <Text style={{color: '#000'}}>Accept Request</Text>
            </MenuOption>
            <MenuOption onSelect={() => {this.setState({isDialogVisible: true, deleteData: item})}} >
             <Text style={{color: '#000'}}>Reject Request</Text>
            </MenuOption>
           </MenuOptions>
          </Menu>
         </Block>
         <Block row style={{marginTop: 8}}>
         <TouchableOpacity
          onPress={() => this.props.navigation.navigate(
           "ExchangeRequest", {
            item: item
           }
          )}
          style={{flex:1, flexDirection: 'row'}}
         >

          <Block style={{flex: 4}}>
           {
            myBooks.MyBooks.map((m) => {
             console.log("myBooks matching", m.Product_id, item.data.pid)
             if (m.Product_id === item.data.pid) {
              return (
               <Block row style={{paddingLeft: 8,}} center>
                <Image style={{width: 60, height: 80}} source={{uri: m.url[0].url}}/>
                <Text style={{marginLeft: 8, flexShrink: 1}}>{(m.title).substring(0,36)}
                {m.title.length > 36 ? " ..." : ''}</Text>
               </Block>
              )
             }
            })
           }
          </Block>
          <Block center style={{flex: 1, justifyContent: 'center'}}>
           <MaterialIcons style={{alignSelf: 'center', }} color={colors.primary} name="compare-arrows" size={24}/>
          </Block>
          <Block row style={{flex: 4}}>
           {
            item.data.exchangeBookID.some((id) => {
             exchange.ExchangeRequestBook.some((book) => {
              if (book.id === id) {
               title = book.data.title
               url = book.data.url[0].url
               return true
              }
             })
            })
           }
           <Block row style={{padding: 8}} center>
            <Image style={{width: 60, height: 80}} source={{uri: url}}/>
            <Text style={{marginLeft: 8, flexShrink: 1}}>{(title).substring(0,36)}
             {title.length > 36 ? " ..." : ''}</Text>
            {
             item.data.exchangeBookID.length > 1 ?
              <Badge color={colors.accent} size={30} style={{position: 'absolute', right: 2}}>
               <Text bold size={12} style={{paddingBottom: 1}} color={"#fff"}>
                + {item.data.exchangeBookID.length > 1 ? item.data.exchangeBookID.length - 1 : null}
               </Text>
              </Badge> :
              null
            }
           </Block>
          </Block>
         </TouchableOpacity>
         </Block>
        </Card>
       </Block>
      )
     }}
    />
    <Dialog.Container visible={this.state.isDialogVisible}>
     <Dialog.Title style={{color: '#000', fontWeight: "bold"}}>Exchange Request Delete</Dialog.Title>
     <Dialog.Description>
      Are you sure to delete?
     </Dialog.Description>
     {this.state.errorSub !== null ? <Text style={{color: 'red', marginLeft: 10}}>{this.state.errorSub}</Text> : "" }
     <Dialog.Button label="Delete" onPress={this.deleteRequest} />
     <Dialog.Button label="Cancel" onPress={() => {this.setState({isDialogVisible: false})}} />
    </Dialog.Container>
   </Block>
  )
 }

 render() {
  const { exchange, myBooks } = this.props
  console.log("render List", exchange.ExchangeRequestList, exchange.ExchangeRequestBook)

  return (
   exchange.ExchangeRequestList !== undefined && exchange.ExchangeRequestBook !== undefined ?
    exchange.ExchangeRequestList.length > 0 && exchange.ExchangeRequestBook.length > 0 ? this.renderExList() :
    <Block center style={{marginVertical: 16}}><Text>You have not any exchange request.</Text></Block> : <Loader/>
  );
 }
}

const mapStateToProps = (state) => ({
 exchange: state.exchangeReducer,
 myBooks: state.myBooksReducer,
 user: state.userReducer
})

/*const mapDispatchToProps = (dispatch) => ({
 dispatch
});*/

export default compose(
 connect(mapStateToProps, {exchangeRequestList, exchangeBookInfo, getBooks, deleteRequest}),
)(ExchangeRequestList);

