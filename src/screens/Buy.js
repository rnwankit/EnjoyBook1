import React, {Component} from 'react';
import {
 View,
 Text,
 FlatList,
 ScrollView,
 TouchableOpacity,
 Image,
 Dimensions,
 Platform,
 StatusBar,
 StyleSheet
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import {theme} from "../constants";
import Cards from "../components/Cards";
import Animated from "react-native-reanimated";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Body, Card, CardItem} from "native-base";

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = Platform.OS == 'ios' ? 130 : 110+StatusBar.currentHeight;

const scrollY = new Animated.Value(0);
const diffClampScrollY = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);
const headerY = new Animated.interpolate(diffClampScrollY, {
 inputRange: [0, HEADER_HEIGHT+220],
 outputRange: [0, -HEADER_HEIGHT]
})

class Chat extends Component {

 constructor() {
  super();
  this.rowRefs = [];
  this.storeRowRef = this.storeRowRef.bind(this);
  //this._renderRow = this._renderRow.bind(this);
  this.state = {
   flagImage: false,
   fill: false,
   DATA: [
    {id: 1, title: "Art & Music", price: 200},
    {id: 2, title: "Biographies", isSelect: false, selectedClass: "styles.list", price: 350},
    {id: 3, title: "Business", isSelect: false, selectedClass: "styles.list", price: 80},
    {id: 4, title: "Kids", isSelect: false, selectedClass: "styles.list", price: 200},
    {id: 5, title: "Computer & Tech", isSelect: false, selectedClass: "styles.list", price: 200},
    {id: 6, title: "Education", isSelect: false, selectedClass: "styles.list", price: 200},
    {id: 7, title: "Health & Fitness", isSelect: false, selectedClass: "styles.list", price: 200},
    {id: 8, title: "Literature & Fiction", isSelect: false, selectedClass: "styles.list", price: 200},
    {id: 9, title: "Romance", isSelect: false, selectedClass: "styles.list"},
   ],
   ExBooks : [
    {id: 1, title: "Art & Music", isSelect: false, selectedClass: "styles.list", image: require('../assets/books/1.jpg'), price: 200, location: "Surat"},
    {id: 2, title: "Biographies", isSelect: false, selectedClass: "styles.list", image: require('../assets/books/2.png'), price: 300, location: "Kamrej", },
    {id: 3, title: "Business", isSelect: false, selectedClass: "styles.list", image: require('../assets/books/3.png'), price: 220, location: "Varachha"},
    {id: 4, title: "Kids", isSelect: false, selectedClass: "styles.list", image: require('../assets/books/4.png'), price: 320, location: "Kamrej"},
    {id: 5, title: "Computer & Tech", isSelect: false, selectedClass: "styles.list", image: require('../assets/books/5.png'), price: 400, location: "Kamrej"},
    {id: 6, title: "Education", isSelect: false, selectedClass: "styles.list", image: require('../assets/books/6.png'), price: 120, location: "Kamrej"},
    {id: 7, title: "Health & Fitness", isSelect: false, selectedClass: "styles.list", image: require('../assets/books/7.png'), price: 210, location: "Kamrej"},
    {id: 8, title: "Literature & Fiction", image: require('../assets/books/2.png'), price: 230, location: "Kamrej"},
    {id: 9, title: "Romance", isSelect: false, selectedClass: "styles.list", image: require('../assets/books/3.png'), price: 450, location: "Kamrej"},
   ]
  }
 }

 storeRowRef(rowRef) {
  /*console.log("reff", rowRef);*/
  this.rowRefs.push(rowRef);
 }

 componentDidMount() {
  this.props.navigation.setParams({
   headerY: new Animated.interpolate(diffClampScrollY, {
    inputRange: [0, HEADER_HEIGHT+220],
    outputRange: [0, -HEADER_HEIGHT]
   }),
  });
  this.setState({ categories: this.props.categories });
 }

 handleTab = tab => {
  const { categories } = this.props;
  const filtered = categories.filter(
   category => category.tags.includes(tab.toLowerCase())
  );

  this.setState({ active: tab, categories: filtered });
 };

 render() {
  return (
   <View style={{flex: 1, flexDirection: 'column'}}>
    <Animated.ScrollView
     scrollEventThrottle={16}
     contentContainerStyle={{ paddingBottom: 10 }}
     onScroll={Animated.event([
      {
       nativeEvent: { contentOffset: {y: scrollY} }
      }
     ])}
     style={{paddingTop:HEADER_HEIGHT+10}}
    >
     <View style={{flex: 1}}>
      <Text style={{
       marginTop:5, marginLeft: 5, fontSize: 16,
       fontWeight: 'bold'}}>Most popular books</Text>
      <View style={{height: 130}}>
       <ScrollView
        scrollEventThrottle={16}
        horizontal={true}
       >
        <View style={{width: width, height: 130}}>
         <FlatList style={{margin:5}}
          data={this.state.ExBooks}
          numColumns={2}
          keyExtractor={(item, index) => item.id }
          renderItem={({item, index}) =>{
           if (index != 8) {
            return (
             <TouchableOpacity style={{flex: 1, height: 260}}>
              <Card style={{flex: 1, justifyContent: 'center'}}>
               <TouchableOpacity key={item.id} onPress={() => this.selectItem(item)} style={{position: 'absolute', zIndex: 1000, top: 5, left: 140}}>
                <MaterialIcons
                 backgroundColor="#000"
                 borderRadius={0}
                 key={item.id}
                 ref={(ref)=>this.storeRowRef(ref)}
                 size={25}
                 color={'red'}
                 name={item.isSelect === false ? "favorite-border" : "favorite"}
                />
               </TouchableOpacity>
               <CardItem>
                <Body style={{alignItems: 'center', justifyContent: 'center'}}>
                 <Image style={{ width: 130, height: 150}} source={require('../assets/books/2.png')} />
                 <Text><FontAwesome name="rupee" size={13} /> {item.price}</Text>
                 <Text>{item.title}</Text>
                 <Text>{item.location}</Text>
                </Body>
               </CardItem>
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
         />
         <Text style={{width:200, height:200, borderWidth: 1, }}>hello</Text>
         <Text style={{width:200, height:200, borderWidth: 1, }}>how r u</Text>
        </View>
       </ScrollView>
      </View>
     </View>
    </Animated.ScrollView>
   </View>
  );
 }
}

export default Chat;

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
  height: theme.sizes.base * 2.2,
  width: theme.sizes.base * 2.2,
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
