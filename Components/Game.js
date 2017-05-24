import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import _ from 'underscore';
import '../Library/helpers';

import AnswerPart from './AnswerPart';
import ChoiceButton from './ChoiceButton';
import ProgressBar from './ProgressBar';
import BottomBar from './BottomBar';

import FirebaseManager from '../Networking/FirebaseManager';
import WordParsingService from '../Services/WordParsingService';

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
      roots: [],
      progress: 5,
      solvedRoots: []
    };
  }

  /**
  /*  Replace underscores with answer and reset choices
  **/
  answered(root) {
    const updatedAnswerParts = _.map(this.state.answerParts, (part) => {
      if (part.valueSolved === root) { part.valueUnsolved = part.valueSolved }
      return part;
    });
    const solvedRoots = this.state.solvedRoots.concat([root]);
    this.setState({ answerParts: updatedAnswerParts, solvedRoots: solvedRoots }, this.checkSolution)
  }

  checkSolution() {
    if (this.state.solvedRoots.length === _.filter(this.state.answerParts, (a) => a.type === 'root').length) {
      this.fillInRemaining()
      setTimeout(() => this.props.nextQuestion(), 1000);
    } else {
      this.setState({ choices: this.randomChoices(this.state.answerParts, this.state.roots) })
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ answerParts: nextProps.question.components });
    this.setState({ prompt: nextProps.question.value });
    this.setState({ roots: nextProps.roots });
    this.setState({ choices: this.randomChoices(nextProps.question.components, nextProps.roots) });
  }

  fillInRemaining() {
    const updatedAnswerParts = _.map(this.state.answerParts, (part) => {
      part.valueUnsolved = part.valueSolved;
      return part;
    });

    this.setState({ answerParts: updatedAnswerParts });
  }

  /**
  /*  Get random red herrings roots and mix them with the roots of the word to display n possible options
  **/
  randomChoices(wordParts, roots) {
    let wordRoots = _.filter(wordParts, (c) => c.type === 'root' && c.valueUnsolved.includes('_'))
    wordRoots = _.map(wordRoots, (root) => ({ 'value': root.valueSolved, 'definition': root.definition, 'isAnswer': 'true' }));
    let choices = _.nRandom(_.toArray(roots), this.state.choiceCount)
    choices = _.reject(choices, (root) => _.contains(_.pluck(wordRoots, 'value').concat(this.state.solvedRoots), root.value));
    choices = choices.slice(0, this.state.choiceCount - wordRoots.length).concat(wordRoots);
    return _.shuffle(choices)
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

    const choiceButtonsRows = _.chunk(choiceButtons, 2).map((buttons, i) => {
      return (<ChoiceButtonsRow key={i} >{buttons}</ChoiceButtonsRow>)
    });

    return (
      <Container>
        <ProgressBar progress={this.state.progress} />
        <PromptContainer>
          <Prompt>Spell the word that means {this.state.prompt}</Prompt>
          <AnswerPartsContainer>
            {answerParts}
          </AnswerPartsContainer>
        </PromptContainer>
        <ChoiceButtonsContainer>
          {choiceButtonsRows}
        </ChoiceButtonsContainer>
        <BottomBar />
      </Container>
    );
  };
}


const Container = styled.View`
  alignSelf: center;
  marginTop: ${height * 0.03};
  marginBottom: ${height * 0.03};
  width: ${width * 0.9};
  height: ${height * 0.95};
  flex: 1;
  flexDirection: column;
`

const PromptContainer = styled.View`
  flex: .75;
  alignItems: center;
`

const Prompt = styled.Text`
  alignItems: center;
  fontSize: 36;
  fontFamily: Avenir;
  textAlign: center;
  width: ${width * 0.8};
  marginTop: ${height * 0.03};

`
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
