import React, {Component} from 'react';
import {Block, Card, Text} from '../components';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import {FlatList, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../constants/theme';
import {Button} from '../components/Button';

class NotificationList extends Component {
 render() {
  const { userReducer } = this.props
  console.log("NotificationListNotificationList", userReducer.notification.notification)
  return (
   <Block>
    <FlatList
     style={{marginTop: 16}}
     data={userReducer.notification !== undefined ?
      userReducer.notification.notification : ""}
     numColumns={1}
     keyExtractor={(item, index) => item.key }
     renderItem={({item, index}) => {
      return (
       <TouchableOpacity
        onPress={() => this.props.navigation.navigate(
         "SubCategories", {
          catId: item.key,
          catName: item.value
         }
        )}
        //style={{ justifyContent: 'space-between',}}
       >
        <Card
         middle
         center
         shadow
         style={{
          paddingVertical: 12,
          paddingHorizontal: 12,
          marginHorizontal: 8
         }}
        >
         <Block center row flex={false}>
          <Block center middle flex={false} style={{width: 40, height: 40, borderRadius:20, backgroundColor: colors.primary}}>
           {
            item.type = "exchange" ?
             <MaterialIcons name={"compare-arrows"} size={30} color={"#FFF"}/> :
             <MaterialIcons name={"local-offer"} size={30} color={"#FFF"}/>
           }
          </Block>
          <Block style={{marginLeft: 16,}}>
           <Block style={{marginBottom: 8}}>
            <Text bold h3>{item.title}</Text>
            <Text h3>{item.message}</Text>
           </Block>
           <Block row>
            <Button
             small
             extraStyle={{width: 80, height: 40, marginRight: 32}}
             textStyle={{fontSize: 14, textAlign: 'center'}}
             title={"Accept"}
             onPress={() => {this.exchange()}}
            />
            <Button
             small
             title={"Reject"}
             extraStyle={{width: 80, height: 40, backgroundColor: "#ccc", textColor: "#000"}}
             textStyle={{fontSize: 14, color: "#000"}}
             onPress={() => {this.exchange()}}
            />
           </Block>
          </Block>
         </Block>
        </Card>
       </TouchableOpacity>
      )
     }
     }
    />
   </Block>
  );
 }
}

const mapStateToProps = (state) => ({
 userReducer: state.userReducer
})

const mapDispatchToProps = (dispatch) => ({
 dispatch
});

export default  compose(
 connect(mapStateToProps, mapDispatchToProps),
)(NotificationList);

