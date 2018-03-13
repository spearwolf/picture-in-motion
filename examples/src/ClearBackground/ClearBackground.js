import React from 'react';
import styled from 'styled-components';

import { ChromePicker } from 'react-color';

import { Clear } from '@picimo/react'; // eslint-disable-line

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

const ColorPicker = styled(ChromePicker)`
  display: inline-block;
`;

class ClearBackground extends React.Component {
  constructor(props) {
    super(props);

    this.state = { clearColor: '#8ac' };
  }

  setClearColor(color) {
    const {
      r,
      g,
      b,
      a,
    } = color.rgb;
    this.setState({
      clearColor: `rgba(${r}, ${g}, ${b}, ${a})`,
    });
  }

  render() {
    const { clearColor } = this.state;

    return (
      <Container>
        <Clear color={clearColor} />

        <h3>Clear Background</h3>

        <ColorPicker
          color={clearColor}
          onChange={color => this.setClearColor(color)}
        />
      </Container>
    );
  }
}

export default ClearBackground;
