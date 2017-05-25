import React from 'react';
import styled from 'styled-components/native';
import { Dimensions} from 'react-native';
import _ from 'underscore';

const height = Dimensions.get('window').height;

export default class Prompt extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = { boldAndUppercaseRoots: false }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ boldAndUppercaseRoots: nextProps.hint === 1 })
  }

  render() {
    const connectedPrompt = () => {
      return this.props.text.map((t, i) => {
        return(t.isRoot ? <PromptText key={i} isRoot>{t.value.toUpperCase()} </PromptText> : <PromptText key={i}>{t.value} </PromptText>)
      })
    }

    const text = this.state.boldAndUppercaseRoots ? connectedPrompt() : _.pluck(this.props.text, 'value').join(' ')

    return (
      <PromptText>{text}</PromptText>
    );
  }
}

const PromptText = styled.Text`
  fontSize: 32;
  fontWeight: ${props => props.isRoot ? 'bold' : 'normal'};
  fontFamily: Avenir-Medium;
  textAlign: center;
  marginTop: ${height * 0.03};
`