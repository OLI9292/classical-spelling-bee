import React from 'react';
import { 
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';

import FirebaseManager from './Networking/FirebaseManager';
import WordComponent from './Views/WordComponent';

const height = Dimensions.get('window').height; 
const width = Dimensions.get('window').width; 

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
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
