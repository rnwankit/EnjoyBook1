
import React, {Component} from 'react';
import {Button, StyleSheet, View, TouchableOpacity, Text, TextInput, ScrollView, Picker} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Form, Item, Label, Input} from 'native-base';

import Dialog from "react-native-dialog";
import {compose} from 'redux';
import {connect} from 'react-redux';

import { get_category_list, onValueChange1, onValueChange2, addCategory} from '../actions/category.action';
import categoryReducer from '../reducer/category.reducer';
import Loader from './Loader';
import Block from './Block';

class Category extends Component {
 constructor(props) {
  super(props);
  this.state = {
   category: '',
   subcategory: '',
   parentId: "$",
   dataSource: [],
   dataSubCategory: [],
   isDialogVisible: false,
   isDialogVisibleSub: false,
   error: null,
   errorSub: null,
   numRecord: '',
   numRecordSub: '',
  };
 }

 async componentDidMount(){
  await this.get_category_list();
 }

 get_category_list = () => {
  this.props.dispatch(get_category_list())
 }

 addCategory = () => {
  const {createCategory} = this.props;
  this.setState({isDialogVisible: false,});
  if (this.state.category !== null && this.state.category !== "") {
   createCategory.dataSource.length = 0;
   const values = {
    category: this.state.category,
    parentId: this.state.parentId
   }
   this.props.dispatch(addCategory(values));
   this.setState({isDialogVisible: false, error: null,});
   /*} else {
    this.setState({isDialogVisible: true, error: 'Please Enter Category'});
   }*/
   this.setState({category: null});
  } else {
   this.setState({isDialogVisible: true, error: 'Please Enter Category'});
  }
 }

 addSubCategory = async () => {
  const {createCategory} = this.props;
  console.log("addsub", this.state.subcategory)
  //console.log("addsub this.state.category", this.state.category)
  this.setState({isDialogVisibleSub: false, errorSub: null});
  if (this.state.subcategory !== null && this.state.subcategory !== "") {
   createCategory.dataSubCategory.length = 0;
   const values = {
    category: this.state.subcategory,
    parentId: createCategory.category
   }
   this.props.dispatch(addCategory(values));
   this.setState({isDialogVisibleSub: false, errorSub: null,});
  } else {
   this.setState({isDialogVisibleSub: true, errorSub: 'Please Enter Sub-Category'});
  }
 }

 onValueChange1(value: string) {
  const values = {
   category: value,
   dataSubCategory: ''
  }
  this.props.dispatch(onValueChange1(values))
 }

 onValueChange2(value: string) {
  const values = {
   subcategory: value
  }
  this.props.dispatch(onValueChange2(values))
 }

 showCat = () => {
  this.setState({isDialogVisible: true, category: null});
 }
 showSubCat = () => {
  this.setState({isDialogVisibleSub: true, subcategory: ''});
 }
 cancelCat = () => {
  this.setState({isDialogVisible: false, error: null, category: null});
 }
 cancelSubCat = () => {
  this.setState({isDialogVisibleSub: false, errorSub: null, });
 }
 changeText = (text) => {
  this.setState({subcategory: text})
 }

 renderDisplaySubCategory = () => {
  const { createCategory } = this.props;
  createCategory.dataSubCategory.length > 0 ?
   createCategory.dataSubCategory.sort((a, b) => (a.value > b.value) ? 1 : -1) : '';

  return (
   <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
    <Item style={{flex: 10, marginRight: 5}} stackedLabel>
     <Label>Book Sub-Category</Label>
     <Item picker>
      <Picker
       selectedValue={createCategory.subcategory !== undefined ? createCategory.subcategory : null}
       onValueChange={createCategory.dataSubCategory.length > 0 ? this.onValueChange2.bind(this) : null}
      >
       {
        createCategory.dataSubCategory.length > 0 ?
         createCategory.dataSubCategory.map((subcategory) => (
          <Picker.Item label={subcategory.value} value={subcategory.key} />
         )) : <Picker.Item label="--Select Book Sub-Category--" value={null} />
       }
      </Picker>
     </Item>
    </Item>
    <Button style={{flex: 1, height: 10}} disabled={createCategory.category == null ? true : false} title={"Add Sub Category"} onPress={this.showSubCat}/>
    <Dialog.Container visible={this.state.isDialogVisibleSub}>
     <Dialog.Title>Add Sub Category</Dialog.Title>
     <Dialog.Description>
      Please Enter Sub Category Name
     </Dialog.Description>
     <Dialog.Input
      wrapperStyle={this.state.errorSub !== null ? styles.dialogError : styles.dialogBorder}
      onChangeText = {(inputText) => {this.changeText(inputText)}} />
     {this.state.errorSub !== null ? <Text style={{color: 'red', marginLeft: 10}}>{this.state.errorSub}</Text> : "" }
     <Dialog.Button label="Submit" onPress={this.addSubCategory} />
     <Dialog.Button label="Cancel" onPress={this.cancelSubCat} />
    </Dialog.Container>
   </View>
  );
 }

 renderDisplay = () => {
  const { createCategory } = this.props;
  createCategory.dataSource.length > 0 ?
   createCategory.dataSource.sort((a, b) => (a.value > b.value) ? 1 : -1) : '';
  console.log("xxxxx", createCategory.category)
  return (
   <Block container>
    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
     {createCategory.isLoading && <Loader />}
     <Item style={{flex: 10, marginRight: 5}} stackedLabel>
      <Label>Book Category</Label>
      <Item picker>
       <Picker
        selectedValue={createCategory.category}
        onValueChange={createCategory.dataSource.length > 0 ? this.onValueChange1.bind(this) : null}
       >
        {
         createCategory.dataSource.length > 0 ?
          createCategory.dataSource.map((category) => (
           <Picker.Item label={category.value} value={category.key} />
          )) : <Picker.Item label="--Select Book Category--" value={null} />
        }
       </Picker>
      </Item>
     </Item>
     <Button style={{flex: 1, height: 10}} title={"Add Category"} onPress={this.showCat}/>
     <Dialog.Container visible={this.state.isDialogVisible}>
      <Dialog.Title>Add Category</Dialog.Title>
      <Dialog.Description>
       Please Enter Category Name
      </Dialog.Description>
      <Dialog.Input
       wrapperStyle={this.state.error !== null ? styles.dialogError : styles.dialogBorder}
       onChangeText = {(inputText) => {this.setState({category: inputText})}} />
      {this.state.error !== null ? <Text style={{color: 'red', marginLeft: 10}}>{this.state.error}</Text> : "" }
      <Dialog.Button label="Submit" onPress={this.addCategory} />
      <Dialog.Button label="Cancel" onPress={this.cancelCat} />
     </Dialog.Container>
    </View>
    {createCategory.dataSubCategory !== undefined ? this.renderDisplaySubCategory() : <Text>Nothing</Text>}
   </Block>
  );
 }

 renderAddSubCategory = () => {
  return (
   <View>
   <Picker>
    <Picker.Item label="--Select Book Category--" value={null} />
   </Picker>
 <Button style={{flex: 1, height: 10}} disabled={this.state.category == null ? true : false} title={"Add Sub Category"} onPress={this.showSubCat}/>
 <Dialog.Container visible={this.state.isDialogVisibleSub}>
 <Dialog.Title>Add Sub Category</Dialog.Title>
 <Dialog.Description>
 Please Enter Sub Category Name
 </Dialog.Description>
 <Dialog.Input
 wrapperStyle={this.state.errorSub !== null ? styles.dialogError : styles.dialogBorder}
 onChangeText = {(inputText) => {this.changeText(inputText)}} />
 {this.state.errorSub !== null ? <Text style={{color: 'red', marginLeft: 10}}>{this.state.errorSub}</Text> : "" }
 <Dialog.Button label="Submit" onPress={this.addSubCategory} />
 <Dialog.Button label="Cancel" onPress={this.cancelSubCat} />
 </Dialog.Container>
  </View>
  )
 }

 render() {
  const { createCategory } = this.props;
  {console.log("createCategory.dataSource", createCategory.dataSource)}
  return (
   <ScrollView>
    {createCategory.dataSource != undefined ? this.renderDisplay() : <Text>Nothing</Text>}
   </ScrollView>

  );
 }
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  margin: 10
 },
 dialogBorder: {
  borderWidth: 1,
  borderColor: '#ddd',
  paddingLeft: 10
 },
 dialogError: {
  borderWidth: 1,
  borderColor: 'red',
  paddingLeft: 10
 }
});

const mapStateToProps = (state) => ({
 createCategory: state.createCategory
})

const mapDispatchToProps = (dispatch) => ({
 dispatch
});

export default compose(
 connect(mapStateToProps, mapDispatchToProps),
)(Category);
