const INITIAL_STATE = {
 MyBooks: [],
}
export const myBooksReducer = (state=INITIAL_STATE, action) => {
 console.log("myBooksReducer", action.type, action.payload)
 switch (action.type) {
  case "AddBook" :
   return {
    ...state,
    MyBooks: state.MyBooks.concat(action.payload)
   }
  case "EditBook" :
   var mybooks = state.MyBooks.map((p) => {
    if (p.Product_id === action.payload.Product_id) {
     return {
      ...p,
      author: action.payload.data.author,
      description: action.payload.data.description,
      category: action.payload.data.category,
      modified_by: action.payload.data.modified_by,
      phone_visible: action.payload.data.phone_visible,
      price: action.payload.data.price,
      subcategory: action.payload.data.subcategory,
      url: action.payload.data.url,
      choice: action.payload.data.choice,
      title: action.payload.data.title,
      location: action.payload.data.location,
      latitude: parseFloat(action.payload.data.lat),
      longitude: parseFloat(action.payload.data.lng),
      Product_id: action.payload.Product_id,
      status: action.payload.data.status
     }
    } else {
     return p
    }
   })
   return {
    ...state,
    MyBooks: mybooks
   }
  case "DeleteBook" :
   let afterDelete = state.MyBooks.filter(book => {
    return book.Product_id !== action.payload
   });
   return {
    ...state,
    MyBooks: afterDelete
   }
  case "GetBooks" :
   state.MyBooks = []
   console.log("GetBooks kk", state)
   return {
    ...state,
    MyBooks: action.payload
   }
  case "NumberOfViewsAndFav" :
   console.log("NumberOfViewsAndFav kk", action.payload, state)
   return {
    ...state,
    NumberOfViewsAndFav: action.payload
   }
  case "MarkAsExchanged" :
   var mybooks = state.MyBooks.map((p) => {
    if (p.Product_id === action.payload.item.Product_id) {
     console.log("matched MarkAsExchanged",action.payload.status)
     return {
      ...p,
      status: action.payload.status
     }
    } else {
     return p
    }
   })
   return {
    ...state,
    MyBooks: mybooks
   }
  case "MarkAsSold" :
   var mybooksSold = state.MyBooks.map((p) => {
    if (p.Product_id === action.payload.Product_id) {
     return {
      ...p,
      status: "sold"
     }
    } else {
     return p
    }
   })
   return {
    ...state,
    MyBooks: mybooksSold
   }
  case "MarkAsActiveOrDeactive" :
   var mybooks = state.MyBooks.map((p) => {
    if (p.Product_id === action.payload.item.Product_id) {
     return {
      ...p,
      status: action.payload.status
     }
    } else {
     return p
    }
   })
   return {
    ...state,
    MyBooks: mybooks
   }
  default :
   return state;
 }
}
