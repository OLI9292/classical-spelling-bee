import React from 'react';
import _ from 'underscore';
import { mapObject } from 'underscore';
import { 
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';

import FirebaseManager from './Networking/FirebaseManager';
import WordComponent from './Views/WordComponent';
import Word from './Models/Word'

const height = Dimensions.get('window').height; 
const width = Dimensions.get('window').width; 

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      components: []
    };
  }

  listenForWords() {
    FirebaseManager.words.on('value', (snap) => {
      const words = _.values(mapObject(snap.val(), function(val, key) { return Word(val) }));
      const word = _.last(words);
      this.setState({
        definition: word.definition,
        components: word.components
      });
    });
  }

  componentDidMount() {
    this.listenForWords();
  }

  render() {
    var components = this.state.components.map((component) => {
      return(<WordComponent key={component.value} component={component} />);
    });

    return (
      <View style={styles.promptContainer}>
        <Text style={styles.prompt}>Spell the word that means {this.state.definition}</Text>
        {components}
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
