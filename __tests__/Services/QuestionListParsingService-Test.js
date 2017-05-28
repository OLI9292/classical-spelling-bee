import _ from 'underscore';
import QuestionListParsingService from '../../Services/QuestionListParsingService';

describe('QuestionListParsingService', function() {

  const questionLists = {
    "module_2": {
      "submodule_2": {
        "question_1": "insomnia",
        "question_10": "hypnotism", 
        "question_2":"extemporaneous", 
        "question_3": "hypnotherapist", 
        "question_4":"somnifacient", 
        "question_5":"temporarily", 
        "question_6":"temporarily", 
        "question_7":"hypnoid", 
        "question_8":"hypnotizable", 
        "question_9":"insomniac"
      }, 
      "submodule_1": { 
        "question_1": "hypnotically",
        "question_5": "extemporaneous",
        "question_2": "somnambulant",
        "question_3": "temporality",
        "question_4": "extemporaneous"
      }
    },
    "module_1": {
      "submodule_1": {
        "question_1": "insomnia"
      }
    }
  };

  const parsed = QuestionListParsingService.parse(questionLists);

  describe('parse method', function() {

    describe('modules', function() {

      test('keeps a count of the number of modules', () => {
        expect(parsed.modules_count).toBe(2);
        expect(parsed.modules.length).toBe(2);
      });

      test('orders modules based on the integer after an _', () => {
        const modulesOrder = _.pluck(parsed.modules, 'module');
        expect(modulesOrder).toEqual([1,2]);
      });
    });

    describe('submodules', function() {

      const module1 = parsed.modules[0];
      const module2 = parsed.modules[1];

      test('keeps a count of the number of submodules', () => {
        expect(module1.submodules_count).toBe(1);
        expect(module2.submodules_count).toBe(2);
      });

      test('orders submodules based on the integer after an _', () => {
        const submodulesOrder = _.pluck(module2.submodules, 'submodule');
        expect(submodulesOrder).toEqual([1,2]);
      });
    });

    describe('questions', function() {

      const submodule1 = parsed.modules[1].submodules[0];
      const submodule2 = parsed.modules[1].submodules[1];
      const submodule1Questions = Object.values(questionLists.module_2.submodule_1);
      const submodule2Questions = Object.values(questionLists.module_2.submodule_2);

      test('parses questions from the snapshot', () => {
        expect(submodule1.questions).toEqual(submodule1Questions);
        expect(submodule2.questions).toEqual(submodule2Questions);
      });

      test('keeps a count of the number of questions', () => {
        expect(submodule1.questions_count).toBe(5);
        expect(submodule2.questions_count).toBe(10);
      });
    });
  });

  describe('questionFor method', function() {

    const wordList = { 
      'insomnia': {
        components: [
          { "valueSolved": "somn", "valueUnsolved": "somn", "type": "root", "definition": "sleepy" },
          { "valueSolved": "i", "valueUnsolved": "i", "type": "separator" },
          { "valueSolved": "fac", "valueUnsolved": "fac", "type": "root", "definition": "making" },
          { "valueSolved": "ient", "valueUnsolved": "ient", "type": "unknown" }
        ]
      }
    };
    const current = { module: 1, submodule: 1, question: 1 };
    const question = QuestionListParsingService.questionFor(current, parsed, wordList);

    test('retrieves the correct question based on the user\'s level', () => {
      expect(question.value.value).toBe(wordList.insomnia.value);
    });

    test('underscores valueUnsolved', () => {
      const component = question.value.components[0];
      expect(component.valueUnsolved).toBe(Array(component.valueSolved.length).join('_'));
    });
  });
});
