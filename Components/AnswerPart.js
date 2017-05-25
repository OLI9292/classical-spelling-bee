import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class AnswerPart extends React.Component {
  render() {
    return (
      <View style ={styles.border}>
        <Text style={styles.container}>{this.props.value}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  border: {
    borderColor: '#C4C4C4',
    borderBottomWidth: 8,
    margin: 5,
  },
  container: {
    fontFamily: 'Avenir',
    color: '#C4C4C4',
    fontSize: 42,
  }
});
