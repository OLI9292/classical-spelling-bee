import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Dimensions} from 'react-native';

import autoHintPauseImage from '../Assets/Images/AutoHint-Pause.png';
import autoHintStartImage from '../Assets/Images/AutoHint-Start.png';
import hintImage from '../Assets/Images/Hint.png';

const width = Dimensions.get('window').width;

export default class BottomBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <TouchableOpacity onPress={() => this.props.toggleAutohint()}>
          <AutoHint source={this.props.autohintOn ? autoHintPauseImage : autoHintStartImage}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.hint}>
          <Hint disabled={this.props.hintDisabled} source={hintImage} />
        </TouchableOpacity>
      </Container>
    );
  };
}

const AutoHint = styled.Image`
  height: ${width * 0.12};
  width: ${width * 0.12};
`

const Container = styled.View`
  flexDirection: row;
  justifyContent: space-between;
`

const Hint = styled.Image`
  height: ${width * 0.12};
  opacity: ${props => props.disabled ? 0.3 : 1};
  width: ${width * 0.12};
`
