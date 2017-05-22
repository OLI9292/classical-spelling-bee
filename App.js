import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';

import FirebaseManager from './Networking/FirebaseManager';
import WordComponent from './Views/WordComponent';
import OptionButton from './Views/OptionButton';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      options: []
    };
  }

  listenForOptions() {
    FirebaseManager.options.on('value', (snap) => {
      var options = [];
      snap.forEach((child) => {
      options.push(child.key);
    });
    this.setState({
      options: options
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
    this.listenForOptions();
  }

  render() {
    var optionButtons = this.state.options.map((option) => {
      return ( <OptionButton key={option} option={option}/> );
   });

    return (
      <View style={styles.container}>
        <View style={styles.promptContainer}>
          <Text style={styles.prompt}>Spell the word that means {this.state.definition}</Text>
          <WordComponent component={this.state.components} />
        </View>
        <View style={styles.buttonContainer}>
          {optionButtons}
        </View>
      </View>
    );
  }
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
  buttonContainer: {
    alignItems: 'center',
    flex: 1,
  },
});
