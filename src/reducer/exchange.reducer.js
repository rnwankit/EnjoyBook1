import MyRequest from '../screens/MyRequestList';

const INITIAL_STATE = {
 ExchangeRequestList: [],
 NumberOfMyRequest: [],
 ExchangeRequestBook: []
}
export const exchangeReducer = (state= INITIAL_STATE, action) => {
 console.log("exchangeReducer", state, action.type, action.payload)
 switch (action.type) {
  case "ExchangeRequest" :
   return {
    ...state,
    MyRequest: state.MyRequest,
   }
  case "NumberOfMyRequest" :
   console.log("NumberOfMyRequestNumberOfMyRequest", state, action.type, action.payload)
   return {
    ...state,
    NumberOfMyRequest: state.NumberOfMyRequest.concat(action.payload)
    //NumberOfMyRequest: state.NumberOfMyRequest !== undefined ?  + state.NumberOfMyRequest + 1 : 1
   }
  case "ExchangeRequestList" : {
   console.log("Helloo reducer", action.payload)
   return {
    ...state,
    ExchangeRequestList: action.payload
   }
  }
  case "MyRequest" : {
   console.log("MyRequest", action.payload)
   return {
    ...state,
    MyRequest: action.payload
   }
  }
  case "ExchangeRequestBook" : {
   console.log("ExchangeRequestBook reducer", state, action.payload)
   return {
    ...state,
    ExchangeRequestBook: action.payload
   }
  }
  case "DeleteRequest" :
   let afterDelete = state.ExchangeRequestList.filter(book => {
    return book.id !== action.payload
   });
   return {
    ...state,
    ExchangeRequestList: afterDelete
   }
   case "DeleteMyRequest" :
   let afterDeleteMyReq = state.MyRequest.filter(book => {
    return book.id !== action.payload
   });
   return {
    ...state,
    MyRequest: afterDeleteMyReq
   }
  default :
   return state;
 }
}
