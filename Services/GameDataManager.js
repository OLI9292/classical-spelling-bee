import FirebaseManager from '../Networking/FirebaseManager';
import QuestionListParsingService from '../Services/QuestionListParsingService';
import WordParsingService from '../Services/WordParsingService';
import _ from 'underscore';
import { mapObject } from 'underscore';
import { AsyncStorage } from 'react-native';

/**
/*  Fetch data from Firebase, save if updated, fall back on Async Storage
/*  https://facebook.github.io/react-native/docs/asyncstorage.html
**/
const GameDataManager = {
  import: async (type) => {
    return fetch(type).then((data) => { 
      if (data) {
        save(type, data)
        return data;
      } else {
        console.log(`DataImportService.js -> error retrieving ${type} from Firebase`);
        return asyncStorage(type);
      }
    });
  }
};

/**
/*  Queries
**/
const fetch = async function (type) {
  if (type === 'config') {
    return FirebaseManager.config.once('value').then(parseConfig);
  } else if (type === 'questionList') {
    return FirebaseManager.questionList.once('value').then(parseQuestionList);
  } else if (type === 'roots') {
    return FirebaseManager.roots.once('value').then(parseRoots);
  } else if (type === 'words') {
    return FirebaseManager.words.once('value').then(parseWords);
  }
};

function parseConfig(snapshot) {
  return snapshot.val();
}

function parseQuestionList(snapshot) {
  return QuestionListParsingService.parse(snapshot);
}

function parseRoots(snapshot) {
  return mapObject(snapshot.val(), (v, k) => ({ value: k, definition: v.definition }));
}

function parseWords(snapshot) {
  return mapObject(snapshot.val(), (v, k) => WordParsingService(v));
}

/**
/*  Device Storage
**/
const asyncStorage = async (type) => {
  try {
    const data = await AsyncStorage.getItem(type);
    if (data !== null) {
      return JSON.parse(data);
    } else {
      console.log(`DataImportService.js -> ${type} is null`);
      return null;
    }
  } catch (error) {
    console.log(`DataImportService.js -> error retrieving ${type} from device storage`);
  }
}

const save = async (type, data) => {
  try {
    const current = await asyncStorage(type);
    if (!_.isEqual(current, data)) {
      const json = JSON.stringify(data);
      await AsyncStorage.setItem(type, json);
      console.log(`DataImportService.js -> saved ${Object.keys(data).length} ${type}`);
    }
  } catch (error) {
    console.log(`DataImportService.js -> error saving ${type}`)
  }
}

export default GameDataManager;
