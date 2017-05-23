import React from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class WordComponent extends React.Component {

  render() {
    return (
      <Text>{this.props.key}</Text>
    );
  }
}

const styles = StyleSheet.create({
  
});
