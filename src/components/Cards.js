import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Body, CardItem } from "native-base";
import { Block, Text, Card } from '../components/index';
export default class Cards extends Component {
  render() {
   const { color, items, more, loadmore, style, children, width, height, ...props } = this.props;

    return (
     <TouchableOpacity>
      <Card middle center shadow
            style={{
             paddingHorizontal: 0,
             paddingVertical: 0,
             width: width,
             height: height,
             marginLeft: 16
            }}>
       {more !== undefined ? <Text h3>{more}</Text> : <Text h3 style={{textAlign: 'center'}}>{items.value}</Text>}
      </Card>
     </TouchableOpacity>
    )
  }
}
