import React from 'react';
import styled from 'styled-components/native';
import { Dimensions} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class ProgressBar extends React.Component {
  render() {
    return (
      <Background>
        <Progress progress={this.props.progress} width={(this.props.progress - 1) / this.props.total * width}/>
      </Background>
    );
  }
}

const Progress = styled.View`
  backgroundColor: #FADC3D;
  height: ${height * 0.01};
`

const Background = styled.View`
  backgroundColor: #FEBF00;
  marginTop: ${height * 0.03};
  height: ${height * 0.01};
`
