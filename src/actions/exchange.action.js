/*import firestore from '@react-native-firebase/firestore';

export const exchangeRequest = (uid, uname, pid, ptitle, sid, exchangeWith) => {
 console.log("exchangeRequest", sid)
 return async (dispatch) => {

  let exchangeBookID = []
  let exchangeBookName = []

  try {
   exchangeWith.map((e) => {
    exchangeBookID.push(e.key),
     exchangeBookName.push(e.value)
   })

   const title = "Exchange Request: "
   const message = uname + " wants to exchange book " + exchangeBookName.toString() + " with " +  ptitle + "."

   let fcmToken = []
   await firestore()
    .collection('devices')
    .where("uid", '==', sid)
    .where("active", "==", false)
    .get()
    .then(querySnapshot => {
     if (!querySnapshot) {
      return
     }
     querySnapshot.forEach( function (doc) {
      fcmToken =  doc.data().fcmToken
     })
    })

   if (fcmToken.length > 0) {
    const FIREBASE_API_KEY = 'AAAANfTKpVM:APA91bGwRSCajXZMe-a4B6knVJYZhqdSLwdRRbpu1hCr0gRabvxxoFGLmGwX9oG_HoZEkSsXBNe3CQrrsxda3WGS3T-6LH3KRO3MtnuQNGOu4SB5V1XAoyxu7P5YXiL6bRc0HIF2uNi5'
    const messageJ = {
     registration_ids: fcmToken,
     notification: {
      title:  title,
      body: message,
      imageUrl:'https://firebasestorage.googleapis.com/v0/b/enjoybook-efaae.appspot.com/o/Pictures%2Fimages%2Fce_4.PNG?alt=media&token=2f1a4d36-b6c7-497a-ba8d-862d4d5ebb71',
     },

     data: {
      body: 'Message body',
      title: 'Message title',
      type: 'Chat',
      priority:"high",
      color:"#00ACD4",
      big_picture:'https://cdn.pixabay.com/photo/2018/01/21/01/46/architecture-3095716_960_720.jpg',
      picture:'https://cdn.pixabay.com/photo/2018/01/21/01/46/architecture-3095716_960_720.jpg',
      image:'https://cdn.pixabay.com/photo/2018/01/21/01/46/architecture-3095716_960_720.jpg',
      show_in_foreground: true,
      'mutable_content': true,
     }
    }

    let headers = new Headers({
     "Content-Type": "application/json",
     "Authorization": "key=" + FIREBASE_API_KEY
    });

    let response =  await fetch("https://fcm.googleapis.com/fcm/send", { method: "POST", headers, body: JSON.stringify(messageJ) })
    response =  await response.json();
    console.log("jhjhjhjhj", response)
    await firestore().collection('notifications')
     .doc()
     .set({
      "from": uid,
      "to": sid,
      "title": title,
      "message": message,
      "type": "exchange",
      "createdAt": new Date(),
      "sentAt": new Date(),
      "readAt": '',
     })
   } else {
    await firestore().collection('notifications')
     .doc()
     .set({
      "from": uid,
      "to": sid,
      "title": title,
      "message": message,
      "type": "exchange",
      "createdAt": new Date(),
      "sentAt": '',
      "readAt": '',
     })
   }

   await firestore().collection('exchange')
    .doc()
    .set({
     "from": uid,
     "to": sid,
     "pid": pid,
     "exchangeBookID": exchangeBookID,
     "type": "exchange",
     "createdAt": new Date(),
     "status": ''
    })

   dispatch({type: "ExchangeRequest", payload: ""})
  } catch (e) {

  }
 }
}

export const exchangeRequestList = (uid) => {
 return async (dispatch) => {
  try {
   const allExReq = new Promise((resolve, reject) => {
    let data = firestore()
     .collection("exchange")
     .where("to", "==", uid)
     .get()

    if (data) {
     resolve(data)
    } else {
     reject("Error in fetch request")
    }
   })

   let finalExData = []

   function bookData(data) {
    return new Promise(async (resolve, reject) => {
     let product;
     console.log("START")
     await data.forEach( (doc) => {
      doc.data().exchangeBookID.map(async (d, index) => {
       product =  await firestore()
        .collection("product")
        .doc(d)
        .get()

       //doc.data().exchangeBookID[index] = { id: d, data:product.data()}
       console.log("Before Between", product.data() )
       doc.data().exchangeBookID[index] = product.data()
       // finalExData[doc.id] = doc.data()
       // finalExData.push({id: doc.id, data: doc.data()})

       /!*if (finalExData) {
        resolve(finalExData)
       } else {
        reject("Error in fetch request")
       }*!/
      })
      console.log("Between", doc.data())
      finalExData.push({id: doc.id, data: doc.data()})
      /!*finalExData.push({id: doc.id, data: doc.data()})
      if (finalExData) {
       resolve(finalExData)
      } else {
       reject("Error in fetch request")
      }*!/
     })
     console.log("END", finalExData)
     if (finalExData) {
      resolve(finalExData)
     } else {
      reject("Error in fetch request")
     }
    })
   }

   const x = allExReq.then(async data => {
    return await bookData(data)
   }).then(allExReqData => {
    console.log("After END", allExReqData)
    dispatch({type: "ExchangeRequestList", payload: allExReqData})
   })
    .catch(err => {
     console.log(err)
    })

   Promise.all([x])
    .then(dispatch({type: "ExchangeRequestList", payload: allExReqData}))
    .catch((e) => console.log(e))
  } catch (e) {

  }
 }
}*/

import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import {AsyncStorage} from 'react-native';

export const exchangeRequest = (uid, uname, pid, ptitle, sid, exchangeWith) => {
 console.log("exchangeRequest", sid)
 return async (dispatch) => {

  let exchangeBookID = []
  let exchangeBookName = []

  try {
   exchangeWith.map((e) => {
    exchangeBookID.push(e.key),
     exchangeBookName.push(e.value)
   })

   const title = "Exchange Request: "
   const message = uname + " wants to exchange book " + exchangeBookName.toString() + " with " +  ptitle + "."

   let fcmToken = []
   await firestore()
    .collection('devices')
    .where("uid", '==', sid)
    .where("active", "==", false)
    .get()
    .then(querySnapshot => {
     if (!querySnapshot) {
      return
     }
     querySnapshot.forEach( function (doc) {
      fcmToken =  doc.data().fcmToken
     })
    })

   if (fcmToken.length > 0) {
    const FIREBASE_API_KEY = 'AAAANfTKpVM:APA91bGwRSCajXZMe-a4B6knVJYZhqdSLwdRRbpu1hCr0gRabvxxoFGLmGwX9oG_HoZEkSsXBNe3CQrrsxda3WGS3T-6LH3KRO3MtnuQNGOu4SB5V1XAoyxu7P5YXiL6bRc0HIF2uNi5'
    const messageJ = {
     registration_ids: fcmToken,
     notification: {
      title:  title,
      body: message,
      imageUrl:'https://firebasestorage.googleapis.com/v0/b/enjoybook-efaae.appspot.com/o/Pictures%2Fimages%2Fce_4.PNG?alt=media&token=2f1a4d36-b6c7-497a-ba8d-862d4d5ebb71',
     },

     data: {
      body: 'Message body',
      title: 'Message title',
      type: 'Chat',
      priority:"high",
      color:"#00ACD4",
      big_picture:'https://cdn.pixabay.com/photo/2018/01/21/01/46/architecture-3095716_960_720.jpg',
      picture:'https://cdn.pixabay.com/photo/2018/01/21/01/46/architecture-3095716_960_720.jpg',
      image:'https://cdn.pixabay.com/photo/2018/01/21/01/46/architecture-3095716_960_720.jpg',
      show_in_foreground: true,
      'mutable_content': true,
     }
    }

    let headers = new Headers({
     "Content-Type": "application/json",
     "Authorization": "key=" + FIREBASE_API_KEY
    });

    let response =  await fetch("https://fcm.googleapis.com/fcm/send", { method: "POST", headers, body: JSON.stringify(messageJ) })
    response =  await response.json();
    console.log("jhjhjhjhj", response)
    await firestore().collection('notifications')
     .doc()
     .set({
      "from": uid,
      "to": sid,
      "title": title,
      "message": message,
      "type": "exchange",
      "createdAt": new Date(),
      "sentAt": new Date(),
      "readAt": '',
     })
   } else {
    await firestore().collection('notifications')
     .doc()
     .set({
      "from": uid,
      "to": sid,
      "title": title,
      "message": message,
      "type": "exchange",
      "createdAt": new Date(),
      "sentAt": '',
      "readAt": '',
     })
   }

   await firestore().collection('exchange')
    .doc()
    .set({
     "from": uid,
     "to": sid,
     "pid": pid,
     "exchangeBookID": exchangeBookID,
     "type": "exchange",
     "createdAt": new Date(),
     "status": 'sent'
    })

   dispatch({type: "ExchangeRequest"})
   dispatch({type: "NumberOfMyRequest", payload: pid})

  } catch (e) {

  }
 }
}

export const exchangeBookInfo = (bookId) => {
 console.log("exchangeBookInfoexchangeBookInfo", bookId)
 return async (dispatch) => {
  try {
   let items = []

   console.log("bookIdbookIdbookId", bookId)
   await firestore()
    .collection('product').where(firebase.firestore.FieldPath.documentId(), 'in', bookId)
    .get()
    .then(documentSnapshot => {
     if (!documentSnapshot) {
      return
     }
     documentSnapshot.forEach(function (doc) {
      items.push({
       id: doc.id,
       data: doc.data()
      });
     })
    })

   { dispatch({type: "ExchangeRequestBook", payload: items}) }
  } catch (e) {
    console.log("Error in xqk", e)
  }
 }
}

export const exchangeRequestList = (uid) => {
 return async (dispatch) => {
  try {
   let items = [];
   await firestore()
     .collection("exchange")
     .where("to", "==", uid)
     .where("status", "==", 'sent')
     .get()
     .then(querySnapshot => {
      if (!querySnapshot) {
       return
      }
      querySnapshot.forEach(function (doc) {
       items.push({
        id: doc.id,
        data: doc.data()
       });
      });
     })
   //if (items.length > 0) {
    console.log("get_exchange_request_list in action", items.length)
    { dispatch({type: "ExchangeRequestList", payload: items}) }
   //}

  /* let product
   let finalExData = []
   function getBookData(documentSnapshot) {
    documentSnapshot.forEach( function (doc) {
     doc.data().exchangeBookID.map((d, index) => {
      console.log("ddddddddddddddddddddd", d)
     })
    })
    /!*let ExBookData = []
    console.log("getBookData")
    documentSnapshot.forEach( function (doc) {
     doc.data().exchangeBookID.map(async (d, index) => {
      console.log("d is", d)
      product = await firestore()
       .collection("product")
       .doc(d)
       .get()

      //ExBookData.push({ExReqId: doc.id, ExBook: {id: d, data: product.data()}})

      // productData.push({id: doc.id, pid: d, data: product.data()})

     })

     //finalExData.push({id: doc.id, data: doc.data()})
    })
    return product*!/
  //  return documentSnapshot
   }

   //dispatch({type: "ExchangeRequestBook", payload: ExBookData})
   dispatch({type: "ExchangeRequestList", payload: finalExData})*/
  } catch (e) {
   console.log("Error is", e)
  }
 }
}

export const deleteRequest = (id, from, title, message, file) => {
 return async (dispatch) => {
  try {
   /*const FIREBASE_API_KEY = 'AAAANfTKpVM:APA91bGwRSCajXZMe-a4B6knVJYZhqdSLwdRRbpu1hCr0gRabvxxoFGLmGwX9oG_HoZEkSsXBNe3CQrrsxda3WGS3T-6LH3KRO3MtnuQNGOu4SB5V1XAoyxu7P5YXiL6bRc0HIF2uNi5'
   const messageJ = {
    registration_ids: from,
    notification: {
     title:  title,
     body: message,
    },
   }

   let headers = new Headers({
    "Content-Type": "application/json",
    "Authorization": "key=" + FIREBASE_API_KEY
   });

   let response =  await fetch("https://fcm.googleapis.com/fcm/send", { method: "POST", headers, body: JSON.stringify(messageJ) })
   response =  await response.json();*/

   const uid = await AsyncStorage.getItem('uid');

   if (file === "ExchangeRequest") {
    await firestore().collection('notifications')
     .doc()
     .set({
      "from": uid,
      "to": from,
      "title": title,
      "message": message,
      "type": "delete_exchange",
      "createdAt": new Date(),
      "sentAt": new Date(),
      "readAt": '',
     })
   }

   await firestore()
    .collection("exchange")
    .doc(id)
    .update({
      status: 'delete',
     })
    .then(() => {
     if (file === "ExchangeRequest") {
      dispatch({type: "DeleteRequest", payload: id})
     } else {
      dispatch({type: "DeleteMyRequest", payload: id})
     }
    })

  } catch (e) {
   console.log("Error in Delete Request", e)
  }
 }
}

export const myRequest = (uid) => {
 console.log("myRequestmyRequest", uid)
 return async (dispatch) => {
  try {
   let items = [];
   await firestore()
    .collection("exchange")
    .where("from", "==", uid)
    .where("status", "==", 'sent')
    .get()
    .then(querySnapshot => {
     if (!querySnapshot) {
      return
     }
     querySnapshot.forEach(function (doc) {
      items.push({
       id: doc.id,
       data: doc.data()
      });
     });
     console.log("get_exchange_request_list in action", items)
    })
    { dispatch({type: "MyRequest", payload: items}) }
  } catch (e) {
   console.log("Error is", e)
  }
 }
}
