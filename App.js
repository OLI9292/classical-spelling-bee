import React from 'react';
import { StyleSheet, View } from 'react-native';
import FirebaseManager from './Networking/FirebaseManager';
import GameDataManager from './Services/GameDataManager';
import Game from './Components/Game';
import QuestionListParsingService from './Services/QuestionListParsingService';
import _ from 'underscore';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allRoots: [],
      autohintOn: false,
      counters: {},
      current: { module: 1, submodule: 1, question: 1 },
      question: {},
      questionsCount: 0,
      questionId: 1,
      questionList: [],
      moduleId: 1,
      submoduleId: 1,
      words: []
    };

    this.importGameData();
  }

  importGameData = async () => {
    try {
      this.state.questionList = await GameDataManager.import('questionList');
      this.state.allRoots = await GameDataManager.import('roots');
      this.state.words = await GameDataManager.import('words');
      this.showQuestion(1, 1, 1, false);
    } catch(error) {
      console.log('App.js -> data not found');
    }
  }

  incrementCounterIds(autohintOn) {
    if (this.state.questionId === this.state.counters.questionsCount) { // end of submodule
      if (this.state.submoduleId === this.state.counters.submodulesCount) { // end of module
        if (this.state.moduleId === this.state.counters.modulesCount) { // end of game
        } else { // next module
          this.showQuestion(this.state.current.module + 1, 1, 1, autohintOn)
        }
      } else { // next submodule
        this.showQuestion(this.state.moduleId, this.state.current.submodule + 1, 1, autohintOn)
      }
    } else { // next question in submodule
      this.showQuestion(this.state.moduleId, this.state.submoduleId, this.state.current.question + 1, autohintOn)
    }
  }

  showQuestion(moduleId, submoduleId, questionId, autohintOn) {
    const current = { module: moduleId, submodule: submoduleId, question: questionId };
    let question = QuestionListParsingService.question(current, this.state.questionList, this.state.words);
    // Replace previously answered words with underscores
    question.value.components.forEach((c) => { c.valueUnsolved = Array(c.valueSolved.length).join('_')});
    this.setState({
      autohintOn: autohintOn,
      current: current,
      question: question.value,
      moduleId: moduleId,
      submoduleId: submoduleId,
      questionId: questionId,
      counters: question.counters
    });
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#F8EDD2'}}>
        <Game
          allRoots={this.state.allRoots}
          autohintOn={this.state.autohintOn}
          counters={this.state.counters}
          current={this.state.current}
          question={this.state.question}
          nextQuestion={(autohintOn) => this.incrementCounterIds(autohintOn)}
        />
      </View>
    );
  }
}
