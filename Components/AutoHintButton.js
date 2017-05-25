import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Dimensions} from 'react-native';

const width = Dimensions.get('window').width;

export default class AutoHintButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isPlaying: false};
  }

  render() {
    let imageSource = this.state.isPlaying ?
      require('../Assets/Images/AutoHint-Pause.png') :
      require('../Assets/Images/AutoHint-Start.png');
    return (
      <TouchableOpacity onPress={() => this.setState ({isPlaying: !this.state.isPlaying}) }>
        <AutoHint source={imageSource}/>
      </TouchableOpacity>
    );
  }
}

const AutoHint = styled.Image`
  height: ${width * 0.12};
  width: ${width * 0.12};
`
