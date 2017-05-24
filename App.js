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
      const question = this.state.words[this.state.questionLists[`module_${1}`][`submodule_${1}`][`question_${1}`]];
      this.setState({ question: question });
    } catch(error) {
      console.log('App.js -> data not found');
    }
  }

  render() {
    return (
      <Game question={this.state.question} roots={this.state.roots}/>
    );
  }
}
