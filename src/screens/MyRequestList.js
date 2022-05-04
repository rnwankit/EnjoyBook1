import React, {Component} from 'react';
import {Badge, Block, Card, Text} from '../components';
import {HeaderBackButton} from 'react-navigation-stack';
import {colors, fonts} from '../constants/theme';
import {AsyncStorage, FlatList, Image, TouchableOpacity} from 'react-native';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {deleteRequest, exchangeBookInfo, exchangeRequestList} from '../actions/exchange.action';
import {myRequest} from '../actions/exchange.action';
import Loader from '../components/Loader';
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Dialog from 'react-native-dialog';

class MyRequestList extends Component {

 constructor() {
  super();

  this.state = {
   isDialogVisible: false,
   deleteData: ''
  }
 }

 componentDidMount = async () => {
  const uid = await AsyncStorage.getItem('uid')
  await this.get_my_request_list(uid)
 }

 async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
  const { exchange } = this.props
  console.log("componentDidUpdateReq y Req", prevProps.exchange.NumberOfMyRequest, exchange.NumberOfMyRequest)
  if (prevProps.exchange.NumberOfMyRequest !== exchange.NumberOfMyRequest) {
   console.log("My Req componentDidUpdateReq Update", prevProps.exchange.NumberOfMyRequest, exchange.NumberOfMyRequest)
   const uid = await AsyncStorage.getItem('uid')
   await this.get_my_request_list(uid)
   //await this.get_exchange_book_info(exchange.MyRequest)
  }
 }

 get_my_request_list = async (uid) => {
  const { exchange } = this.props
  console.log("get_my_request_list")
  await this.props.dispatch(myRequest(uid))
  await this.get_exchange_book_info(exchange.MyRequest)
  console.log("get_my_request_listget_my_request_list", exchange)
 }

 get_exchange_book_info = async () => {
  const { exchange, myBooks } = this.props
  let bookId = [], uniqueBookId = []
  console.log("get_exchange_book_info in", exchange.MyRequest)
  await exchange.MyRequest.map(async (e) => {
   console.log("get_exchange_book_info e", e.data.pid)
   bookId.push(e.data.pid)
  })

  await bookId.filter(function(item) {
   if (uniqueBookId.indexOf(item) === -1) {
    uniqueBookId.push(item)
    return true
   }
  })

  console.log("get_exchange_book_info bookId", uniqueBookId)

  if (uniqueBookId.length > 0) {
   await this.props.dispatch(exchangeBookInfo(uniqueBookId))
  }

  console.log("get_exchange_book_info out", exchange.ExchangeRequestBook)
 }

 renderExList = () => {
  const { exchange, myBooks } = this.props
  console.log("myyyyyyyyyyyyyyyyyyyyyyyyyyyyyg", exchange.MyRequest)
  let title='', url
  return (
   <Block>
    <FlatList
     style={{marginTop: 16,}}
     data={exchange.MyRequest}
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
            "MyRequest", {
             item: item
            }
           )}
           style={{flex:1, flexDirection: 'row'}}
          >
           <Block row style={{flex: 4}}>
            {
             myBooks.MyBooks.map((m) => {
              item.data.exchangeBookID.map((e) => {
               if (m.Product_id === e) {
                title = m.title
                url = m.url[0].url
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
           <Block center style={{flex: 1, justifyContent: 'center'}}>
            <MaterialIcons style={{alignSelf: 'center', }} color={colors.primary} name="compare-arrows" size={24}/>
           </Block>
           <Block row style={{flex: 4}}>
            {
              exchange.ExchangeRequestBook.map((book) => {
               if (book.id === item.data.pid) {
                return (
                 <Block row style={{padding: 8}} center>
                  <Image style={{width: 60, height: 80}} source={{uri: book.data.url[0].url}}/>
                  <Text style={{marginLeft: 8, flexShrink: 1}}>{(book.data.title).substring(0,36)}
                   {title.length > 36 ? " ..." : ''}</Text>
                 </Block>
                )
               }
             })
            }
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

 acceptRequest = () => {

 }

 deleteRequest = async (item) => {
  const { exchange, myBooks, user } = this.props


  await this.props.dispatch(deleteRequest(this.state.deleteData.id, this.state.deleteData.data.from, null, null, "MyRequest"))
  this.setState({
   isDialogVisible: false
  })
  this.props.navigation.navigate("MyRequestList")
 }

 render() {
  const { exchange } = this.props
  console.log("My Request in render", exchange)
  return (
   exchange.MyRequest !== undefined && exchange.ExchangeRequestBook !== undefined ?
    exchange.MyRequest.length > 0 && exchange.ExchangeRequestBook.length > 0 ? this.renderExList() :
     <Block center style={{marginVertical: 16}}><Text>You have not apply for exchange request.</Text></Block> : <Loader/>
  );
 }
}

const mapStateToProps = (state) => ({
 exchange: state.exchangeReducer,
 myBooks: state.myBooksReducer,
})

const mapDispatchToProps = (dispatch) => ({
 dispatch
});

export default compose(
 connect(mapStateToProps, mapDispatchToProps),
)(MyRequestList);
