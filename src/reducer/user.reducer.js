const INITIAL_STATE = {
 SellerData: [],
}
export const userReducer = (state=INITIAL_STATE, action) => {
 console.log("Fromm User Reducer", state, action.type, action.payload)

 switch (action.type) {
  case "Location" :
   return {
    ...state,
    Loading: false,
    Location: action.payload,
    isUserId: true
   }
  case "UpdateData" :
   return {
    ...state,
    Loading: false,
    user: action.payload,
    isUserId: true
   }
  case "Loading" :
   return {
    ...state,
    isLoading: true,
    token: null,
    isSuccess: false,
    isError: false,
    error: null,
    isLoggedIn: false,
    isUserId: true,
   }
  case "UserData" :
   return {
    ...state,
    isLoading: false,
    token: null,
    user: action.payload,
    isSuccess: true,
    isError: false,
    error: null,
    isLoggedIn: true,
    isUserId: true
   }
  case "Error" :
   return {
    ...state,
    isLoading: false,
    token: null,
    isSuccess: false,
    isError: true,
    error: action.payload,
    isLoggedIn: false,
    isUserId: true
   }
  case "SellerData" :
   return {
    ...state,
    SellerData: state.SellerData.find(element => element.sid === action.payload.sid) ? state.SellerData : state.SellerData.concat(action.payload)
   }
  case "SellerProductData" :
   return {
    ...state,
    SellerProductData: action.payload
   }
  case "UpdateToken":
   return {
    ...state,
    user: action.payload
   }
  case "NotificationList":
   return {
    ...state,
    notification: action.payload
   }
  default :
   return state;
 }
}
