import React from 'react';
import { StyleSheet, View } from 'react-native';
import GameDataManager from './Services/GameDataManager';
import Game from './Components/Game';
import _ from 'underscore';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allRoots: [],
      autohintOn: false,
      counters: {},
      question: {},
      questionsCount: 0,
      questionId: 1,
      questionLists: [],
      moduleId: 1,
      submoduleId: 1,
      words: []
    };

    this.importGameData();
  }

  importGameData = async () => {
    try {
      this.state.questionLists = await GameDataManager.import('questionLists');
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
          this.showQuestion (this.state.moduleId + 1, 1, 1, autohintOn)
        }
      } else { // next submodule
        this.showQuestion(this.state.moduleId, this.state.submoduleId + 1, 1, autohintOn)
      }
    } else { // next question in submodule
      console.log('nextQuestion');
      this.showQuestion(this.state.moduleId, this.state.submoduleId, this.state.questionId + 1, autohintOn)
    }
  }

  questionData(moduleId, submoduleId, questionId) {
    const module = this.state.questionLists.modules.filter((m) => m.module == moduleId)[0];
    const modulesCount = this.state.questionLists.modules.length;
    let submodule = module.submodules.filter((s) => s.submodule == submoduleId)[0];
    submodule.questions = this.reviseQuestions(submodule.questions);
    const submodulesCount = module.submodules_count;
    const questionWord = submodule.questions[questionId];
    const question = this.state.words[questionWord];
    const questionsCount = submodule.questions.length - 1;
    const counters = { modulesCount: modulesCount, submodulesCount: submodulesCount, questionsCount: questionsCount };
    if (question && counters) {
      return { value: question, counters: counters };
    } else {
      console.log(`App.js -> question ${questionId} in module ${moduleId}, submodule ${submoduleId} wasn't found`);
    }
  }

  /**
  /*  Shuffles questions and ensures any duplicates do not appear consecutively
  **/
  reviseQuestions(questions) {
    const uniq = _.uniq(questions);
    let shuffled = _.shuffle(uniq);
    while (shuffled.length < 10) {
      shuffled = shuffled.concat(shuffled);
    }
    const tenQuestions = shuffled.slice(0, 10);
    return tenQuestions;
  }

  showQuestion(moduleId, submoduleId, questionId, autohintOn) {
    let question = this.questionData(moduleId, submoduleId, questionId);
    // Replace previously answered words with underscores
    question.value.components.forEach((c) => { c.valueUnsolved = Array(c.valueSolved.length).join('_')});
    this.setState({
      autohintOn: autohintOn,
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
          autohintOn={this.state.autohintOn}
          question={this.state.question}
          allRoots={this.state.allRoots}
          nextQuestion={(autohintOn) => this.incrementCounterIds(autohintOn)}
        />
      </View>
    );
  }
}
