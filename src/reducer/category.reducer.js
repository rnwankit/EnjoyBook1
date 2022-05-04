export const createCategory = (state={}, action) => {
 console.log("bbb", action.type)
 switch (action.type) {
  case "Loading" :
   return {
    isLoading: true,
    isUserId: true
   }
  case "CategoryList" :
   console.log("Hello Category", action.payload)
   return {
    ...state,
    isLoading: false,
    isUserId: true,
    dataSource: action.payload
   }
  case "Category" :
   return {
    ...state,
    isLoading: false,
    isUserId: true,
    category: action.payload
   }
  case "SubCategoryList" :
   return {
    ...state,
    isLoading: false,
    isUserId: true,
    dataSubCategory: action.payload
   }
  case "SubCategory" :
   console.log("ffrom redu Category", action.payload)
   return {
    ...state,
    isLoading: false,
    isUserId: true,
    subcategory: action.payload
   }
  case "AddCategory" :
   console.log("ffrom redu Category", action.payload)
   return {
    ...state,
    isLoading: false,
    isUserId: true,
   }
  default :
   return state;
 }
}

