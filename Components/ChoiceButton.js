import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Dimensions} from 'react-native';

const width = Dimensions.get('window').width;

export default class ChoiceButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const word = this.props.word.toUpperCase();
    const choice = this.props.displayHint ? <Choice displayHint>{word}</Choice> : <Choice>{word}</Choice>;

    return (
      <TouchableOpacity onPress={() => this.props.isAnswer && this.props.answered(word)}>
        {choice}
      </TouchableOpacity>
    );
  }
}

const Choice = styled.Text`
  borderRadius: 10;
  fontFamily: Avenir;
  borderWidth: 5;
  borderColor: #C4C4C4;
  borderColor: ${props => props.displayHint ? '#FADC3D' : '#C4C4C4'};
  color: black;
  height: ${width * 0.15};
  lineHeight: ${width * 0.15};
  textAlign: center;
  fontSize: 20;
  width: ${width * 0.4};
  margin: ${width * 0.05};
  overflow: hidden;
`
