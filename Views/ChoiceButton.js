import React from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class ChoiceButton extends React.Component {

  render() {
    return (
      <Text style={styles.button}>{this.props.word}</Text>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    textAlign: 'center',
    margin: 10,
    borderRadius: 10,
    borderWidth: 2,
    fontSize: 20,
    padding: 15,
    flex: 1,
  }
});
