import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';

import GameComponent from './Components/GameComponent';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <GameComponent />
    );
  }
}
const styles = StyleSheet.create({

});
