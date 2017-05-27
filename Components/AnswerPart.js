import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class AnswerPart extends React.Component {
  render() {
    const whiteSpace = this.props.value.replace(new RegExp(/[_]/, 'g'), '\xa0\xa0');

    return (
      <View style ={styles.border}>
        <Text style={styles.container}>{whiteSpace}</Text>
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
    fontFamily: 'Avenir-Black',
    color: 'black',
    fontSize: 32,
  }
});
