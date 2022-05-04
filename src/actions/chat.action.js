import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import * as React from 'react';
export const navigationRef = React.createRef();

export const createChatRoom = (nav, senderId, receiverId, pid, offer, SellerData) => {
  return async (dispatch) => {
    let data = ''
    try {
      if (offer !== "") {
        data = await firestore()
        .collection('threads')
        .add({
          senderId: senderId,
          receiverId: receiverId,
          pid: pid,
          offer: offer,
          timeCreated: firebase.firestore.Timestamp.now(),
          delete: 0
        })
        .catch(e => console.log("Error", e));

        await firestore()
        .collection('threads')
        .doc(data.id)
        .collection('MESSAGES')
        .add({
          text: offer !== '' ? "My Offer: " + offer : '',
          createdAt: new Date().getTime(),
          user: {
          _id: senderId,
          },
          delete: 0
        });
      }
      
      dispatch({type: "CreateChatRoom", payload: data.id})

      nav.navigate(
        "Chat", {
        thread: data !== '' ? data.id : '',
        uid: senderId,
        receiverId: receiverId,
        pid: pid,
        SellerData: SellerData,
        backScreen: offer !== '' ? 'BuyChatRoom' : 'ExchangeChatRoom'
        }
      )
    } catch (e) {
      console.log("Error in create Room", e)
    }
  }
}

export const sellChatRoom = (uid) => {
  return async (dispatch) => {
    try {
      const data = [];
      await firestore()
        .collection('threads')
        .where("receiverId", "==", uid)
        .onSnapshot(querySnapshot => {
          const threads = querySnapshot.docs.map((documentSnapshot) => {
  
            return {
              _id: documentSnapshot.id,
              ...documentSnapshot.data(),
            };
          });
        
          dispatch({type: "SellChatRoom", payload: threads})
        })
    } catch (e) {
      console.log("Error in create Room", e)
    }
  }
}

export const buyChatRoom = (uid) => {
  return async (dispatch) => {
    try {
      const data = [];
      await firestore()
        .collection('threads')
        .where("senderId", "==", uid)
        .onSnapshot(querySnapshot => {
          const threads = querySnapshot.docs.map((documentSnapshot) => {
            return {
              _id: documentSnapshot.id,
              ...documentSnapshot.data(),
            }; 
          });
          dispatch({type: "BuyChatRoom", payload: threads})
        })
    } catch (e) { 
      console.tron.log("Error in create Room", e)
    }
  }
}

export const deleteChatList = (data, uid, thread, list) => {
  return async (dispatch) => {
    try {
      var db = await firestore()
     // let updateChatId = []
      await data.forEach(async (doc) => {
        var docRef = await db.collection("threads").doc(doc); 
        var docData = await (await db.collection("threads").doc(doc).get()).data(); 

        if (docData.delete !== 0 && docData.delete !== uid) {
          var batch1 = db.batch();
          batch1.delete(docRef);
          batch1.commit()

          let threadData = await docRef.collection('MESSAGES').get()
            .then((snapshot) => {
              console.log("snapshot", snapshot.docs)
              if (snapshot.size == 0) {
                  return 0;
              }

              var batch = db.batch();
              snapshot.docs.forEach((doc) => {
                console.log("doc", doc)
                  batch.delete(doc.ref);
              });

              batch.commit().then(() => {
                  console.log("commit", snapshot.size)
              });
          })
        } else if (docData.delete !== uid) {
          await docRef.update({delete: uid}).then(() => {console.log("Update Successfully")})

        //  updateChatId.push(doc)

          var docRef1 = await db.collection("threads").doc(doc); 
          var batch1 = db.batch();
          var batch2 = db.batch();

          await docRef1.collection('MESSAGES').get().then(async (snapshot) => {
              if (snapshot.size == 0) {
                  return 0;
              }    

              await snapshot.docs.forEach(async (doc) => {
                if (doc.data().delete !== 0 && doc.data().delete !== uid) {
                  await batch2.delete(doc.ref);
                } else if (doc.data().delete !== uid) {
                  await batch1.update(doc.ref, {"delete": uid});
                }
              });
              
              await batch1.commit().then(() => {
              }).catch(error => console.tron.log("errorMSG",error));

              await batch2.commit().then(() => {
              }).catch(error => console.tron.log("errorMSG",error));
          })
        }
      })
      
      // if (updateChatId.length > 0) {
      //   dispatch({type: list, payload: {updateChatId: data, uid: uid}})
      // }
    } catch (e) {
      console.log("Error in Deeee", e)
    }
  }
}

export const deleteChatMessage = (thread, data, uid) => {
  return async (dispatch) => {
    try {
      var db = await firestore()
      var docRef = await db.collection("threads").doc(thread); 
      var batch = db.batch();

      await docRef.collection('MESSAGES').get()
        .then((snapshot) => {
          if (snapshot.size == 0) {
              return 0;
          }

          snapshot.docs.forEach((doc) => {
            data.forEach(async (el) => {
              if (doc.id === el) {
                if (doc.data().delete !== 0 && doc.data().delete !== uid) {
                  batch.delete(doc.ref);
                } else if (doc.data().delete !== uid) {
                  batch.update(doc.ref, {"delete": uid});
                }
              }
            })
          });

          batch.commit()
        })
    } catch (e) {
      console.log("Error in Deeee", e)
    }
  }
}

export const searchChat = (type, data) => { 
  return async (dispatch) => {
    try {
      dispatch({type: type, payload: {data: data, search: true}})  
    } catch (e) {
      console.log("Error in formattedChatList", e)
    }
  }
}

/*export const formattedChatList = () => { 
 return async (dispatch) => {
  try {

  } catch (e) {
   console.log("Error in formattedChatList", e)
  }
 }
}*/


