import firestore from '@react-native-firebase/firestore';

export const get_category_list = () => {
 return async (dispatch) => {
  try {
   const items = [];
   firestore()
    .collection('category')
    .where("parentId", "==", "$")
    .onSnapshot(querySnapshot => {
     if (!querySnapshot) {
      return
     }
     querySnapshot.forEach(function (doc) {
      items.push({
       key: doc.id,
       value: doc.data().category,
       numRecord: querySnapshot.size
      });

     });
     console.log("get_category_list in action", items)
     { dispatch({type: "CategoryList", payload: items}) }
    })
  } catch (e) {
   alert("Error: ", e);
  }
 }
}

export const onValueChange1 = (payload) => {
 console.log("ppp", payload)
 return async (dispatch) => {
  try {
   { dispatch({type: "Category", payload: payload.category}) }
   //console.log("on valu", payload.category)
   const items = [];
   firestore()
    .collection('category')
    .where("parentId", "==", payload.category)
    .onSnapshot(querySnapshot => {
     querySnapshot.forEach(function (doc) {
      items.push({
       key: doc.id,
       value: doc.data().category,
       numRecordSub: querySnapshot.size
      });
     });
     { dispatch({type: "SubCategoryList", payload: items}) }
    })
  } catch (e) {
   alert("Error in onchange: ", e);
  }
 }
}

export const onValueChange2 = (payload) => {
 console.log("subb", payload.subcategory)
 return async (dispatch) => {
  try {
   {dispatch({type: "SubCategory", payload: payload.subcategory})}
  } catch (e) {
   alert("Error in subcategory: ", e);
  }
 }
}

export const addCategory = (payload) => {
 console.log("add catgory", payload.category)
 console.log("add catgory payload.parentId", payload.parentId)
 return async (dispatch) => {
  try {
   const documentSnapshot = firestore()
    .collection('category')
    .add({category: payload.category, parentId: payload.parentId})
    .then()
    .catch(r => console.log("Error", r));
   if (payload.parentId == 0) {
    {dispatch({type: "Category", payload: null})}
   } else {
    {dispatch({type: "Category", payload: payload.parentId})}
   }

  } catch (e) {
   alert("Error in Add Category", e);
  }
 }
}

/*export const addCategory = () => {
 this.setState({isDialogVisible: false,});
 if (this.state.category !== null && this.state.category !== "") {
  this.state.dataSource.length = 0;
  const documentSnapshot = firestore()
   .collection('category')
   .add({category: this.state.category, parentId: this.state.parentId})
   .then()
   .catch(r => console.log("Error", r));
  this.setState({isDialogVisible: false, error: null,});
 } else {
  this.setState({isDialogVisible: true, error: 'Please Enter Category'});
 }
 this.setState({category: null});
}*/
