import {AsyncStorage,} from 'react-native';
import {createStore, applyMiddleware} from 'redux';
import reducers from '../reducer';
import thunk from 'redux-thunk';
import { reactotron } from './reactotron';
import {compose} from 'redux';
import Reactotron, {asyncStorage} from 'reactotron-react-native';
import { persistStore, persistReducer } from 'redux-persist';
import { reactotronRedux } from 'reactotron-redux';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    //whitelist: ["createUser", "userReducer"]
}

/*const middlewares = [];
// Initialising a middlewares array, later on you can add a
// saga middleware for example
if (__DEV__) { // Check if it's development mode
    const reactotronMiddleware = reactotron.createEnhancer();
    // Creating Reactotron "data capturer"
    middlewares.push(reactotronMiddleware);
    // And pushing it to the middlewares array
}*/

//middlewares.push(thunk)

const persistedReducer = persistReducer(persistConfig, reducers)

export default () => {
    let store = createStore(persistedReducer, compose(applyMiddleware(thunk), reactotron.createEnhancer()));
    let persistor = persistStore(store)
    // console.tron.log("props", )
    
    //     Reactotron.onCustomCommand({
    //         command: "SubCategoryList",
    //         handler: () => {store.dispatch({
    //             type: 'SubCategoryList',
    //             payload: [
    //               {
    //                 key: 'Ca67JvseQBpN6l4QFUby',
    //                 value: 'Biography and Autobiography',
    //                 numRecordSub: 2
    //               },
    //               {
    //                 key: '2x89TZgHbmvruWvRGfou',
    //                 value: 'Personal Memory',
    //                 numRecordSub: 2
    //               }
    //             ]
    //           }),store.dispatch({
    //             type:'Category', 
    //             payload: '07CSFKmmOsUY20RQ8md9'
    //         })},
    //        // handler: () => console.tron.log("store", reactotronRedux),
    //         // Optional settings
    //         title: "SubCategoryList", // This shows on the button
    //         description: "Direct SubCategoryList", // This shows below the button
    //         })
    return { store, persistor }
}
