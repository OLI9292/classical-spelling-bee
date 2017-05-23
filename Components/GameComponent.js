import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';

import FirebaseManager from '../Networking/FirebaseManager';
import ChoiceButton from '../Components/ChoiceButton';
import WordComponent from '../Components/WordComponent';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class GameComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      choices: []
    };
  }

  listenForChoices() {
    FirebaseManager.choices.on('value', (snap) => {
      var choices = [];
      snap.forEach((child) => {
      choices.push(child.key);
    });
    this.setState({
      choices: choices
    });
  });
}

  listenForWords() {
    FirebaseManager.words.on('value', (snap) => {
      snap.forEach((child) => {
        this.setState({
          definition: child.val().definition,
          components: child.val().separated
        });
      });
    });
  }

  componentDidMount() {
    this.listenForWords();
    this.listenForChoices();
  }

  render() {
    var choiceButtons = this.state.choices.map((word) => {
      return ( <ChoiceButton key={word} word={word}/> );
   });

    return (
      <View style={styles.container}>
        <View style={styles.promptContainer}>
          <Text style={styles.prompt}>Spell the word that means {this.state.definition}</Text>
          <WordComponent component={this.state.components} />
        </View>
        <View style={styles.choiceButtonsContainer}>
          {choiceButtons}
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    margin: width * 0.05
  },
  promptContainer: {
    alignItems: 'center',
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
  },
  choiceButtonsContainer: {
    alignItems: 'center',
    flex: 1
  },
});
