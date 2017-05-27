import React from 'react';
import styled from 'styled-components/native';
import { Dimensions, TouchableHighlight, Vibration } from 'react-native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class ChoiceButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = { highlight: false }
  }

  answered(word) {
    if (this.props.isAnswer) {
      this.setState({ highlight: true }, this.nextQuestion(word));
    } else {
      Vibration.vibrate();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ highlight: false });
  }

  nextQuestion(word) {
    setTimeout(() => { this.props.answered(word) }, 200);
  }

  render() {
    touchableStyle = () => {
       return {
          height: height * 0.09,
          backgroundColor: this.state.highlight ? '#FADC3D' : '#F8EDD2',
          borderColor: this.props.displayHint ? '#FADC3D' : '#C4C4C4',
          borderRadius: 10,
          borderWidth: 5,
          margin: width * 0.05,
          overflow: 'hidden',
          width: width * 0.4
       }
     }

    return (
      <TouchableHighlight
        style={touchableStyle()} 
        onPress={() => this.answered(this.props.word)}
        underlayColor='#F8EDD2'
      >
        <Choice>{this.props.word.toUpperCase()}</Choice>
      </TouchableHighlight>
    );
  }
}

const Choice = styled.Text`
  fontFamily: Avenir;
  textAlign: center;
  lineHeight: ${height * 0.08};
  fontSize: 20;
`
