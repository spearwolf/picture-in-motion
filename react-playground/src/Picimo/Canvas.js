import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { WebGlRenderer } from '@picimo/renderer';

const initRenderer = (component, canvas) => {
  component.canvas = canvas;
  component.renderer = new WebGlRenderer(canvas);

  console.log('initRenderer:', component, component.canvas, component.renderer);
};

class Canvas extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <div style={{ width: '320px', height: '200px', display: 'inline-block', margin: '0 auto' }}>
        <canvas ref={canvas => initRenderer(this, canvas)} />
        { this.props.children }
      </div>
    );
  }
}

export default Canvas;
