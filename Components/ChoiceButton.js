import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Dimensions} from 'react-native';

const width = Dimensions.get('window').width;

export default class ChoiceButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.props.isAnswer && this.props.answered(this.props.word) }>
        <Choice>{this.props.word.toUpperCase()}</Choice>
      </TouchableOpacity>
    );
  }
}

const Choice = styled.Text`
  borderRadius: 10;
  borderWidth: 5;
  borderColor: #C4C4C4;
  color: black  ;
  height: ${width * 0.2};
  lineHeight: ${width * 0.2};
  textAlign: center;
  fontSize: 20;
  width: ${width * 0.4};
  margin: ${width * 0.05};
  overflow: hidden;
`
