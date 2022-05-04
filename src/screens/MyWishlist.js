import React, {Component} from 'react';
import {Card, Text} from '../components/index';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {addProductFav, getProductWishlist, removeProductFav} from '../actions/product.action';
import Block from '../components/Block';
import {AsyncStorage, FlatList, Image, ScrollView, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {colors} from '../constants/theme';

class MyWishlist extends Component {

 constructor() {
  super();

  this.rowRefs = [];
  this.storeRowRef = this.storeRowRef.bind(this);

  this.state = {
   WishListData: [],
  }
 }

 async componentDidMount() {
  await this.getProductWishlist()
 }

 async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
  const {product} = this.props
  if (prevProps.product.FavData !== product.FavData) {
   await this.getProductWishlist()
  }
 }

 getProductWishlist = async () => {
  const {product} = this.props
  let fetchWishList = product.FavData.product_id.filter(function (value, index, arr) {
   return value !== null;
  })

  let availableData = []
  if (product.FavData !== undefined) {
   product.FavData.product_id.map((product_id) => {
    if (product_id !== null) {
     product.Products.map((Product_id) => {
      if (product_id === Product_id.Product_id) {
       availableData.push(Product_id)
       fetchWishList = fetchWishList.filter(item => item !== product_id)
      }
     })
    }
   }) // give id which is not part of product

   this.setState({WishListData: availableData})

   if (fetchWishList.length > 0) {
    await this.props.dispatch(getProductWishlist(fetchWishList))
   }
  }
 }

 selectItem = async data => {
  const { product } = this.props;
  const uid = await AsyncStorage.getItem('uid');

  if (product.FavData.product_id.indexOf(data.Product_id) !== -1) {
   await this.props.dispatch(removeProductFav(uid, data.Product_id))
  } else {
   await this.props.dispatch(addProductFav(uid, data.Product_id))
  }
 };

 storeRowRef(rowRef) {
  this.rowRefs.push(rowRef);
 }

 renderWhishlist = () => {
  const { product } = this.props;
  let arr1  = this.state.WishListData !== '' ? this.state.WishListData : []
  let arr2 = product.ProductWishlist !== undefined ? product.ProductWishlist : []

  arr1.concat(arr2.filter(function (item) {
   return arr1.indexOf(item) === -1;
  }));

  return (
   <FlatList
    data={arr1}
    numColumns={2}
    keyExtractor={(item, index) => item.id }
    renderItem={({item, index}) =>{
      return (
       <TouchableOpacity onPress={() => this.props.navigation.navigate(
        "Book", {
         data: item,
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
           name={product.FavData.product_id.indexOf(item.Product_id) !== -1 ? "favorite" : "favorite-border"}
          />
         </TouchableOpacity>
         <Block center flex={false}>
          <Image style={{ width: 95, height: 130}} source={{uri: item.url[0].url}} />
         </Block>
         <Text h2 bold><FontAwesome name="rupee" size={13} /> {item.price}</Text>
         <Text h3 style={{padding: 0, margin:0 }}>{item.title.substring(0,17)}</Text>
         <Block row flex={false} style={{marginTop: 8, marginLeft: -3}}>
          <MaterialIcons style={{marginTop: 2}} color={colors.primary}  name="location-on" size={13}/>
          <Text caption>
           {item.location.substring(0,20)}...
          </Text>
         </Block>
         <Text caption gray style={{marginLeft: 0}}>{item.distance} km ago</Text>
        </Card>
       </TouchableOpacity>
      )
    }
    }
    onScrollEndDrag={this.retrieveMore}
   />
  )
 }

 render() {
  return (
   <Block>
    <ScrollView>
     { this.state.WishListData !== '' ? this.renderWhishlist(this.state.WishListData) : null}
    </ScrollView>
   </Block>
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
)(MyWishlist);
