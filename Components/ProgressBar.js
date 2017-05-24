import React from 'react';
import styled from 'styled-components/native';
import { StyleSheet, Text, View } from 'react-native';
import { Dimensions} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class ProgressBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };
  }

  render() {
    var completeWidth = width * 0.9;

    var fillWidth = this.state.progress / 10 * completeWidth;
    if (fillWidth <= 1 ) { fillwidth = 3.5};

    return (
      <View style={styles.outerBar}>
        <View style={[styles.innerBar, { width: fillWidth }]} />
      </View>

    );
  }
}
const styles = StyleSheet.create({
  outerBar: {
    backgroundColor: 'grey',
    height: height * 0.05,
    marginTop: height * 0.01,
  },
  innerBar: {
    backgroundColor: 'blue',
    height: height * 0.05,
  }
});
