import _ from 'underscore';
import { mapObject } from 'underscore';

const WordLists = (data) => {
  let modules = _.values(mapObject(data.val(), (v, k) => ({ module: parseInt(_.last(k.split('_'))), submodules: v })));
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
}

export default WordLists;
