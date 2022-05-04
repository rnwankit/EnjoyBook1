export const createUser = (state={}, action) => {
    console.log("Auth Reducer", action.type, action.payload)
    switch (action.type) {
        case "Loading" :
            return {
                isLoading: false,
                error: null,
                isLoggedIn: false,
                isUserId: false,
                changeNumber: false,
                confirmResult: null,
            }
        case "ChangeNumber" :
            return {
                isLoading: false,
                error: null,
                isLoggedIn: false,
                isUserId: false,
                confirmResult: null,
                changeNumber: true,
            }
        case "OTP" :
            return {
                ...state,
                isLoading: false,
                confirmResult: action.payload,
                error: null,
                isLoggedIn: false,
                isUserId: false,
                changeNumber: false,
            }
        case "Success" :
            return {
                ...state,
                isLoading: false,
                user: action.payload,
                error: null,
                isLoggedIn: true,
                isUserId: true,
                changeNumber: false,
            }
        case "Error" :
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                isLoggedIn: false,
                isUserId: false,
                changeNumber: false,
            }
        case "signOut" :
            return {
                isLoading: false,
                error: null,
                isLoggedIn: false,
                isUserId: false,
                user: null,
                confirmResult: null,
                changeNumber: false,
            }
        default :
            return state;
    }
}
