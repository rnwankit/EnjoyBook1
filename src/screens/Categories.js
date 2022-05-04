import React, {Component} from 'react';
import {Block, Card, Text} from '../components/index';
import {HeaderBackButton} from 'react-navigation-stack';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {createCategory} from '../reducer/category.reducer';
import {ScrollView, FlatList, TouchableOpacity} from 'react-native';

class Categories extends Component {

 render() {
 const { createCategory } = this.props;
 console.log("From Categories", createCategory)
  return (
   <ScrollView>
   <Block container style={{marginTop: 16}}>
     <FlatList
      //style={{marginTop: 16}}
      data={createCategory.dataSource !== undefined ?
      createCategory.dataSource.sort((a, b) => (a.value > b.value) ? 1 : -1) : ""}
      numColumns={2}
      keyExtractor={(item, index) => item.key }
      renderItem={({item, index}) =>{
       return (
        <TouchableOpacity
         onPress={() => this.props.navigation.navigate(
          "SubCategories", {
           catId: item.key,
           catName: item.value
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
)(Categories);
