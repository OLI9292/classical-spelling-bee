import React from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class WordComponent extends React.Component {

  render() {
    return (
      <Text>{this.props.component}</Text>
    );
  }
}

const styles = StyleSheet.create({
  
});
