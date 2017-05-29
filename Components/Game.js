import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import _ from 'underscore';
import '../Library/Helpers';

import AnswerPart from './AnswerPart';
import BottomBar from './BottomBar';
import ChoiceButton from './ChoiceButton';
import ProgressBar from './ProgressBar';
import Prompt from './Prompt';

import FirebaseManager from '../Networking/FirebaseManager';
import WordParsingService from '../Services/WordParsingService';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allRoots: [],
      answerParts: [],
      autohintOn: false,
      autohintingPaused: false,
      autohintingSpeed: parseInt(this.props.config.autohinting_speed * 1000) || 2000,
      choiceCount: 6,
      choices: [],
      hint: 0,
      solvedRoots: [],
      timer: null,
      wordRoots: []
    };
  }

  /**
  /*  Replace underscores with answer and reset choices
  **/
  answered(root, isUser = false) {
    if (isUser || !this.state.autohintingPaused && (root !== undefined)) {
      const updatedAnswerParts = this.fillIn(root);
      const solvedRoots = this.state.solvedRoots.concat([root.toLowerCase()]);
      this.setState({
        answerParts: updatedAnswerParts,
        autohintingPaused: this.state.autohintOn && isUser,
        hint: Math.min(1, this.state.hint),
        solvedRoots: solvedRoots
      }, this.checkSolution);
      this.pauseAutohinting(isUser);
    }
  }

  autohint() {
    if (this.state.autohintOn && !this.state.autohintingPaused) {
      if (this.state.hint === 3) {
        this.answered(this.nextUnsolvedRoot())
      } else {
        setTimeout(() => {
          this.incrementHint();
          this.autohint();
        }, this.state.autohintingSpeed);
      }
    }
  }

  /**
  /*  Check if all roots have been solved, fill in remaining components, and advance to next question
  **/
  checkSolution() {
    if (this.state.solvedRoots.length === this.state.wordRoots.length) {
      const solution = this.fillIn(null, true)
      this.setState({ answerParts: solution });
      setTimeout(() => this.props.nextQuestion(this.state.autohintOn), 1500);
    } else {
      this.setState({choices: this.randomChoices(this.state.answerParts, this.state.allRoots) }, this.autohint)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      allRoots: nextProps.allRoots,
      answerParts: nextProps.question.components,
      autohintOn: nextProps.autohintOn,
      choices: this.randomChoices(nextProps.question.components, nextProps.allRoots),
      hint: 0,
      prompt: nextProps.question.definition,
      solvedRoots: [],
      wordRoots: _.filter(nextProps.question.components, (a) => a.type === 'root')
    }, this.autohint);
  }

  /**
  /*  Fill in non-root components
  **/
  fillIn(root, solveAll) {
    return _.map(this.state.answerParts, (part) => {
      if (solveAll || part.valueSolved === root.toLowerCase()) { part.valueUnsolved = part.valueSolved };
      return part;
    });
  }

  incrementHint() {
    if (!this.state.autohintingPaused) {
      const hint = Math.min(this.state.hint + 1, this.state.autohintOn ? 3 : 2)
      this.setState({ hint: hint });
    }
  }

  nextUnsolvedRoot() {
    return _.find(_.pluck(this.state.wordRoots, 'valueSolved'), (w) => !_.contains(this.state.solvedRoots, w));
  }

  pauseAutohinting(isUser) {
    if (isUser && this.state.autohintingPaused) {
      setTimeout(() => { this.setState({ autohintingPaused: false }, this.autohint)}, this.state.autohintingSpeed);
    }
  }

  toggleAutohint() {
    this.setState({ autohintOn: !this.state.autohintOn }, this.autohint);
  }

  /**
  /*  Get random red herrings roots and mix them with the roots of the word to display n possible options
  **/
  randomChoices(wordParts, roots) {
    let wordRoots = _.filter(wordParts, (c) => c.type === 'root' && c.valueUnsolved.includes('_'))
    wordRoots = _.map(wordRoots, (root) => ({ 'value': root.valueSolved, 'definition': root.definition, 'isAnswer': 'true' }));
    let choices = _.nRandom(_.toArray(roots), this.state.choiceCount * 2);
    choices = _.reject(choices, (root) => _.contains(_.pluck(wordRoots, 'value').concat(this.state.solvedRoots), root.value));
    choices = choices.slice(0, this.state.choiceCount - wordRoots.length).concat(wordRoots);
    return _.shuffle(choices)
  }

  render() {
    const answerParts = this.state.answerParts.map((part, i) => {
      return(<AnswerPart key={i} value={part.valueUnsolved} />);
    });

    const choiceButtons = this.state.choices.map((choice, i) => {
      const displayHint = (this.state.hint === 2) && this.nextUnsolvedRoot() && (choice.value === this.nextUnsolvedRoot());
      return (
        <ChoiceButton
          answered={(root) => this.answered(root, true)}
          definition={choice.definition}
          displayHint={displayHint}
          isAnswer={choice.isAnswer}
          key={i}
          word={choice.value}
        />
      );
    });

    const choiceButtonsRows = _.chunk(choiceButtons, 2).map((buttons, i) => {
      return (<ChoiceButtonsRow key={i}>{buttons}</ChoiceButtonsRow>)
    });

    const rootDefinitions = _.pluck(_.filter(this.state.answerParts, (a) => a.type === 'root'), 'definition')

    return (
      <Container>
        <ProgressBar progress={this.props.current.question} total={this.props.counters.questionsCount} />
        <Prompt text={this.state.prompt} hint={this.state.hint} definitions={rootDefinitions}/>
        <AnswerPartsContainer>
          {answerParts}
        </AnswerPartsContainer>
        <ChoiceButtonsContainer>
          {choiceButtonsRows}
        </ChoiceButtonsContainer>
        <BottomBarContainer>
          <BottomBar
            currentLevel={`${this.props.current.module}-${this.props.current.submodule}`}
            autohintOn={this.state.autohintOn}
            toggleAutohint={() => this.toggleAutohint() }
            hintDisabled={this.state.autohintOn || this.state.hint === 2}
            hint={() => this.incrementHint()}
          />
        </BottomBarContainer>
      </Container>
    );
  };
}

const AnswerPartsContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
  marginBottom: ${height * 0.025};
  marginTop: ${height * 0.025};
`

const BottomBarContainer = styled.View`
  marginTop: ${height * 0.05};
  bottom: 0;
`

const Container = styled.View`
  alignSelf: center;
  marginTop: ${height * 0.03};
  marginBottom: ${height * 0.03};
  width: ${width * 0.9};
  height: ${height * 0.95};
  flex: 1;
  justifyContent: flex-start;
`

const ChoiceButtonsContainer = styled.View`
  flex: 1;
  alignItems: center;
  height: ${height * 0.4};
`

const ChoiceButtonsRow = styled.View`
  flex: 0.5;
  flexDirection: row;
  marginBottom: ${height * 0.02};
`
