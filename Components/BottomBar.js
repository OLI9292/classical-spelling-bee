import React from 'react';
import styled from 'styled-components/native';
import { Dimensions} from 'react-native';

const width = Dimensions.get('window').width;

import AutoHintButton from './AutoHintButton';
import HintButton from './HintButton';

export default class BottomBar extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Container >
        <AutoHintButton / >
        <HintButton / >
      </Container >
    );
  }
}

const Container = styled.View`
flexDirection: row;
justifyContent: space-between;

`
