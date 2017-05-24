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
      choiceCount: 6,
      wordRoots: [],
      choices: [],
      roots: []
    };
  }

  randomChoices(wordParts, roots) {
    let wordRoots = _.filter(wordParts, (c) => c.type === 'root')
    wordRoots = _.map(wordRoots, (root) => ({ 'value': root.valueSolved, 'definition': root.definition, 'isAnswer': 'true' }));
    let choices = _.nRandom(_.toArray(roots), this.state.choiceCount)
    choices = _.reject(choices, (root) => _.contains(_.pluck(wordRoots, 'value'), root.value));
    choices = choices.slice(0, this.state.choiceCount - wordRoots.length).concat(wordRoots);
    return _.shuffle(choices)
  }

  // Get random red herrings roots and mix them with the roots of the word to display n possible options
  componentWillReceiveProps(nextProps) {
    this.setState({ answerParts: nextProps.question.components });
    this.setState({ prompt: nextProps.question.value });
    this.setState({ roots: nextProps.roots });
    this.setState({ choices: this.randomChoices(nextProps.question.components, nextProps.roots) });
  }

  answered(root) {
    this.setState({
      answerParts: _.map(this.state.answerParts, (part) => {
        if (part.valueSolved === root) { part.valueUnsolved = part.valueSolved }
        return part;
      })
    });
  }

  render() {
    const answerParts = this.state.answerParts.map((part, i) => {
      return(<AnswerPart key={i} value={part.valueUnsolved} />);
    });

    const choiceButtons = this.state.choices.map((choice, i) => {
      return (
        <ChoiceButton 
          key={i}
          definition={choice.definition}
          word={choice.value}
          isAnswer={choice.isAnswer}
          answered={(root) => this.answered(root)}
        />
      );
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
