import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyDHQikqQ6e3q78jI9u5Us-uayAFBuFVTgM',
  authDomain: 'classical-spelling-bee.firebaseapp.com',
  databaseURL: 'https://classical-spelling-bee.firebaseio.com',
  storageBucket: "classical-spelling-bee.appspot.com"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const FirebaseManager = {
  connected: firebaseApp.database().ref('.info/connected'),
  questionList: firebaseApp.database().ref().child('mobile').child('question_lists'),
  words: firebaseApp.database().ref().child('mobile').child('words'),
  roots: firebaseApp.database().ref().child('mobile').child('roots')
}

export default FirebaseManager;
