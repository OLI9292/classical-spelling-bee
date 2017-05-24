import React from 'react';

import GameDataManager from './Services/GameDataManager';
import Game from './Components/Game';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionLists: [],
      roots: [],
      question: {},
      words: [],
      moduleId: 1,
      submoduleId: 1,
      questionId: 1
    };
    this.importGameData();
  }

  importGameData = async () => {
    try {
      this.state.questionLists = await GameDataManager.import('questionLists');
      this.state.roots = await GameDataManager.import('roots');
      this.state.words = await GameDataManager.import('words');
      this.nextQuestion();
    } catch(error) {
      console.log('App.js -> data not found');
    }
  }

  incrementCounterIds() {
    if (this.state.questionId === 10) {
      if (this.state.submoduleId === 10) {
        if (this.state.moduleId === 10) {
          // TODO: game over
        } else {
          this.setState({ moduleId: 1, submoduleId: 1, questionId: this.state.moduleId++ }, this.nextQuestion())
        }
      } else {
        this.setState({ submoduleId: this.state.submoduleId++, questionId: 1 }, this.nextQuestion())
      }
    } else {
      this.setState({ questionId: this.state.questionId++ }, this.nextQuestion())
    }
  }

  nextQuestion() {
    const question = this.state.words[
      this.state.questionLists[`module_${this.state.moduleId}`][`submodule_${this.state.submoduleId}`][`question_${this.state.questionId}`]
    ];
    this.setState({ question: question });
  }

  render() {
    return (
      <Game
        question={this.state.question}
        roots={this.state.roots}
        nextQuestion={() => this.incrementCounterIds()}
      />
    );
  }
}
