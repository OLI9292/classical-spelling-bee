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
/*    "definition":"making one sleepy"
**/
const WordParsingService = (firebaseWord) => {
  let components;
  let definition = firebaseWord.definition;
  const separated = firebaseWord.separated;
  try {
    components = parseComponents(separated);
  } catch (e) {
    return null;
  }
  components = parseDefinition(components, definition);
  definition = cleanDefinition(definition);
  value = _.pluck(components, 'valueSolved').join('');
  if (!definition || !value) {
    console.log(`Word.js -> missing data for ${definition ? definition : value}`)
    return null;
  }
  return {
    value: value,
    components: components,
    definition: definition
  }
};

const cleanDefinition = (definition) => {
  return definition.replace(new RegExp(/[0-9@]/, 'g'), '');
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
      if (!componentString) {
        throw { name : 'EmptyComponentString', message : `Word.js -> error parsing ${separated}` };
      } else {
        const type = char === '#' ? 'separator' : 'unknown';
        valueUnderscores = Array(componentString.length).join('_');
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
