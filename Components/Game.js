import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import _ from 'underscore';
import '../Library/helpers';
import { mapObject } from 'underscore';

import AnswerPart from './AnswerPart';
import ChoiceButton from './ChoiceButton';
import ProgressBar from './ProgressBar';

import FirebaseManager from '../Networking/FirebaseManager';
import WordParsingService from '../Services/WordParsingService';

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

  listenForChoices() {
    FirebaseManager.choices.on('value', (snap) => {
      const choices = _.values(mapObject(snap.val(), function(val, key) {
        return { word: key, definition: val.definition };
      }));
      this.setState({ choices: choices });
    });
  }

  listenForWords() {
    FirebaseManager.words.on('value', (snap) => {
      const answers = _.values(mapObject(snap.val(), function(val, key) { return WordParsingService(val) }));
      const lastAnswer = _.last(answers);
      this.setState({
        answerParts: lastAnswer.components,
        definition: lastAnswer.definition
      });
    });
  }

  componentDidMount() {
    this.listenForChoices();
    this.listenForWords();
  }

  render() {
    const answerParts = this.state.answerParts.map((part, i) => {
      return(<AnswerPart key={i} value={part.valueUnsolved} />);
    });

    const choiceButtons = this.state.choices.map((choice, i) => {
      return (<ChoiceButton key={i} definition={choice.definition} word={choice.word}/>);
    });

    const choiceButtonsRows = _.chunk(choiceButtons, 3).map((buttons, i) => {
      return (<ChoiceButtonsRow key={i} >{buttons}</ChoiceButtonsRow>)
    });

    return (
      <Container>
        <ProgressBar progress={this.state.progress} />
        <PromptContainer>
          <Prompt>Spell the word that means {this.state.definition}</Prompt>
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
