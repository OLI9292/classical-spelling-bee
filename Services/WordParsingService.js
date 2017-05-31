import _ from 'underscore';

/** Convert a FireBase word into a UI-compatable object
/*
/*  Example input:
/*    temporal
/*      definition: @making@3 one @sleepy@1
/*      part_of_speech: adjective
/*      separated: somn.i#.fac.ient
/*
/*  Example output:
/*    "value": "somnifacient",
/*    "components": [
/*      {"valueSolved": "somn", "valueUnsolved": "____", "type": "root", "definition": "sleepy"},
/*      {"valueSolved": "i", "valueUnsolved": "_", "type": "separator"},
/*      {"valueSolved": "fac", "valueUnsolved": "___", "type": "root", "definition": "making"},
/*      {"valueSolved": "ient", "valueUnsolved": "____", "type": "unknown"}
/*    ],
/*    "definition": [
/*      {"isRoot": true, "value": "making"},
/*      {"isRoot": false, "value": "one"},
/*      {"isRoot": true, "value": "sleepy"}
/*    ]
**/
const WordParsingService = (firebaseWord) => {
  try {
    let components;
    let definition = firebaseWord.definition;
    const separated = firebaseWord.separated;   
    components = parseComponents(separated);
    components = parseDefinition(components, definition);
    definition = cleanDefinition(definition, components);
    value = _.pluck(components, 'valueSolved').join('');
    if (!definition || !value) {
      throw { name : 'MissingData', message : `missing data for ${definition ? definition : value}` };
    }
    return { value: value, components: components, definition: definition } 
  } catch (e) {
    console.log(`WordParsingService -> ${e.message}`)
    return null;
  }
};

const cleanDefinition = (definition, components) => {
  let rootDefinitions = _.pluck(_.filter(components, (c) => c.type === 'root'), 'definition')
  let split = definition.replace(RegExp(/[0-9@]/, 'g'), '').split(' ');
  split = _.map(split, (w) => ({ value: w, isRoot: _.contains(rootDefinitions, w.replace(',', '')) }));
  return split;
}

/**
/*  Split word into components
**/
const parseComponents = (separated) => {
  let clean = separated.replace(new RegExp('#.', 'g'), '#');
  let components = [];
  let componentString = '';
  for (let i = 0; i <= clean.length; i++) {
    const char = clean.charAt(i);
    if (_.contains(['.', '#'], char) || (i === clean.length)) {
      if (!componentString  && (i !== clean.length)) {
        throw { name : 'EmptyComponentString', message : `Word.js -> error parsing ${separated}` };
      } else {
        const type = char === '#' ? 'separator' : 'unknown';
        valueUnderscores = Array(componentString.length + 1).join('_');
        const component = {
          type: type,
          valueSolved: componentString,
          valueUnsolved: valueUnderscores
        }
        components.push(component)
        componentString = '';
      }
    } else if (char.match(/[a-zA-Z\s]/)) {
      componentString += char;
    } else {
      throw { name : 'InvalidCharacter', message : `Word.js -> error parsing ${separated}` };
    }
  }
  return components;
};

/**
/*  Identify roots using "@" in definition
**/
const parseDefinition = (components, definition) => {
  let componentDefinition = '';
  let recordingComponentDefinition = false;
  for (let i = 0; i <= definition.length; i++) {
    const char = definition.charAt(i);
    if (char === '@') {
      if (recordingComponentDefinition) {
        const index = definition.charAt(i+1);
        components[index - 1]['definition'] = componentDefinition;
        components[index - 1]['type'] = 'root';
        componentDefinition = '';
      }
      recordingComponentDefinition = !recordingComponentDefinition;
    } else if (recordingComponentDefinition && char.match(/[a-zA-Z\s]/)) {
      componentDefinition += char;
    }
  }
  return components;
};

export default WordParsingService;
