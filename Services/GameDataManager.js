import FirebaseManager from '../Networking/FirebaseManager';
import WordParsingService from '../Services/WordParsingService';
import _ from 'underscore';
import { mapObject } from 'underscore';
import { AsyncStorage } from 'react-native';

const GameDataManager = {
  import: async (type) => {
    let data = await asyncStorage(type);
    if (data === null) {
      await fetchWords;
      data = await asyncStorage('words');
    }
    return data;
  }
};

// Firebase Queries
const fetchQuestionLists = async function () {
  FirebaseManager.questionLists.on('value', (snapshot) => save('questionLists', snapshot.val()));
};

const fetchRoots = async function () {
  FirebaseManager.roots.on('value', (snapshot) => {
    const roots = mapObject(snapshot.val(), (v, k) => ({ value: k, definition: v.definition }));
    save('roots', roots);
  });
};

const fetchWords = async function () {
  FirebaseManager.words.on('value', async (snapshot) => {
    const words = mapObject(snapshot.val(), (v, k) => WordParsingService(v));
    save('words', words);
  });
};

// Device Storage
const asyncStorage = async (item) => {
  try {
    const data = await AsyncStorage.getItem(item);
    if (data !== null) {
      return JSON.parse(data);
    } else {
      console.log(`DataImportService.js -> ${item} is null`);
      return null;
    }
  } catch (error) {
    console.log(`DataImportService.js -> error retrieving ${item} from device storage`);
  }
}

const save = async (type, data) => {
  try {
    const json = JSON.stringify(data);
    await AsyncStorage.setItem(type, json);
    console.log(`DataImportService.js -> saved ${Object.keys(data).length} ${type}`)
  } catch (error) {
    console.log(`DataImportService.js -> error saving ${type}`)
  }
}

export default GameDataManager;
