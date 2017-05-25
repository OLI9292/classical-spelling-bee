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
    this.setState({ prompt: nextProps.question.definition });
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
          <Prompt>{this.state.prompt}</Prompt>
          <AnswerPartsContainer>
            {answerParts}
          </AnswerPartsContainer>
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
`

const Prompt = styled.Text`
  fontSize: 32;
  fontFamily: Avenir-Medium;
  textAlign: center;
  marginTop: ${height * 0.03};

`
const AnswerPartsContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
  marginBottom: ${height * 0.05};
`
const ChoiceButtonsContainer = styled.View`
  flex: 1;
  justifyContent: flex-end;
  flexDirection: column;
  alignItems: center;
  marginBottom: ${height * 0.03};
`
const ChoiceButtonsRow = styled.View`
  marginBottom: ${height * 0.02};
  flexDirection: row;
  flex: 1;
  alignItems: center;
`
