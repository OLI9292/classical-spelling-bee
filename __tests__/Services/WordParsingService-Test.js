import WordParsingService from '../../Services/WordParsingService';

const firebaseWord = { 
  definition: '@making@3 one @sleepy@1',
  part_of_speech: 'adjective',
  separated: 'somn.i#.fac.ient'
};

const parsed = WordParsingService(firebaseWord);

test('removes non-alphabetic characters from the word', () => {
  const word = firebaseWord.separated.replace(/[^a-zA-Z]+/g, '');
  expect(parsed.value).toEqual(word);
});

test('removes non-alphabetic characters from the definition', () => {
  const word1 = {"isRoot": true, "value": "making"};
  const word2 = {"isRoot": false, "value": "one"};
  const word3 = {"isRoot": true, "value": "sleepy"};
  expect(parsed.definition[0]).toEqual(word1);
  expect(parsed.definition[1]).toEqual(word2);
  expect(parsed.definition[2]).toEqual(word3);
});

test('parses the word into components', () => {
  const components = parsed.components;
  const component1 = components[0];
  const component2 = components[1];
  const component3 = components[2];
  const component4 = components[3];
  expect(component1).toEqual({"valueSolved": "somn", "valueUnsolved": "____", "type": "root", "definition": "sleepy"});
  expect(component2).toEqual({"valueSolved": "i", "valueUnsolved": "_", "type": "separator"});
  expect(component3).toEqual({"valueSolved": "fac", "valueUnsolved": "___", "type": "root", "definition": "making"});
  expect(component4).toEqual({"valueSolved": "ient", "valueUnsolved": "____", "type": "unknown"});
});
