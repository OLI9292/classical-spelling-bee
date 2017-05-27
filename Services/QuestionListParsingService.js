import _ from 'underscore';
import { mapObject } from 'underscore';

const QuestionListParsingService = {
  parse: (snapshot) => {
    let modules = _.values(mapObject(snapshot.val(), (v, k) => ({ module: parseInt(_.last(k.split('_'))), submodules: v })));
    _.each(modules, (m) => {
      const submodules = _.map(_.keys(m.submodules), (sub) => parseInt(_.last(sub.split('_'))));
      const questions = _.map(_.values(m.submodules), (sub) => _.values(sub));
      m.submodules = _.map(_.zip(submodules, questions), (d) => ({ submodule: d[0], questions: d[1] }));
    })
    modules.module_count = modules.length;
    _.each(modules, (m) => {
      m.submodules_count = m.submodules.length;
      _.each(m.submodules, (sub) => sub.questions_count = sub.questions.length);
    })
    return { modules_count: modules.length, modules: modules }
  },
  questionFor: (current, questionList, wordList) => {
    const module = questionList.modules.filter((m) => m.module == current.module)[0];
    let submodule = module.submodules.filter((s) => s.submodule == current.submodule)[0];
    submodule.questions = reviseQuestions(submodule.questions);
    const questionWord = submodule.questions[current.question];
    let question = wordList[questionWord];
    // Replace previously answered words with underscores
    question.components.forEach((c) => { c.valueUnsolved = Array(c.valueSolved.length).join('_')});
    if (question) {
      return { value: question, counters: counters(questionList, module, submodule) };
    } else {
      console.log(`QuestionListParsingService.js -> question ${current.question} in module ${current.module}, submodule ${current.submodule} wasn't found`);
    }
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
  while (shuffled.length < 10) {
    shuffled = shuffled.concat(shuffled);
  }
  const tenQuestions = shuffled.slice(0, 10);
  return tenQuestions;
}

export default QuestionListParsingService;
