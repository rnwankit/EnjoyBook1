import React, { useState, useContext, useEffect } from 'react';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
  Message,
  MessageText,
} from 'react-native-gifted-chat';
import {ActivityIndicator, View, StyleSheet, TouchableOpacity, TouchableHighlight, Image, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {theme} from '../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, fonts, sizes} from '../constants/theme';
import {HeaderBackButton} from 'react-navigation-stack';
import HomeHeader from '../components/HomeHeader';
import ChatHeader from '../components/ChatHeader';
import {Block, Text} from '../components';
import {deleteChatMessage} from '../actions/chat.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import firebase from '@react-native-firebase/app';
import Reactotron, {asyncStorage} from 'reactotron-react-native';

function Chat({navigation, chat, deleteChatMessage}) {
  const [messages, setMessages] = useState([]);
  
  const [ itemDeleteChat, setItemDeleteChat ] = useState([]);
  const [ longPressChat, setLongPressChat ] = useState(false);
  const {thread} = navigation.state.params;
  const { uid, receiverId, pid } = navigation.state.params;
  
  async function handleSend(messages) {
    const text = messages[0].text;
    if (thread !== '') {
      firestore()
      .collection('threads')
      .doc(thread)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
        _id: uid,
        },
        delete: 0
      });

      await firestore()
      .collection('threads')
      .doc(thread)
      .set(
        {
        latestMessage: {
          text,
          createdAt: new Date().getTime()
        },
       // delete: 0
        },
        {merge: true}
      );
      console.tron.log({name: "MSG0", value: messages})

      if (messages !== '') {
        console.tron.log({name: "MSG1", value: messages})
        await firestore().collection("threads").doc(thread).update({delete: 0})
        .then(() => console.tron.log("doneeee"))
        .catch(error => console.tron.log("errorUPDATEDELETE",error));
      }
    } else if(thread === '' && messages) {
      console.tron.log({name: "MSG2", value: messages})
        data = await firestore()
        .collection('threads')
        .add({
          senderId: uid,
          receiverId: receiverId,
          pid: pid,
          offer: '',
          timeCreated: firebase.firestore.Timestamp.now(),
          delete: 0
        })
        .catch(e => console.log("Error", e));
      
        await firestore()
        .collection('threads')
        .doc(data.id)
        .collection('MESSAGES')
        .add({
          text,
          createdAt: new Date().getTime(),
          user: {
          _id: uid,
          },
          delete: 0
        });

        navigation.setParams({
          thread: data.id
        })

        await firestore().collection("threads").doc(thread).update({delete: 0})
      .then(() => console.tron.log("doneeee"))
      .catch(error => console.tron.log("errorUPDATEDELETE",error));

        setMessages(messages);
    }
  }

  useEffect(() => {
    navigation.setParams({
      headerLeft: () => <ChatHeader {...navigation} />,
    })

    const messagesListener = firestore()
      .collection('threads')
      .doc(thread)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
        const firebaseData = doc.data();
        //Reactotron.logImportant("firebaseData.delete", firebaseData.delete, uid)
        if (firebaseData.delete !== uid) {
          const data = {
            _id: doc.id, 
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData
          };
  
          if (!firebaseData.system) {
            data.user = {
            ...firebaseData.user,
            };
          }
          return data;
        }
        });

        setMessages(messages);
      });
    
    return () => messagesListener();
  }, [itemDeleteChat, longPressChat]);

  function renderBubble(props) {
    return ( 
      <Bubble 
        {...props} 
        wrapperStyle={{
          left: {
            backgroundColor: 'white',
            marginHorizontal: 10,
            marginVertical: 2,
            opacity: 0.7
          },
          right: {
            backgroundColor: '#DFFBBF',
            marginHorizontal: 10,
            marginVertical: 2,
            opacity: 0.7
          }
        }}
        textStyle={{
          left: {
            color: '#000',
          },
          right: {
            color: '#000',
          }
        }}
      />
    )
  }

  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#6646ee'/>
      </View>
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
        <MaterialIcons name={'send'} size={32} color={theme.colors.primary}/>
        </View>
      </Send>
    );
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <MaterialIcons name={'arrow-drop-down-circle'} size={36} color={colors.primary}/>
      </View>
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
        onClick={() => console.log("Clicked")}
      />
    );
  }

  function  onLongPress(context, message) {
    setItemDeleteChat(oldArray => [...oldArray, message._id])
  }

  function selectItem(id) {   
    let d = itemDeleteChat
    if (d.some(el => el === id)) {
      var index = d.indexOf(id)
      if (index !== -1) {
        d.splice(index, 1);
      }
    } else {
      d.push(id)
    }

    setItemDeleteChat(d)
    setLongPressChat(!longPressChat)

    navigation.setParams({
      itemDeleteChat: d,
      handleSave: _saveDetails,
      handleBack: _handleBack
    })
  }

  function _saveDetails (d) {
    deleteChatMessage(thread, d, uid)
  }

  function _handleBack(d) {
    if (d.length > 0) {
      navigation.setParams({
        itemDeleteChat: 0,
      }) 

      setItemDeleteChat([])
    } else { 
      navigation.navigate(navigation.state.params.backScreen)
    }
  }

  function renderMessageText(props) {
    return (
      <View>
        <TouchableOpacity
          onPress={itemDeleteChat.length === 0 && !longPressChat ? null :  () => selectItem(props.currentMessage._id)} 
          onLongPress={itemDeleteChat.length > 0 || !longPressChat ? () => selectItem(props.currentMessage._id) : null}
        >
          <MessageText 
            {...props}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderMessage(props) {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={itemDeleteChat.length === 0 && !longPressChat ? null :  () => selectItem(props.currentMessage._id)} 
          onLongPress={itemDeleteChat.length > 0 || !longPressChat ? () => selectItem(props.currentMessage._id) : null}
          style={[
            itemDeleteChat !== undefined ? 
              itemDeleteChat.some(el => el === props.currentMessage._id) && navigation.state.params.itemDeleteChat !== undefined ? 
                navigation.state.params.itemDeleteChat.length > 0 ? 
                { backgroundColor: '#CCCCCC'} : itemDeleteChat.length === 0 ? null : {backgroundColor: '#CCCCCC'} 
              : null
            : null
          ], {marginVertical: 2}} 
        >
          <Message
            {...props}
            containerStyle={
              itemDeleteChat !== undefined ? 
                itemDeleteChat.some(el => el === props.currentMessage._id) && navigation.state.params.itemDeleteChat !== undefined ? 
                  navigation.state.params.itemDeleteChat.length > 0 ? 
                  {left: {backgroundColor: '#CCCCCC'}, right: {backgroundColor: '#CCCCCC'}} : itemDeleteChat.length === 0 ? null : {left: {backgroundColor: '#CCCCCC'}, right: {backgroundColor: '#CCCCCC'}} 
                : null
              : null
            }
          />
        </TouchableOpacity>
      </View>
    );
  }
  Reactotron.display({name: 'In chat', value: messages})

 return (
  <GiftedChat
    messages={messages.filter((el) => el !== undefined ? el.delete !== uid : null)}
    onLongPress={(context, message) => {onLongPress(context, message); }}
    onSend={handleSend} 
    user={{_id: uid}}
    placeholder='Type your message here...'
    showUserAvatar={false}
    scrollToBottom 
    renderBubble={(props) => renderBubble(props)}
    renderLoading={renderLoading}
    renderSend={renderSend}
    scrollToBottomComponent={scrollToBottomComponent}
    renderSystemMessage={renderSystemMessage}
    renderMessageText={renderMessageText}
    timeTextStyle={{ left: { color: 'gray' },right: { color:'gray'} }}
    renderAvatar={null}
    renderMessage={renderMessage}
  />
  );
}

function renderHeader(navigation) {
  return(
    <TouchableOpacity activeOpacity={0.7} onPress={() => {navigation.navigate("SellerInfo", {
      SellerData: navigation.state.params.SellerData,
      backScreen: "Chat",
      img: navigation.state.params,
      phone_visible: true
     })}}>
      <Block row center >
       {
        navigation.state.params.SellerData.user.imageUrl !== '' ? <Image
         source={{uri : navigation.state.params.SellerData.user.imageUrl}}
         style={{ width: 40, height: 40, borderRadius: 40/2, marginLeft: -20}}
        /> : <MaterialIcons
         style={{marginLeft: -24, borderRadius: 40/ 2, alignSelf: 'center'}}
         color={theme.colors.gray} name="account-circle" size={40}/>
       }
        <Text style={{color: colors.primary, fontFamily: "Roboto-Medium", fontSize: 18, marginLeft: 16}}>
          {navigation.state.params.SellerData.user.name}
        </Text>
      </Block>
     </TouchableOpacity> 
  )
}

Chat.navigationOptions = ({navigation}) => ({
 headerLeft: (
  <HeaderBackButton onPress={() => {  
    navigation.state.params.itemDeleteChat !== undefined ? 
      navigation.state.params.handleBack(navigation.state.params.itemDeleteChat === undefined ? 
        navigation.state.params.itemDeleteChat.length > 0 ? 
        navigation.state.params.itemDeleteChat.length : 
      0 : 
      navigation.state.params.itemDeleteChat
      ) :
    navigation.navigate(navigation.state.params.backScreen)  
  }}/>),
 headerTitle: () => (
   navigation.state.params.itemDeleteChat === undefined ?
    renderHeader(navigation)
    : navigation.state.params.itemDeleteChat !== undefined ? 
    navigation.state.params.itemDeleteChat.length > 0 ? 
    <Text style={{fontSize: 18}}>{navigation.state.params.itemDeleteChat.length}</Text> : renderHeader(navigation)
  : renderHeader(navigation)
 ),
 headerRight: () =>(
  navigation.state.params.itemDeleteChat !== undefined ?
  navigation.state.params.itemDeleteChat.length > 0 ?
      <TouchableOpacity  
        onPress = {() => { 
          Alert.alert(
            'Delete Chat?',
            'Delete ' + navigation.state.params.itemDeleteChat.length + ' selected chats?',
            [ 
                { 
                    text: 'Cancel', 
                    onPress: () => Reactotron.log('Not Deleted'),
                    style: ' cancel'
                },
                {
                    text: 'DELETE',
                    onPress: () => {
                      navigation.state.params.handleSave(navigation.state.params.itemDeleteChat),
                      navigation.state.params.handleBack(navigation.state.params.itemDeleteChat === undefined ? navigation.state.params.itemDeleteChat.length > 0 ? navigation.state.params.itemDeleteChat.length : 0 : navigation.state.params.itemDeleteChat)
                    }
                }
            ],
            { cancelable: false }
          );  
        }}
      ><MaterialIcons style={{margin: 16}} color={colors.black}  name="delete" size={20}/></TouchableOpacity> : 
    null  : 
  null
),
 headerTitleStyle: {
  color: colors.primary,
  font: fonts.header,
  marginLeft: -20
 },
})

const mapStateToProps = (state) => ({
  chat: state.chatReducer
})
  
const mapDispatchToProps = (dispatch) => {
  return {
    deleteChatMessage: (thread, data, uid) => dispatch(deleteChatMessage(thread, data, uid)),
  };
};
  
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Chat);

const styles = StyleSheet.create({
 loadingContainer: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center'
 },
 sendingContainer: {
  justifyContent: 'center',
  alignItems: 'center'
 },
 bottomComponentContainer: {
  justifyContent: 'center',
  alignItems: 'center'
 },
 systemMessageWrapper: {
  backgroundColor: '#6646ee',
  borderRadius: 4,
  padding: 5
 },
 systemMessageText: {
  fontSize: 14,
  color: '#fff',
  fontWeight: 'bold'
 }
});
