import React, {Component} from 'react';
import {Button, StyleSheet, View, TouchableOpacity, Text, TextInput} from "react-native";
import firestore from '@react-native-firebase/firestore';
import {Form, Item, Label, Picker, Input} from 'native-base';

import Dialog from "react-native-dialog";

class Ch extends Component {
 constructor(props) {
  super(props);
  this.state = {
   category: '',
   subcategory: '',
   parentId: 0,
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
  const items = [];
  firestore()
   .collection('category')
   .where("parentId", "==", 0)
   .onSnapshot(querySnapshot => {
    if(!querySnapshot) {
     return
    }
    querySnapshot.forEach(function(doc) {
     items.push({
      key: doc.id,
      value: doc.data().category
     });
    });
    /*let d = items.sort((a, b)) =>
    {
     return b.value- a.vale;
    }*/
    this.setState({dataSource: items, numRecord: querySnapshot.size});
   })
  return items;
 }

 addCategory = async () => {
  this.setState({isDialogVisible: false,});
   if (this.state.category !== null && this.state.category !== "") {
    this.state.dataSource.length = 0;
    const documentSnapshot = await firestore()
     .collection('category')
     .add({category: this.state.category, parentId: this.state.parentId})
     .then()
     .catch(r => console.log("Error", r));
    this.setState({isDialogVisible: false, error: null,});
   } else {
    this.setState({isDialogVisible: true, error: 'Please Enter Category'});
   }
  this.setState({category: null});
 }

 addSubCategory = async () => {
  this.setState({isDialogVisibleSub: false, errorSub: null});
  if (this.state.subcategory !== null && this.state.subcategory !== "") {
   this.state.dataSubCategory.length = 0;
   const documentSnapshot = await firestore()
    .collection('category')
    .add({category: this.state.subcategory, parentId: this.state.category})
    .then()
    .catch(r => console.log("Error", r));
   this.setState({isDialogVisibleSub: false, errorSub: null,});
  } else {
   this.setState({isDialogVisibleSub: true, errorSub: 'Please Enter Sub-Category'});
  }
 }

 onValueChange1(value: string) {
  this.setState({
   category: value,
   dataSubCategory: ''
  });
  const items = [];
  firestore()
   .collection('category')
   .where("parentId", "==", value)
   .onSnapshot(querySnapshot => {
    querySnapshot.forEach(function(doc) {
     items.push({
      key: doc.id,
      value: doc.data().category
     });
    });
    this.setState({dataSubCategory: items, numRecordSub: querySnapshot.size});
   })
 }

 onValueChange2(value: string) {
  this.setState({
   subcategory: value
  });
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

 render() {
  this.state.dataSource.sort((a, b) => (a.value > b.value) ? 1 : -1)
  this.state.dataSubCategory.length > 0 ?
   this.state.dataSubCategory.sort((a, b) => (a.value > b.value) ? 1 : -1) : '';
  return (
   <View style={styles.container}>
    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
     <Item style={{flex: 10, marginRight: 5}} stackedLabel>
      <Label>Book Category</Label>
      <Item picker>
       <Picker
        selectedValue={this.state.category}
        onValueChange={this.state.numRecord !== 0 ? this.onValueChange1.bind(this) : null}
       >
        <Picker.Item label="--Select Book Category--" value={null} />
        {
         this.state.dataSource.length > 0 ?
          this.state.dataSource.map((category) => (
           <Picker.Item label={category.value} value={category.key} />
          )) : <Picker.Item label="--Select Book Category--" value="0" />
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
    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
     <Item style={{flex: 10, marginRight: 5}} stackedLabel>
      <Label>Book Sub-Category</Label>
      <Item picker>
       <Picker
        selectedValue={this.state.subcategory}
        onValueChange={this.state.numRecordSub !== 0 ? this.onValueChange2.bind(this) : null}
       >
        <Picker.Item label="--Select Book Sub-Category--" value={null} />
        {
         this.state.dataSubCategory.length > 0 ?
          this.state.dataSubCategory.map((subcategory) => (
           <Picker.Item label={subcategory.value} value={subcategory.key} />
          )) : <Picker.Item label="--Select Book Sub-Category--" value={null} />
        }
       </Picker>
      </Item>
     </Item>
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
   </View>
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

export default Ch;
