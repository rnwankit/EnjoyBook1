import React, {Component} from 'react';
import {Block, Text} from '../components';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import {compose} from 'redux';
import {connect} from 'react-redux';
class AuthStart extends Component {

 componentDidUpdate() {
  console.log("in authhh")
 }

 render() {
  return (
   <Block flex={false} center shadow>
    <Text h1 primary bold style={{marginTop: 56, marginBottom: 4}}>
     Exchange/ Buy/ Sell Books
    </Text>
    <Text h3 gray style={{marginBottom: 60}}>
     Improve Knowledge | Save Trees | Help Society
    </Text>
    <Logo />
    <Button
      small shadow title={"Login"}
      extraStyle={{ marginTop: 80, marginBottom: 24 }}
      onPress={() => this.props.navigation.navigate("Login")}
    />
    <Button
     small shadow white title={"Sign Up"}
     extraStyle={{marginBottom: 40}}
     onPress={() => this.props.navigation.navigate("Signup")}
    />
    <Button onlyText  title={"Terms of Use"} onPress={() => this.props.navigation.navigate("TermsOfUse")} />
   </Block>
  );
 }
}

const mapStateToProps = (state) => ({
 createUser: state.createUser
})

const mapDispatchToProps = (dispatch) => ({
 dispatch
});

export default compose(
 connect(mapStateToProps, mapDispatchToProps),
)(AuthStart);
