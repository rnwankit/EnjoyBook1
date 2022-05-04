import React, {Component} from 'react';
import {Block, Card, Text} from '../components/index';
import {HeaderBackButton} from 'react-navigation-stack';
import { onValueChange1 } from '../actions/category.action'
import {compose} from 'redux';
import {connect} from 'react-redux';
import {FlatList, ScrollView, TouchableOpacity} from 'react-native';

class SubCategories extends Component {
 static navigationOptions = ({navigation}) => {
  return {
   title: navigation.state.params.catName ? navigation.state.params.catName : "Sub Categories",
  }
 }
 async componentDidMount() {
  const value = {
   category: this.props.navigation.state.params.catId
  }
  await this.props.dispatch((onValueChange1(value)))
 }

 render() {
  const { createCategory } = this.props;
  console.log("In Sub", createCategory.dataSubCategory)
  return (
   <ScrollView>
    <Block container style={{marginTop: 16}}>
     <FlatList
      //style={{marginTop: 16}}
      data={createCategory.dataSubCategory !== undefined ?
       createCategory.dataSubCategory.sort((a, b) => (a.value > b.value) ? 1 : -1) : ""}
      numColumns={2}
      keyExtractor={(item, index) => item.key }
      renderItem={({item, index}) =>{
       return (
        <TouchableOpacity
         onPress={() => this.props.navigation.navigate(
          "SubCategories", {
           catId: item.key
          }
         )}
         style={{ justifyContent: 'space-between',}}
        >
         <Card middle center shadow
               style={{
                width: 160,
                height: 36,
                marginRight: 7,
                paddingHorizontal: 0,
                paddingVertical: 20,
               }}>
          <Text h3 style={{textAlign: 'center'}}>{item.value}</Text>
         </Card>
        </TouchableOpacity>
       )
      }
      }
     />
    </Block>
   </ScrollView>
  );
 }
}

const mapStateToProps = (state) => ({
 createCategory: state.createCategory,
})

const mapDispatchToProps = (dispatch) => ({
 dispatch
});

export default compose(
 connect(mapStateToProps, mapDispatchToProps),
)(SubCategories);
