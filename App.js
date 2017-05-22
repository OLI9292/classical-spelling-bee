import * as firebase from 'firebase';
import React from 'react';
import WordComponent from './Views/WordComponent';

import { 
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';

const height = Dimensions.get('window').height; 
const width = Dimensions.get('window').width; 

const firebaseConfig = {
  apiKey: 'AIzaSyDHQikqQ6e3q78jI9u5Us-uayAFBuFVTgM',
  authDomain: 'classical-spelling-bee.firebaseapp.com',
  databaseURL: 'https://classical-spelling-bee.firebaseio.com',
  storageBucket: "classical-spelling-bee.appspot.com"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      definition: null,
    };
    this.wordsRef = this.getRef().child('mobile').child('words');
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  listenForWords(wordsRef) {
    wordsRef.on('value', (snap) => {
      snap.forEach((child) => {
        this.setState({
          definition: child.val().definition,
          components: child.val().separated
        });
      });
    });
  }

  componentDidMount() {
    this.listenForWords(this.wordsRef);
  }

  render() {
    return (
      <View style={styles.promptContainer}>
        <Text style={styles.prompt}>Spell the word that means {this.state.definition}</Text>
        <WordComponent component={this.state.components} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  promptContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    marginTop: height * 0.1
  },
  prompt: {
    alignItems: 'center',
    fontSize: 18,
    textAlign: 'center',
    width: width * 0.8
  },
  answerComponents: {
    alignItems: 'center',
    marginTop: height * 0.5
  }
});
