import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import _ from 'underscore';
import '../Library/helpers';

import AnswerPart from './AnswerPart';
import ChoiceButton from './ChoiceButton';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Game extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      answerParts: [],
      choices: []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ answerParts: nextProps.question.components });
    this.setState({ prompt: nextProps.question.value });
    /**
    /* Get random red herrings roots and mix them with the roots of the word to display n possible options
    **/
    let componentRoots = _.filter(nextProps.question.components, (c) => c.type === 'root')
    componentRoots = _.map(componentRoots, (root) => ({ 'value': root.valueSolved, 'definition': root.definition }));
    let choices = _.reject(_.nRandom(_.toArray(nextProps.roots), 6), (root) => _.contains(_.pluck(componentRoots, 'value'), root));
    choices = choices.slice(0, choices.length - componentRoots.length).concat(componentRoots);
    const shuffled = _.shuffle(choices)
    this.setState({ choices: shuffled });
  }

  render() {
    const answerParts = this.state.answerParts.map((part, i) => {
      return(<AnswerPart key={i} value={part.valueUnsolved} />);
    });

    const choiceButtons = this.state.choices.map((choice, i) => {
      return (<ChoiceButton key={i} definition={choice.definition} word={choice.value}/>);
    });

    const choiceButtonsRows = _.chunk(choiceButtons, 3).map((buttons, i) => {
      return (<ChoiceButtonsRow key={i} >{buttons}</ChoiceButtonsRow>)
    });

    return (
      <Container>
        <PromptContainer>
          <Prompt>Spell the word that means {this.state.prompt}</Prompt>
          <AnswerPartsContainer>
            {answerParts}
          </AnswerPartsContainer>
        </PromptContainer>
        <ChoiceButtonsContainer>
          {choiceButtonsRows}
        </ChoiceButtonsContainer>
      </Container>
    );
  };
}

const AnswerPartsContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
  marginTop: ${height * 0.05};
`
const ChoiceButtonsContainer = styled.View`
  flex: 1;
  flexDirection: column;
  alignItems: center;
`

const ChoiceButtonsRow = styled.View`
  flex: 1;
  flexDirection: row;
  alignItems: center;
`

const Container = styled.View`
  backgroundColor: #fff;
  flex: 1;
  margin: ${width * 0.05};
`;

const Prompt = styled.Text`
  alignItems: center;
  fontSize: 18;
  textAlign: center;
  width: ${width * 0.8};
`

const PromptContainer = styled.View`
  flex: 1;
  alignItems: center;
  marginTop: ${height * 0.1};
`
