import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '@react-native-firebase/app';

export const update_location = (uid, location, lat, lng) => {
 return async (dispatch) => {
  try {
   const update = await firestore().collection("users")
    .doc(uid)
    .update({
     "location": location,
     "lat": lat.toString(),
     "lng": lng.toString(),
    });
   console.log("From user action update", update)
   dispatch({type: "Location"})
  } catch (e) {
   dispatch({type: "Error", payload: e})}
 }
}

export const update_user_data = (user) => {
 console.log("update_user_data", user)
 return async (dispatch) => {
  try {
   const update = await firestore().collection("users")
    .doc(user.uid)
    .update({
     "name" : user.name,
     "location": user.location,
     "lat": user.lat.toString(),
     "lng": user.lng.toString(),
     "imageUrl": user.imageUrl,
     "phoneNumber": user.phoneNumber,
     "last_modified": user.last_modified,
     "modified_by": user.modified_by
    });
   console.log("From user action update user data", update)
   dispatch({type: "UpdateData", payload: user})
  } catch (e) {
   dispatch({type: "Error", payload: e})}
 }
}

export const updateToken = (uid, token) => {
 console.log("updateToken", uid, token)

 return async (dispatch) => {
  try {
   const updateObj = {
    fcmToken: firebase.firestore.FieldValue.arrayUnion(token),
   };
   await firestore().collection('users')
    .doc(uid)
    .set(
     updateObj
     , {merge: true})
   AsyncStorage.setItem('fcmToken', fcmToken);
   console.log("uuuhuhuh", update)
   dispatch("UpdateToken", update)
  } catch (e) {
   console.log("Error in updateToken", e)
  }
 }
}

export const getUser = (uid) => {
 console.log("uid is", uid)
 return async (dispatch, getState) => {
  try {
   const user = await firestore()
    .collection('users')
    .doc(uid)
    .get()
   await AsyncStorage.setItem('userAllData', JSON.stringify(user.data()));
   dispatch({ type: "UserData", payload: user.data() })
  } catch (e) {
   alert(e)
  }
 }
}

/*export const getSellerInfo = (uid) => {
 console.log("uid is getSellerInfo9990", uid)
 return async (dispatch) => {
  try {
   const user = await firestore()
    .collection('users')
    .doc(uid)
    .get()

   /!*let data = []
    data.push({
    sid: uid,
    user: user.data()
   })*!/
   let data = {
    sid: uid,
    user: user.data()
   }

   console.log("uid is getSellerInfo123",data)
   dispatch({ type: "SellerData", payload: data})
  } catch (e) {
   alert(e)
  }
 }
}*/

export const getSellerInfo = (uid) => {

 let userId = []

 if (!Array.isArray(uid)) {
  userId.push(uid)
 } else {
  userId = uid
 }

 console.log("uid is getSellerInfo999", uid)
 return async (dispatch) => {
  try {
   let items = []

   await firestore()
    .collection('users')
    .where(firebase.firestore.FieldPath.documentId(), 'in', userId)
    .get()
    .then(documentSnapshot => {
     if (!documentSnapshot) {
      return
     }
     documentSnapshot.forEach(function (doc) {
      items.push({
       sid: doc.id,
       user: doc.data()
      });
     })
    })

   console.log("uid is getSellerInfo12389",items)
   dispatch({ type: "SellerData", payload: items})
  } catch (e) {
   alert(e)
  }
 }
}

export const getSellerBook = (uid) => {
 console.log("ooom", uid)
 return async (dispatch, getState) => {
  try {
   const data = [];
   const product = await firestore()
    .collection('product')
    .where("modified_by", "==", uid)
    .onSnapshot(querySnapshot => {
     if (!querySnapshot) {
      return
     }

     querySnapshot.forEach(function (doc) {
      data.push({
       productData: doc.data(),
       Product_id: doc.id
      })

      console.log("xxxxxxxxx", data)
     })
     dispatch({ type: "SellerProductData", payload: data })
    })
  } catch (e) {
   alert(e)
  }
 }
}

export const notificationList = (uid) => {
 console.log("notificationList", uid)
 return async (dispatch) => {
  try {
   let notification = [], readCounter = 0, unreadCounter = 0
   await firestore()
    .collection('notifications')
    .where("to", "==", uid)
    .orderBy('createdAt', 'desc')
    .get()
    .then(querySnapshot => {
     if (!querySnapshot) {
      return
     }
     querySnapshot.forEach( function (doc) {
      if (doc.data().sentAt === '') {
       unreadCounter++
      }
      notification.push(doc.data())
     })
     dispatch({type: 'NotificationList', payload: { unreadCounter: unreadCounter, notification: notification} })
    })
  } catch (e) {

  }
 }
}
