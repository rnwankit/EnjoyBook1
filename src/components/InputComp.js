import {Block, Text} from './index';
import React from 'react';

const InputComp = (props) => {
 const { InputTitle } = props;
 return(
  <Block flex={false} row>
   <Text>{InputTitle}</Text>
  </Block>
 )
}

export { InputComp }
