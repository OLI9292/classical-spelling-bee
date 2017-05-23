import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Dimensions} from 'react-native';

const width = Dimensions.get('window').width;

const onButtonPress = () => {
  Alert.alert('Button has been pressed!');
};

export default class ChoiceButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      answerParts: [],
      choices: []
    };
  }

  render() {
    return (
      <TouchableOpacity>
        <Choice>{this.props.word}</Choice>
      </TouchableOpacity>
    );
  }
}

const Choice = styled.Text`
  backgroundColor: blue;
  borderRadius: 10;
  borderWidth: 2;
  color: white;
  height: ${width * 0.2};
  lineHeight: ${width * 0.2};
  textAlign: center;
  fontSize: 20;
  width: ${width * 0.2};  
  margin: ${width * 0.05};
  overflow: hidden;
`
