import React, {Component} from 'react';
import {Block, Card, Text} from '../components';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {AsyncStorage, FlatList, Image, ImageBackground, TouchableOpacity} from 'react-native';
import { getUserBooks } from '../actions/product.action'
import BottomBar from '../components/BottomBar';
import {theme} from '../constants';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScrollView,  } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {colors} from '../constants/theme';
import Cards from '../components/Cards';
import firestore from '@react-native-firebase/firestore';
import { numberOfView, deleteBook, getBooks, markAsExchanged, markAsSold, editBook, markAsActiveOrDeactive } from '../actions/mybooks.action'
import Dialog from 'react-native-dialog';
import Loader from '../components/Loader';
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class MyBooks extends Component {

 constructor() {
  super();

  this.state = {
   isDialogVisible: false,
   pid: '',
   image: []
  }
 }

 async componentDidMount() {
  console.log("constructor")
  const uid = await AsyncStorage.getItem('uid')
  await this.props.dispatch(getBooks(uid))
  console.log("myBooks111", this.props.myBooks.MyBooks)
  await this.getNumberOfVie()

 }

 getNumberOfVie = async () => {
  const { myBooks } = this.props
  let ids = []
  myBooks.MyBooks.map((m) => {
   ids.push(m.Product_id)
  })
  console.log("okokokjnjnjn", ids)
  await this.props.dispatch(numberOfView(ids))
 }

 getUnique(arr, index) {
  console.log("uniqqq", arr)
  const flagList = []
  return arr.filter(function(item) {
   if (flagList.indexOf(item[index]) === -1) {
    flagList.push(item)
    return true
   }
  })
  //if (arr.length > 1) {
  /* const unique = arr
    .map(e => e[index])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter(e => arr[e]).map(e => arr[e]);
   return unique;*/
  /*} else {
   return arr
  }*/
 }

/* async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
  const {product} = this.props
  if (prevProps.myBooks.MyBooks !== myBooks.MyBooks) {
   const uid = await AsyncStorage.getItem('uid');
   await this.props.dispatch(myBooks(uid));
  }
 }*/

 renderViewsAndLikes = (pid) => {
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

 showDeleteBook = async(pid, image) => {
  console.log("kkk", image)
  this.setState({
   isDialogVisible: true,
   pid: pid,
   image: image
  })
 }

 editBook = async (item) => {
  this.props.navigation.navigate("EditBook", {
   item: item
  })
 }

 markAsExchanged = async (item, status) => {
  await this.props.dispatch(markAsExchanged(item, status))
 }

 markAsSold = async (item) => {
  await this.props.dispatch(markAsSold(item))
 }

 markAsActiveOrDeactive = async (item, status) => {
  await this.props.dispatch(markAsActiveOrDeactive(item, status))
 }

 deleteBook = async(pid) => {
  this.setState({isDialogVisible: true})
  const uid = await AsyncStorage.getItem('uid');
  await this.props.dispatch(deleteBook(uid, this.state.pid, this.state.image))
  this.setState({isDialogVisible: false})
 }

 renderMyBooks = () => {
  const { myBooks } = this.props

  console.log("zzzzzzzzzzzzzzz", myBooks.MyBooks)
  var date = new Date()

  return (
   <Block container>
    <Block>
     <FlatList
      style={{paddingBottom: 80, paddingTop: 16,}}
      data={myBooks.MyBooks !== undefined ? this.getUnique(myBooks.MyBooks,'Product_id') : myBooks.MyBooks}
      numColumns={1}
      keyExtractor={(item, index) => item.id }
      renderItem={({item, index}) => {

       return (
        <Card
         shadow
         style={[{
          width: '99.5%',
          height: 186,
          padding: 0,
          borderLeftWidth: 4
         }, item.status == 'active' || item.status == 'available' ? {borderLeftColor: colors.primary,} : {borderLeftColor: 'gray',}]}
        >
         <Block row center flex={false} style={{
          backgroundColor: "#ccc",
          padding: 8,
          borderTopRightRadius: theme.sizes.radius
         }}>
          <Text caption>From: </Text><Text caption bold>{item.last_modified}</Text>
          <Text caption>  -  To: </Text><Text caption bold>{item.expired_at}</Text>
          <Block style={{width: 30, zIndex: 1000, elevation: 4, position: 'absolute', right: 1}}>
           <Menu>
            <MenuTrigger>
             <MaterialCommunityIcons name={"dots-horizontal"} size={24} color={colors.black}/>
            </MenuTrigger>
            <MenuOptions>
             {
              item.status.includes("deactive") ?
               <Block>
                <MenuOption onSelect={() => this.markAsActiveOrDeactive(item, "active")}>
                 <Text style={{color: '#000'}}>Active</Text>
                </MenuOption>
                <MenuOption onSelect={() => this.showDeleteBook(item.Product_id, item.url)}>
                 <Text style={{color: '#000'}}>Delete</Text>
                </MenuOption>
               </Block> :
               <Block>
                {
                 item.status.includes("sold") ?
                  <MenuOption onSelect={() => this.showDeleteBook(item.Product_id, item.url)}>
                   <Text style={{color: '#000'}}>Delete</Text>
                  </MenuOption>
                  :
                  <Block>
                   <MenuOption onSelect={() => this.markAsActiveOrDeactive(item, "deactive")}>
                    <Text style={{color: '#000'}}>Deactive</Text>
                   </MenuOption>
                   <MenuOption onSelect={() => this.props.navigation.navigate(
                    "EditBook", {
                     data: item,
                     From: 'MyBooks'
                    }
                   )}>
                    <Text style={{color: '#000'}}>Edit</Text>
                   </MenuOption>
                   <MenuOption onSelect={() => this.showDeleteBook(item.Product_id, item.url)}>
                    <Text style={{color: '#000'}}>Delete</Text>
                   </MenuOption>
                   {
                    item.choice.includes("exchange") ?
                     item.status.includes("exchange") ?
                      <MenuOption onSelect={() => this.markAsExchanged(item, "available")}>
                       <Text style={{color: '#000'}}>Mark as available</Text>
                      </MenuOption>
                      :
                      <MenuOption style={item.status === "exchanged" ? {backgroundColor: theme.colors.placeholder} : ''}
                                  disabled={item.status === "exchanged" ? true : false}
                                  onSelect={() => this.markAsExchanged(item, "exchanged")}>
                       <Text style={{color: '#000'}}>Mark as exchanged</Text>
                      </MenuOption>
                     :
                     null
                   }

                   {
                    item.choice.includes("sell") ?
                     item.status.includes("sold") ?
                      <MenuOption onSelect={() => this.showDeleteBook(item.Product_id, item.url)}>
                       <Text style={{color: '#000'}}>Delete</Text>
                      </MenuOption>
                      :
                      <MenuOption onSelect={() => this.markAsSold(item)}>
                       <Text style={{color: '#000'}}>Mark as sold</Text>
                      </MenuOption>
                     :
                     null
                   }
                  </Block>
                }
               </Block>
             }
            </MenuOptions>
           </Menu>
          </Block>
         </Block>
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
          <Block flex={false} row style={{zIndex: 99, padding: 16, elevation: 3,}}>
           <Image style={{width: 60, height: 80, marginRight: 16}} source={{uri: item.url[0].url}}/>
           <Block style={{flex: 6}}>
            <Text title color={"#000"} style={{marginBottom: 4}}>{item.title.substring(0, 30)}</Text>
            <Text title bold color={"#000"}><FontAwesome name="rupee" size={13}/> {item.price}</Text>
            <Block row style={{marginTop: 4,}}>
             {this.renderViewsAndLikes(item.Product_id)}
            </Block>
           </Block>
          </Block>
          <Text
           style={[{
            textTransform: 'capitalize',
            marginLeft: 16,
            textAlign: 'center',
            width: 80,
            borderRadius: 12,
            paddingTop: 2,
            paddingBottom: 3,
           }
           , item.status == 'active' || item.status == 'available' ? {backgroundColor: colors.primary} : {backgroundColor: 'gray'}]} bold color={"#fff"}>
           {item.status}
          </Text>
         </TouchableOpacity>

        </Card>
       )
      }
      }
      onScrollEndDrag={this.retrieveMore}
     />
     <Dialog.Container visible={this.state.isDialogVisible}>
      <Dialog.Description>
       Are you sure to delete?
      </Dialog.Description>
      {this.state.errorSub !== null ? <Text style={{color: 'red', marginLeft: 10}}>{this.state.errorSub}</Text> : "" }
      <Dialog.Button label="Delete" onPress={this.deleteBook} />
      <Dialog.Button label="Cancel" onPress={() => {this.setState({isDialogVisible: false})}} />
     </Dialog.Container>
    </Block>
   </Block>
  )
 }

 render() {
  const { myBooks } = this.props

  console.log("My Books", myBooks.MyBooks)
  return (
   <Block>
    <BottomBar onPress={this.props.navigation} mybooks={"#000"} />
    <ScrollView contentContainerStyle={{marginBottom: 150}}>
     {myBooks.MyBooks !== undefined   ?
      myBooks.MyBooks.length > 0 ? this.renderMyBooks() :
       <Loader/> : <Text>No Book Found</Text>}
    </ScrollView>
   </Block>
  );
 }
}

const mapStateToProps = (state) => ({
 userReducer: state.userReducer,
 myBooks: state.myBooksReducer,
})

const mapDispatchToProps = (dispatch) => ({
 dispatch
});

export default compose(
 connect(mapStateToProps, mapDispatchToProps),
)(MyBooks);
