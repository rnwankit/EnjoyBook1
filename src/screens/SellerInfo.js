import React, {Component} from 'react';
import {Block, Card, Text} from '../components';
import {AsyncStorage, FlatList, Image, ScrollView, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../constants';
import {colors, fonts, sizes} from '../constants/theme';
import {getSellerBook, getSellerInfo} from '../actions/user.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Cards from '../components/Cards';
import {addProductFav, removeProductFav} from '../actions/product.action';
import Loader from '../components/Loader';
import {HeaderBackButton} from 'react-navigation-stack';

class SellerInfo extends Component {
 static navigationOptions= ({navigation}) => ({
  title: "Seller Information",
  headerLeft: (<HeaderBackButton onPress={() => {
   navigation.navigate(navigation.state.params.backScreen.toString(), {
    data: navigation.state.params.img !== undefined ? navigation.state.params.img : null
   })
  }}/>),
  headerTitleStyle: {
   color: colors.primary,
   font: fonts.header,
   marginLeft: -20
  }
 })
 constructor() {
  super();

  this.rowRefs = [];
  this.storeRowRef = this.storeRowRef.bind(this);

  this.state = {
   loaded: false
  }
 }

 async componentDidMount() {
  console.log("in sellinfo did", this.props.navigation.state.params)
  await this.props.dispatch(getSellerBook(this.props.navigation.state.params.SellerData.sid))
 }

 _onLoad = () => {
  this.setState(() => ({ loaded: true }))
 }

 storeRowRef(rowRef) {

  this.rowRefs.push(rowRef);
  console.log("reff", rowRef);
 }

 selectItem = async data => {
  console.log("data favvvv", data)
  const { product } = this.props;
  const uid = await AsyncStorage.getItem('uid');

  if (product.FavData.product_id.indexOf(data.Product_id) !== -1) {
   await this.props.dispatch(removeProductFav(uid, data.Product_id))
  } else {
   await this.props.dispatch(addProductFav(uid, data.Product_id))
  }
 };

 renderSellerBook = () => {
  const { userReducer, product } = this.props;
  console.log("renderSellerBook", userReducer.SellerProductData)
  return(
   <Block style={{marginTop: 16}}>
    <Block style={{flex: 1,}}>
     <Text h2 medium color={colors.primary} style={{ marginBottom: 12, marginTop: 4}}>Published Book</Text>
     <FlatList
      data={userReducer.SellerProductData}
      numColumns={2}
      keyExtractor={(item, index) => item.id }
      renderItem={({item, index}) =>{
        return (
         <TouchableOpacity onPress={() => this.props.navigation.navigate(
          "Book", {
           data: item.productData,
           PID: item.Product_id
          }
         )}>
          <Card shadow
                style={{
                 width: 154,
                 height: 230,
                 marginRight: index%2 === 0 ? 9 : 0,
                 paddingHorizontal: 12,
                 paddingVertical: 12,
                 marginBottom: 12,
                 marginLeft: 4,
                 marginTop: 4,
                }}>
           <TouchableOpacity key={item.id}
                             onPress={() => this.selectItem(item)}
                             style={{position: 'absolute', zIndex: 1000, top: 5, right: 4}}>

            <MaterialIcons
             backgroundColor="#900"
             borderRadius={0}
             key={item.id}
             ref={(ref)=>this.storeRowRef(ref)}
             size={25}
             color={'red'}
             //name={product.FavData.product_id.map() item.isSelect === false ? "favorite-border" : "favorite"}
             name={product.FavData.product_id.indexOf(item.Product_id) !== -1 ? "favorite" : "favorite-border"}
            />
           </TouchableOpacity>
            <Block center flex={false}>
              <Image style={{ width: 95, height: 130}} source={{uri: item.productData.url[0].url}} />
             </Block>
           <Text h2 bold><FontAwesome name="rupee" size={13} /> {item.productData.price}</Text>
             <Text h3 style={{padding: 0, margin:0 }}>{item.productData.title.substring(0,17)}</Text>
             <Block row flex={false} style={{marginTop: 8, marginLeft: -3}}>
              <MaterialIcons style={{marginTop: 2}} color={colors.primary}  name="location-on" size={13}/>
              <Text caption>
               {item.productData.location.substring(0,20)}...
              </Text>
             </Block>
             <Text caption gray style={{marginLeft: 0}}>{item.productData.distance} km ago</Text>
          </Card>
         </TouchableOpacity>
        )
      }
      }
      onScrollEndDrag={this.retrieveMore}
     />
    </Block>
   </Block>
  )
 }

 render() {
  console.log("Sellereeee", this.props.navigation.state.params.SellerData.user)
  const { imageUrl, name, location, signUpSince, phoneNumber } = this.props.navigation.state.params.SellerData.user
  const { userReducer, product } = this.props;

  /*console.log("Sellereeee", userReducer.SellerProductData.Product_id)
  {userReducer.SellerProductData.map((productData) => console.log("pouuuuu",productData.productData.author))}*/

  return (
   <ScrollView>
   <Block container>
     <Block row center style={{marginVertical: 24,}}>
      {imageUrl !== ''  ?
       <TouchableOpacity onPress={() => this.props.navigation.navigate(
        "ProfilePhoto", {
         img: {uri: imageUrl}, //img url 0 url
         headerTitle: "Profile Photo",
         backScreen: "SellerInfo"
        })}>
        <Image
         onLoad={this._onLoad}
         style={{ width: 130, marginRight: 16, height: 130, borderRadius: 130/ 2, alignSelf: 'center',}}
         source={{uri: imageUrl}} />
       </TouchableOpacity>:
       <MaterialIcons
        style={{marginVertical: 16,  borderRadius: 140/ 2, alignSelf: 'center'}}
        color={theme.colors.gray} name="account-circle" size={140}/>
      }
      <Block style={{marginTop: 16}}>
       <Text headerLight style={{marginBottom: 16}}>
        {name}
       </Text>
       <Block row>
        <MaterialIcons color={colors.primary} name="location-on" size={24}/>
        <Text h2>{location}</Text>
       </Block>
      </Block>
     </Block>
     <View
      style={{
       borderBottomColor: colors.gray2,
       borderBottomWidth: 0.5,
      }}
     />
     {userReducer.SellerProductData !== undefined ? this.renderSellerBook() : <Loader/>}

   </Block>
   </ScrollView>
  );
 }
}

const mapStateToProps = (state) => ({
 userReducer: state.userReducer,
 product: state.product
})

const mapDispatchToProps = (dispatch) => ({
 dispatch
});

export default compose(
 connect(mapStateToProps, mapDispatchToProps),
)(SellerInfo);
