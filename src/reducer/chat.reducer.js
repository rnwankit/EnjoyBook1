const INITIAL_STATE = {
 CreateChatRoom: [],
 ExchangeChatRoom: [],
 BuyChatRoom: [],
 SellChatRoom: [],
 ExchangeChatRoom: [],
 SearchExchangeChatRoom: [],
 SearchBuyChatRoom: [],
 SearchSellChatRoom: []
}

export const chatReducer = (state=INITIAL_STATE, action) => {
  console.log("chatReducerchatReducer", state, action)
 switch (action.type) {
  case "CreateChatRoom" :
   return {
    ...state, 
    CreateChatRoom: state.CreateChatRoom !== undefined ? state.CreateChatRoom.concat(action.payload) : action.payload
   }
  case "SearchBuyChatRoom": 
    return {
      ...state,
      SearchBuyChatRoom: action.payload,
    }
  case "SearchSellChatRoom": 
    return {
      ...state,
      SearchSellChatRoom: action.payload,
    }
  case "SearchExchangeChatRoom": 
    return {
      ...state,
      SearchExchangeChatRoom: action.payload,
    }
  case "BuyChatRoom" :
    return {
      ...state,
      BuyChatRoom: action.payload
    }
  case "SellChatRoom" :  
    return {
      ...state,
      SellChatRoom: action.payload
    }
   case "ExchangeChatRoom" :
    let ExchangeChatRoom = state.BuyChatRoom.filter(item => item.offer === '').concat(
      state.SellChatRoom.filter(item => item.offer === '')
     ).sort((a, b) => (a.timeCreated > b.timeCreated) ? 1 : -1)
     
      return {
        ...state,
        ExchangeChatRoom: ExchangeChatRoom
      }
  default :
   return state;
 }
}

/*
  case "BuyChatRoom" :
    console.log("00000000INSELELELE", action.payload)
    if (action.payload.updateChatId !== undefined) {
      var updateData
      updateChatId.map((id) => {
        updateData = state.BuyChatRoom.map((chat) => {
          if (chat._id === id) {
            return {
              ...chat,
              delete: action.payload.uid
            }
          } else {
            return {
              ...chat
            }
          }
        })
      })
      console.tron("UpdateData", updateData)
      return {
        ...state,
        BuyChatRoom: updateData
      }  
    } else {
      return {
        ...state,
        BuyChatRoom: action.payload
      }
    }
   case "SellChatRoom" :  
    if (action.payload.updateChatId !== undefined) {
      console.tron("INSELELELE", action.payload)
      var updateData
      updateChatId.map((id) => {
        updateData = state.SellChatRoom.map((chat) => {
          if (chat._id === id) {
            return {
              ...chat,
              delete: action.payload.uid
            }
          } else {
            return {
              ...chat
            }
          }
        })
      })
      console.tron("UpdateData", updateData)
      return {
        ...state,
        SellChatRoom: updateData
      }  
    } else {
      return {
        ...state,
        SellChatRoom: action.payload
      }
    }
   case "ExchangeChatRoom" :
    let ExchangeChatRoom = state.BuyChatRoom.filter(item => item.offer === '').concat(
      state.SellChatRoom.filter(item => item.offer === '')
     ).sort((a, b) => (a.timeCreated > b.timeCreated) ? 1 : -1)
     if (action.payload.updateChatId !== undefined) {
      var updateData
      updateChatId.map((id) => {
        updateData = state.ExchangeChatRoom.map((chat) => {
          if (chat._id === id) {
            return {
              ...chat,
              delete: action.payload.uid
            }
          } else {
            return {
              ...chat
            }
          }
        })
      })
      console.tron("UpdateData", updateData)
      return {
        ...state,
        ExchangeChatRoom: updateData
      }  
    } else {
      return {
        ...state,
        ExchangeChatRoom: ExchangeChatRoom
      }
    }

*/