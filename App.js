import React from 'react';
import { StyleSheet, View } from 'react-native';

import GameDataManager from './Services/GameDataManager';
import Game from './Components/Game';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autohintOn: false,
      questionLists: [],
      roots: [],
      question: {},
      words: [],
      moduleId: 1,
      submoduleId: 1,
      questionId: 1,
    };
    this.importGameData();
  }

  importGameData = async () => {
    try {
      this.state.questionLists = await GameDataManager.import('questionLists');
      this.state.roots = await GameDataManager.import('roots');
      this.state.words = await GameDataManager.import('words');
      this.nextQuestion(1, 1, 1);
    } catch(error) {
      console.log('App.js -> data not found');
    }
  }

  incrementCounterIds(autohintOn) {
    if (this.state.questionId === 10) {
      if (this.state.submoduleId === 10) {
        if (this.state.moduleId === 10) {
          // TODO: game over
        } else {
          this.nextQuestion(this.state.moduleId + 1, 1, 1, autohintOn)
        }
      } else {
        this.nextQuestion(this.state.moduleId, this.state.submoduleId + 1, 1, autohintOn)
      }
    } else {
      this.nextQuestion(this.state.moduleId, this.state.submoduleId, this.state.questionId + 1, autohintOn)
    }
  }

  nextQuestion(moduleId, submoduleId, questionId, autohintOn) {
    let question = this.state.words[this.state.questionLists[`module_${moduleId}`][`submodule_${submoduleId}`][`question_${questionId}`]];
    question.components.forEach((c) => { c.valueUnsolved = Array(c.valueSolved.length).join('_')});
    this.setState({
      autohintOn: autohintOn,
      question: question,
      moduleId: moduleId,
      submoduleId: submoduleId,
      questionId: questionId
    });
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#F8EDD2'}}>
        <Game
          autohintOn={this.state.autohintOn}
          question={this.state.question}
          roots={this.state.roots}
          nextQuestion={(autohintOn) => this.incrementCounterIds(autohintOn)}
        />
      </View>
    );
  }
}
