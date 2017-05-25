import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Dimensions} from 'react-native';

const width = Dimensions.get('window').width;

export default class HintButton extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity >
        <Hint source={require('../Assets/Images/Hint.png')}/>
      </TouchableOpacity>
    );
  }
}

const Hint = styled.Image`
  height: ${width * 0.12};
  width: ${width * 0.12};
`
