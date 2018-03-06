import React from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';

import makeRenderable from './makeRenderable';

const getColorState = ({ color }) => {
  const c = tinycolor(color).toRgb();
  const red = c.r / 255;
  const green = c.g / 255;
  const blue = c.b / 255;

  return {
    red,
    green,
    blue,
    alpha: c.a,
  };
};

class Clear extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = getColorState(props);
  }

  componentWillReceiveProps(nextProps) {
    console.log('<Clear>::componentWillReceiveProps:', nextProps);  // eslint-disable-line

    if (nextProps.color && nextProps.color !== this.props.color) {
      this.setState(getColorState(nextProps));
    }
  }

  renderFrame({ gl }) {
    const {
      red,
      green,
      blue,
      alpha,
    } = this.state;

    gl.clearColor(red, green, blue, alpha);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  render() {
    return null;
  }
}

Clear.propTypes = {
  color: PropTypes.string,
};

Clear.defaultProps = {
  color: 'rgba(240, 240, 240, 0)',
};

export default makeRenderable(Clear);
