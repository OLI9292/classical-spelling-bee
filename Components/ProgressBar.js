import React from 'react';
import styled from 'styled-components/native';
import { StyleSheet, View } from 'react-native';
import { Dimensions} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class ProgressBar extends React.Component {
  render() {
    var completeWidth = width * 0.9;

    var fillWidth = this.props.progress / 10 * completeWidth;
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
    backgroundColor: '#FADC3D',
    height: height * 0.05,
    marginTop: height * 0.03,
  },
  innerBar: {
    backgroundColor: '#FEBF00',
    height: height * 0.05,
  }
});
