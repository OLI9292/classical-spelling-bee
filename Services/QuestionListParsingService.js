import _ from 'underscore';
import { mapObject } from 'underscore';

const QuestionListParsingService = {
  parse: (data) => {
    let modules = _.values(mapObject(data, (v, k) => ({ module: parseInt(_.last(k.split('_'))), submodules: v })));
    _.each(modules, (m) => {
      let submodules = _.map(_.keys(m.submodules), (sub) => parseInt(_.last(sub.split('_'))));
      let questions = _.map(_.values(m.submodules), (sub) => _.values(sub));
      submodules = _.map(_.zip(submodules, questions), (d) => ({ submodule: d[0], questions: d[1] }));
      submodules = submodules.sort((a,b) => a.submodule - b.submodule);
      m.submodules = submodules;
    })
    modules.module_count = modules.length;
    _.each(modules, (m) => {
      m.submodules_count = m.submodules.length;
      _.each(m.submodules, (sub) => sub.questions_count = sub.questions.length);
    })
    modules = modules.sort((a,b) => a.module - b.module);
    return { modules_count: modules.length, modules: modules }
  },
  questionFor: (current, questionList, wordList) => {
    try {
      const module = questionList.modules.filter((m) => m.module == current.module)[0];
      let submodule = module.submodules.filter((s) => s.submodule == current.submodule)[0];
      let gameCounters = counters(questionList, module, submodule);
      const questionWord = submodule.questions[current.question];
      let question = wordList[questionWord];
      // Replace previously answered words with underscores
      question.components.forEach((c) => { c.valueUnsolved = Array(c.valueSolved.length + 1).join('_')});
      return { value: question, counters: gameCounters };
    } catch (e) {
      console.log(`QuestionListParsingService.js -> question ${current.question} in module ${current.module}, submodule ${current.submodule} wasn't found`);
      let randomQuestion = QuestionListParsingService.randomQuestionFor(wordList);
      randomQuestion.components.forEach((c) => { c.valueUnsolved = Array(c.valueSolved.length + 1).join('_')});
      return { value: randomQuestion, counters: gameCounters };;
    }
  },
  randomQuestionFor: (wordList) => {
    let words = Object.keys(wordList);
    let randomWord = words[Math.floor(Math.random()*words.length)];
    return wordList[randomWord];
  }
}

const counters = (questionList, module, submodule) => {
  return {
    modulesCount: questionList.modules.length,
    submodulesCount: module.submodules_count,
    questionsCount: submodule.questions.length - 1
  }
}

/**
/*  Shuffles questions and ensures any duplicates do not appear consecutively
**/
const reviseQuestions = (questions) => {
  const uniq = _.uniq(questions);
  let shuffled = _.shuffle(uniq);
  return shuffled;
}

export default QuestionListParsingService;
