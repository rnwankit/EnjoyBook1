import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

export const addBook = (payload) => {
 console.log("AddBook payload", payload)
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
     last_modified: new Date(),
     modified_by: payload.modified_by
    })
    .then()
    .catch(r => console.log("Error", r));
   console.log("AddBook on action", payload)
   dispatch({type: "AddBook", payload: payload})
  } catch (e) {
   console.log("Error in Add Product", e)
  }
 }
}

export const getBooks = (uid) => {
console.log("Get Books")
 return async (dispatch) => {
  try {
   const data = [];
   const unsubscribe  = await firestore()
    .collection('product')
    .where("modified_by", '==', uid)
    .get()
    .then(querySnapshot => {
     querySnapshot.forEach(function (doc) {
      data.push({
       author: doc.data().author,
       description: doc.data().description,
       category: doc.data().category,
       last_modified: doc.data().last_modified.toDate().toDateString(),
       expired_at: new Date(doc.data().last_modified.toDate().setDate(doc.data().last_modified.toDate().getDate() + 30)).toDateString(),
       modified_by: doc.data().modified_by,
       phone_visible: doc.data().phone_visible,
       price: doc.data().price,
       subcategory: doc.data().subcategory,
       url: doc.data().url,
       choice: doc.data().choice,
       title: doc.data().title,
       location: doc.data().location,
       latitude: parseFloat(doc.data().lat),
       longitude: parseFloat(doc.data().lng),
       distance: '',
       Product_id: doc.id,
       status: doc.data().status
      })
     })
    });
   console.log("xyzzz", data)
   dispatch({ type: "GetBooks", payload: data })
  } catch (e) {

  }
 }
}

export const markAsExchanged = (item, status) => {
 console.log("markAsExchanged", item, status)
 return async (dispatch) => {
  await firestore().collection("product").doc(item.Product_id).update({
   status: status,
  })
  dispatch({type: "MarkAsExchanged", payload: {item: item, status: status}})
 }
}

export const markAsSold = (item) => {
 return async (dispatch) => {
  await firestore().collection("product").doc(item.Product_id).update({
   status: "sold",
  })
  dispatch({type: "MarkAsSold", payload: item})
 }
}

 export const markAsActiveOrDeactive = (item, status) => {
 return async (dispatch) => {
  await firestore().collection("product").doc(item.Product_id).update({
   status: status,
  })
  dispatch({type: "MarkAsActiveOrDeactive", payload: {item: item, status: status}})
 }
}

export const deleteBook = (uid, pid, image) => {
 return async (dispatch) => {
  try {
   const deleteProduct = new Promise((resolve, reject) => {
    let res = firestore()
     .collection("product")
     .doc(pid)
     .delete()

     if (res) {
      resolve("Delete Product")
     } else {
      reject("Error in Product")
     }

   });

   const deleteView = new Promise((resolve, reject) => {
    let res = firestore().collection('views')
     .doc(pid)
     .delete()

    if (res) {
     resolve("Delete Product")
    } else {
     reject("Error in Product")
    }
   });

   const deleteImages = new Promise((resolve, reject) => {
    let fileName = ''
    let F = []

    image.map((img) => {
     if (img.cover) {
      fileName = img.url.substr(94, 45)
      F.push(fileName)
     } else {
      fileName = img.url.substr(94, 40)
      F.push(fileName)
     }
    })

    let res = F.map(async (f) => {
     await firebase.storage().ref(`Pictures/images/${f}`).delete()

     if (res) {
      resolve("Delete Product")
     } else {
      reject("Error in Product")
     }
    })
   })

   Promise.all([deleteProduct, deleteView, deleteImages])
    .then(dispatch({type: "DeleteBook", payload: pid}))
    .catch((e) => console.log(e))
  } catch (e) {
   console.log("Catch", e)
  }
 }
}

export const deleteImage = (image) => {
 console.log("deleteImage", image.includes("Cover"), image)
 return async (dispatch) => {
  try {
   let fileName = '', F = [];

   await image.map((img) => {
    if (img.includes("Cover")) {
     fileName = img.substr(94, 45)
     F.push(fileName)
    } else {
     fileName = img.substr(94, 40)
     F.push(fileName)
    }
   })

   console.log("Fqqqqqqqqqq", F)

   F.map(async (f) => {
    await firebase.storage().ref(`Pictures/images/${f}`).delete()
   })

  } catch (e) {
    console.log("Error in deleteImage", e)
  }
 }
}

export const numberOfView = (ids) => {
 console.log("numberOfView", ids)
 /*const pid = []

 data.map((item) => {
  pid.push(item.Product_id)
 })
 console.log("qqqqqqqqqqqqqqqqqsss", pid)*/
 return async (dispatch) => {
  try {
   const viewData = []
   firestore()
    .collectionGroup('views')
    .where("pid", "in", ids)
    .onSnapshot(querySnapshot => {
     if (!querySnapshot) {
      return
     } else {
      querySnapshot.forEach(function (doc) {
       viewData.push(
        doc.data()
       )
      })
     }
     dispatch({type: "NumberOfViewsAndFav", payload: viewData})
    })
  } catch (e) {
   console.log("error numberOfView", e)
  }
 }
}

export const editBook = (data) => {
 console.log("PIDD", data)
 return async (dispatch) => {
  try {
   await firestore().collection("product").doc(data.Product_id).update(
    data.data
   )
   dispatch({type: "EditBook", payload: data})
  } catch (e) {
    console.log("Error in Edit Book", e)
  }
 }
}
