const INITIAL_STATE = {
 Loading: false,
 isUserId: false,
 Products: [],
 FavData: [],
 ProductWishlist: [],
 MyBooks: [],
 NumberOfViewsAndFav: []
}
export const product = (state=INITIAL_STATE, action) => {
 console.log("bbbzz", action.type, action.payload)

 switch (action.type) {
  case "ProductsData" :
   return {
    ...state,
    Products: action.payload
   }
  case "FavData" :
   return {
    ...state,
    FavData: action.payload
   }
  case "AddFavData" :
   return {
    ...state,
    FavData: action.payload
   }
  case "ProductWishlist" :
   return {
    ...state,
    ProductWishlist: action.payload
   }
  default :
   return state;
 }
}
