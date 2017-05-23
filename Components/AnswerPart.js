import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class AnswerPart extends React.Component {
  render() {
    return (
      <Text style={styles.container}>{this.props.value}</Text>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 2,
    fontSize: 24
  }
});
