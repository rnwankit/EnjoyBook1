import { NativeModules } from 'react-native';
import Reactotron, {asyncStorage} from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import AsyncStorage from '@react-native-community/async-storage';
import url from 'url';
import store from './store'
let reactotron;

if (__DEV__) {
 const { hostname } = url.parse(NativeModules.SourceCode.scriptURL);

 reactotron =  Reactotron.configure({
  host: hostname,
  port: 9090,
  name: 'EnjoyBooks',
 })
  .setAsyncStorageHandler(AsyncStorage)
  .useReactNative(asyncStorage())
  .use(reactotronRedux())
  .connect();

 console.tron = Reactotron;
 //console.tron.log.display = Reactotron.display
//  Reactotron.onCustomCommand(
//     'login', () => {
//         store.dispatch({
//             type:'OTP', 
//             payload: {_auth: {_verificationId: 'AE5I7A5_ZJPZlwPny0SF_-gz7Bwk6z5FAycDhLEHxJo-2kVOH5FXWzaZRg3kZu8ndxbxXleCbm_B8NJXwWjoHmP_W9blTUlPvjuqhcpi502FS-Zk4muR6fHotO5mvO9uZX45HE1JGaey2AnnEvc3MGxArGmt2a2u0A'}}
//         })
//     }
//  )


 Reactotron.onCustomCommand({
    command: "test2",
    handler: () => console.tron.log("This is an example 2"),
  
    // Optional settings
    title: "A thing", // This shows on the button
    description: "The desc", // This shows below the button
  })
}

export { reactotron };
