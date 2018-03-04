/* eslint-env browser */
/* eslint no-param-reassign: 0 */
/* eslint react/no-unused-prop-types: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash';

import { WebGlRenderer } from '@picimo/renderer'; // eslint-disable-line

const initRenderer = (component, canvas) => {
  if (!canvas) return;
  if (component.renderer) return;
  if (component.canvas && canvas !== component.canvas) {
    throw new Error('<Picimo.Canvas/>::initRenderer: canvas element changed!');
  }

  component.canvas = canvas;

  const options = pick(component.props, [
    'alpha',
    'depth',
    'stencil',
    'antialias',
    'premultipliedAlpha',
    'preserveDrawingBuffer',
    'pixelRatio',
  ]);

  component.renderer = new WebGlRenderer(canvas, options);

  component.childContext = {
    renderer: component.renderer,
  };

  console.log('<Picimo.Canvas/>::initRenderer:', component.renderer); // eslint-disable-line
};

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.rafId = 0;
    this.childContext = { renderer: null };
  }

  getChildContext() {
    return this.childContext;
  }

  componentDidMount() {
    // TODO move into an own component, for example: <Picimo.Animator/>
    const animate = () => {
      this.rafId = window.requestAnimationFrame((now) => {
        animate();
        this.renderFrame(now);
      });
    };
    animate();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.rafId);
  }

  renderFrame(now) {
    const { renderer } = this;
    if (renderer) {
      renderer.render(now);
      this.forceUpdate();
    }
  }

  render() {
    return (
      <div style={{
          width: '320px',
          height: '200px',
          display: 'inline-block',
          margin: '0 auto',
        }}
      >
        <canvas ref={canvas => initRenderer(this, canvas)} />
        { this.props.children }
      </div>
    );
  }
}

Canvas.childContextTypes = {
  renderer: PropTypes.object,
};

Canvas.propTypes = {
  children: PropTypes.node,
  alpha: PropTypes.bool,
  depth: PropTypes.bool,
  stencil: PropTypes.bool,
  antialias: PropTypes.bool,
  premultipliedAlpha: PropTypes.bool,
  preserveDrawingBuffer: PropTypes.bool,
  pixelRatio: PropTypes.number,
};

Canvas.defaultProps = {
  children: undefined,
  alpha: false,
  depth: true,
  stencil: true,
  antialias: false,
  premultipliedAlpha: true,
  preserveDrawingBuffer: false,
  pixelRatio: undefined,
};

export default Canvas;
