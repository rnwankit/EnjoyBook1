import React, {Component} from 'react';
import {Badge, Block, Card, Text} from '../components/index';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {getSellerInfo} from '../actions/user.action';
import {getBooks, numberOfView} from '../actions/mybooks.action';
import {deleteRequest} from '../actions/exchange.action';
import {FlatList, Image, TouchableOpacity, ScrollView, Alert} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, fonts} from '../constants/theme';
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getDistance} from 'geolib';
import {Button} from '../components/Button';
import Loader from '../components/Loader';
import Dialog from 'react-native-dialog';
import {HeaderBackButton} from 'react-navigation-stack';

class MyRequest extends Component {

 static navigationOptions= ({navigation}) => ({
  title: navigation.state.params.headerTitle,
  headerLeft: (<HeaderBackButton onPress={"ExchangeRequestList"}/>),
  headerTitleStyle: {
   color: colors.primary,
   font: fonts.header,
   marginLeft: -100
  }
 })

 constructor() {
  super();

  this.state = {
   requestUser: '',
   viewsAndFav: '',
   isDialogVisible: false
  }
 }

 componentDidMount = async() => {
  await this.getSellerInfo(this.props.navigation.state.params.item.data.from)
  await this.getViewsAndFav(this.props.navigation.state.params.item.id)
 }

 getSellerInfo = async (id) => {
  const { user } = this.props

  await this.props.dispatch(getSellerInfo(id, this.props.navigation.state.params.item.data.from))

 }


 getViewsAndFav = async (pid) => {
  const { exchange, myBooks, user } = this.props
  let ids = []

  await exchange.MyRequest.map((reqId) => {
   console.log("reqIdreqId", reqId, pid)
   if (reqId.id === pid) {
    ids.push(reqId.data.pid)
    reqId.data.exchangeBookID.map((exBookId) => {
     ids.push(exBookId)
    })
   }
  })
  console.log("HHHHHHHHHHHH", ids)
  await this.props.dispatch(numberOfView(ids))

  this.setState({
   viewsAndFav: myBooks.NumberOfViewsAndFav
  })

 }

 renderViewsAndLikes = (pid) => {
  console.log("renderViewsAndLikesrenderViewsAndLikes", pid)
  const { myBooks } = this.props
  let views = 0, favorite = 0
  if ( myBooks.NumberOfViewsAndFav !== undefined) {
   myBooks.NumberOfViewsAndFav.map((item) => {
    if (item.pid === pid) {
     views = item.views !== undefined ? item.views : 0
     favorite = item.favorite !== undefined ? item.favorite : 0
    }
   })
  }

  console.log("renderViewsAndLikes", views, favorite)
  return(
   <Block row center>
    <MaterialIcons name={"visibility"} size={16} color={"#000"} />
    <Text caption color={"#000"} style={{marginRight: 4}}> Views: {views}</Text>
    <Text style={{marginHorizontal: 6,}} h2>| </Text>
    <MaterialIcons name={"favorite"} size={16} color={"red"} />
    <Text caption color={"#000"}> Likes: {favorite}</Text>
   </Block>
  )
 }

 deleteRequest = async () => {
  const { item } = this.props.navigation.state.params
  const { exchange, myBooks, user } = this.props

  await this.props.dispatch(deleteRequest(item.id, item.data.from, null, null, "MyRequest"))
  this.props.navigation.navigate("MyRequestList")
 }

 render() {
  const { item } = this.props.navigation.state.params
  const { exchange, myBooks, user } = this.props
  let title='', url
  console.log("In render user", user)
  return (
   user.SellerData !== undefined && this.state.viewsAndFav !== '' ?
    <Block style={{justifyContent: 'flex-end',}}>
     <ScrollView>
      <Block style={{ padding: 16, marginBottom: 48,}}>
       <Block>
        {
         myBooks.MyBooks.map((m) => {
          return item.data.exchangeBookID.map((e) => {
           if (m.Product_id === e) {
            return (
             <Card
              middle
              center
              shadow
              style={{
               marginVertical: 16,
              }}
             >
              <TouchableOpacity
               onPress={() => this.props.navigation.navigate(
                "ExchangeRequest", {
                 id: item.id
                }
               )}
               style={{flexDirection: 'row'}}
              >
               <Block>
                <Block row>
                 <Image style={{width: 120, height: 180}} source={{uri: m.url[0].url}}/>
                 <Block style={{marginHorizontal: 8,}}>
                  <Text h2 color={"#000"} style={{marginBottom: 16}}>{m.title}</Text>
                  <Text h2 bold color={"#000"} style={{marginBottom: 16}}>
                   <FontAwesome name="rupee" size={13}/> {m.price}</Text>
                  {this.renderViewsAndLikes(m.Product_id)}
                 </Block>
                </Block>
               </Block>
              </TouchableOpacity>
             </Card>

            )
           }
           })
         })
        }
        <Block center style={{justifyContent: 'center'}}>
         <MaterialIcons
          style={{transform: [{ rotate: '90deg'}]}}
          color={colors.primary} name="compare-arrows" size={32}/>
        </Block>
        <Block>
         {
          exchange.ExchangeRequestBook.map((book) => {
           if (book.id === item.data.pid) {
             return (
              <Card
               middle
               center
               shadow
               style={{
                marginVertical: 16,
                flexDirection: 'column'
               }}
              >
               <TouchableOpacity
                onPress={() => this.props.navigation.navigate(
                 "Book", {
                  id: book.id
                 }
                )}
                style={{flexDirection: 'row'}}
               >
                <Block row >
                 <Image style={{width: 120, height: 180}} source={{uri: book.data.url[0].url}}/>
                 <Block style={{marginHorizontal: 8,}}>
                  <Text h2 color={"#000"} style={{marginBottom: 12}}>{book.data.title}</Text>
                  <Text h2 bold color={"#000"} style={{marginBottom: 12}}><FontAwesome name="rupee" size={13}/> {book.data.price}</Text>
                  {this.renderViewsAndLikes(book.id)}
                  <Block row flex={false} style={{marginTop: 8, marginLeft: -3}}>
                   <MaterialIcons style={{marginTop: 2}} color={colors.primary}  name="location-on" size={18}/>
                   <Text h3>
                    {book.data.location}
                   </Text>
                  </Block>
                  <Text caption gray style={{marginLeft: 2}}>{(getDistance({latitude: book.data.lat, longitude:book.data.lng},
                   {latitude: user.user.lat, longitude: user.user.lat})/1000).toString() !== undefined ?
                   (getDistance({latitude: book.data.lat, longitude:book.data.lng},
                    {latitude: user.user.lat, longitude: user.user.lat})/1000).toString() + " away from your loaction" : null
                  } </Text>
                 </Block>
                </Block>
               </TouchableOpacity>
              </Card>
             )
            }
           })
         }
        </Block>
       </Block>
      </Block>
     </ScrollView>
     <Block row
            style={{
             width: '100%',
             justifyContent: 'space-between',
             zIndex: 999,
             elevation: 3,
             position: 'absolute'
            }}
     >
      <Button
       half
       isLoading={this.state.isLoading}
       onPress={() => this._toggleBottomNavigationView}
       title={"Chat"} />
      <Button
       half
       isLoading={this.state.isLoading}
       onPress={() => {this.setState({isDialogVisible: true})}}
       title={"Delete"} />
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
    </Block> : <Loader/>
  );
 }
}

const mapStateToProps = (state) => ({
 exchange: state.exchangeReducer,
 myBooks: state.myBooksReducer,
 user: state.userReducer
})

const mapDispatchToProps = (dispatch) => ({
 dispatch
});

export default compose(
 connect(mapStateToProps, mapDispatchToProps),
)(MyRequest);
