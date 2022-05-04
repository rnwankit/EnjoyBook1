import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import {product} from '../reducer/product.reducer';
import * as geolib from 'geolib';
import {getDistance, getPreciseDistance, longitudeKeys, orderByDistance} from 'geolib';

export const AddProductData = (payload) => {
 console.log("addproduct payload", payload)
 return async (dispatch) => {
  try {
   firestore()
    .collection('product')
    .add({
     category: payload.category,
     subcategory: payload.subcategory,
     title: payload.title,
     description: payload.description,
     author: payload.author,
     price: payload.price,
     location: payload.location,
     lat: payload.lat,
     lng: payload.lng,
     phone_visible: payload.phone_visible,
     url: payload.url,
     choice: payload.choice,
     status: payload.status,
     modified_by: payload.modified_by
     })
    .then()
    .catch(r => console.log("Error", r));
   console.log("Add product on action", payload)
   dispatch({type: "AddProduct", payload: payload})
  } catch (e) {
   console.log("Error in Add Product", e)
  }
 }
}

export const getProduct = (uid, lat, lng) => {
 console.log("uid is from productt", uid, lat, lng)
 return async (dispatch, getState) => {
  try {
   const data = [];
   const myBooks = [];
   await firestore()
    .collection('product')
    .onSnapshot(querySnapshot => {
     if (!querySnapshot) {
      return
     }
     querySnapshot.forEach(function (doc) {
      if (doc.data().modified_by !== uid) {
       data.push({
        author: doc.data().author,
        description: doc.data().description,
        category: doc.data().category,
        last_modified: doc.data().last_modified,
        modified_by: doc.data().modified_by,
        phone_visible: doc.data().phone_visible,
        price: doc.data().price,
        subcategory: doc.data().subcategory,
        url: doc.data().url,
        title: doc.data().title,
        location: doc.data().location,
        latitude: parseFloat(doc.data().lat),
        longitude: parseFloat(doc.data().lng),
        distance: '',
        Product_id: doc.id
       })
      }
     })

     let orderByDisData = geolib.orderByDistance({ latitude: lat, longitude: lng }, data);

     /*let cover = item.url;

     let i = arr.indexOf("Cover")
     let arr = []*/
     let arr = []
     orderByDisData.map((i, index) => {
      data[index].distance = (getDistance({latitude: lat, longitude:lng},
       {latitude: i.latitude, longitude: i.longitude}))/1000
     })

     dispatch({ type: "ProductsData", payload: data })
    })
  } catch (e) {
   alert(e)
  }
 }
}

export const addProductFav = (uid, pid) => {
 const updateObj = {
  product_id: firebase.firestore.FieldValue.arrayUnion(pid),
 };
 const updateObjFav = {
  pid: pid,
  favorite: firebase.firestore.FieldValue.increment(1),
 };

 console.log("addProductFav", firestore().collection('favorite').doc(uid), uid, pid)
 return async (dispatch) => {
  try {
   await firestore().collection('favorite')
    .doc(uid)
    .set(
     updateObj
     , {merge: true})
   await firestore().collection('views')
    .doc(pid)
    .set(
     updateObjFav
     , {merge: true})
  } catch (e) {
   console.log("error", e)
  }
 }
}

export const updateView = (pid) => {
 const updateObj = {
  views: firebase.firestore.FieldValue.increment(1),
  pid: pid
 };
 console.log("updateView", pid)
 return async (dispatch) => {
  try {
   await firestore().collection('views')
    .doc(pid)
    .set(
     updateObj
     , {merge: true})
  } catch (e) {
    console.log("updateView error", e)
  }
 }
}

 export const removeProductFav = (uid, pid) => {
 console.log("removeProductFav")
  const updateObj = {
   product_id:  firebase.firestore.FieldValue.arrayRemove(pid),
  };
  const updateObjFav = {
   favorite: firebase.firestore.FieldValue.increment(-1),
  };
  return async (dispatch) => {
   try {
    await firestore().collection('favorite')
     .doc(uid)
     .set(
      updateObj
      , { merge: true })
    await firestore().collection('views')
     .doc(pid)
     .set(
      updateObjFav
      , {merge: true})
   } catch (e) {
    console.log("error", e)
   }
  }
 }

 /*console.log("addProductFav", uid)
 return async (dispatch) => {
  try {
   /!*const fav = {
    user_id: uid,
    product_id: pid
   }*!/
   /!*const pids = []
   let flag = false;*!/
   const result = await firestore().collection('favorite').onSnapshot(querySnapshot => {
    for (let i of querySnapshot.docs) {
    // const doc = querySnapshot.docs[i];
     console.log("iiiii", i.data().product_id)
     console.log("iiiii", pid)
     pids.push({product_id: i.data().product_id})
     if (i.data().pid !== pid) {
      console.log("hello", pids)
      flag = true
      pids.push({product_id: pid})
      break
     }
    }
    console.log("pp", pids)
   })

   if (result) {
    console.log("result", result)
   } else {
    console.log("result")
   }




   if (flag) {
    pids.push(pid)
    /!*await firestore().collection('favorite')
     .doc(uid)
     .set({pid_data: pids});
    dispatch({type: "AddFavData", payload: fav})*!/*/

 export const getProductFav = (uid) => {
 console.log("getProductFav", uid)
  return async (dispatch) => {
   try {
    await firestore()
     .collection('favorite')
     .doc(uid)
     .onSnapshot(querySnapshot => {
      console.log("querySnapshot", querySnapshot.data())
      if (!querySnapshot.exists) {
       console.log("heyyyyypppp")
       return false
      } else {
       dispatch({type: "FavData", payload: querySnapshot.data()})
      }
     })
   } catch (e) {

   }
  }
 }

 export const getProductWishlist = (pid) => {
  console.log("ooo", pid)
  return async (dispatch) => {
   try {
    let data = []

    await pid.map((product_id) => {
     console.log("ooo1", product_id)
       firestore()
      .collection('product')
      .doc(product_id)
      .onSnapshot(querySnapshot => {
       if (!querySnapshot.exists) {
        return false
       } else {
        data.push({
         author: querySnapshot.data().author,
         description: querySnapshot.data().description,
         category: querySnapshot.data().category,
         last_modified: querySnapshot.data().last_modified,
         modified_by: querySnapshot.data().modified_by,
         phone_visible: querySnapshot.data().phone_visible,
         price: querySnapshot.data().price,
         subcategory: querySnapshot.data().subcategory,
         url: querySnapshot.data().url,
         title: querySnapshot.data().title,
         location: querySnapshot.data().location,
         latitude: parseFloat(querySnapshot.data().lat),
         longitude: parseFloat(querySnapshot.data().lng),
         distance: '',
         Product_id: querySnapshot.id
        })

       }
       console.log("dsaa", data)
       dispatch({type: "ProductWishlist", payload: data})
      })
    })

   } catch (e) {
    console.log("Whishlist product error", e)
   }
  }
 }

 /*export const getUserBooks = (uid) => {
  return async (dispatch) => {
   try {
    const data = await firestore()
     .collection("product")
     .where("modified_by", "===", uid)
     .get()
    console.log("My bookssssss", data)
   } catch (e) {

   }
  }
 }*/
