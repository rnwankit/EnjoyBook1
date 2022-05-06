//https://stackoverflow.com/questions/67500197/how-to-slove-this-issue-task-react-native-push-notificationcompiledebugjavaw
import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';


import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import reducer from './src/reducer'

import { PersistGate } from 'redux-persist/integration/react'

import Main from "./src/Main";
import persist from './src/config/store';
import MyNavigation from './src/navigation/index';

const middleware = applyMiddleware(thunkMiddleware)
const store = createStore(reducer, middleware)
import SplashScreen from 'react-native-splash-screen'
import { MenuProvider } from 'react-native-popup-menu';
import PushController from './src/components/PushController';
import Reactotron, {asyncStorage} from 'reactotron-react-native';
import {reactotronRedux as reduxPlugin, reactotronRedux} from 'reactotron-redux';
import AsyncStorage from '@react-native-community/async-storage';
const persistStore = persist();
export default class App extends React.Component<Props> {
 state = {
  isLoadingComplete: true,
 };


 componentDidMount() {
  SplashScreen.hide();


 /*Reactotron.configure({
                       name: 'EnjoyBooks',
  host: '192.168.185.116',port: 9090,
                      }) // Initial configuration
  .setAsyncStorageHandler(AsyncStorage)
.useReactNative(asyncStorage()) // Appling React-Native plugin
.use(reactotronRedux()) // Appling Redux plugin*/

}

 /*handleResourcesAsync = async () => {
   // we're caching all the images
   // for better performance on the app

   const cacheImages = images.map(image => {
     return Asset.fromModule(image).downloadAsync();
   });

   return Promise.all(cacheImages);
 };*/

 render() {
  /*if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
    return (
        <AppLoading
            startAsync={this.handleResourcesAsync}
            onError={error => console.warn(error)}
            onFinish={() => this.setState({ isLoadingComplete: true })}
        />
    )
  }*/

  return (
   <Provider store={persistStore.store}>
    <PersistGate loading={null} persistor={persistStore.persistor}>
     <MenuProvider>
      <MyNavigation />
      {/* <PushController/> */}
     </MenuProvider>
    </PersistGate>
    {/*<View style={{flex:1}}>
            <NavigationContainer>
              <Tab.Navigator>
                <Tab.Screen name="Buy" component={Product} />
                <Tab.Screen name="Exchange" component={Product} />
                <Tab.Screen name="My Books" component={Product} />
              </Tab.Navigator>
            </NavigationContainer>
          </View>*/}
   </Provider>
  );
 }
}

const styles = StyleSheet.create({
});
