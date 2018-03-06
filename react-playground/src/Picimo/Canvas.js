/* eslint-env browser */
/* eslint no-param-reassign: 0 */
/* eslint react/no-unused-prop-types: 0 */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';

import { WebGlRenderer } from '@picimo/renderer'; // eslint-disable-line

import RenderCtl, { RENDERCTL } from './RenderCtl';

const initRenderer = (component, canvas) => {
  if (!canvas) return;
  if (component.renderer) return;
  if (component.canvas && canvas !== component.canvas) {
    throw new Error('<Picimo.Canvas>::initRenderer: canvas element changed!');
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
    [RENDERCTL]: {
      renderer: component.renderer,
      children: new Set(),
    },
  };

  console.log('<Picimo.Canvas>::initRenderer:', component.renderer); // eslint-disable-line

  component.forceUpdate();
};

const renderFrameTree = (renderer, context) => {
  const renderCtl = context && context[RENDERCTL];
  if (!renderCtl) return;

  let childrenDidRender = false;

  const renderChildren = () => {
    childrenDidRender = true;
    renderCtl.children.forEach(child => renderFrameTree(renderer, child.childContext));
  };

  RenderCtl.renderFrame(renderCtl, renderer, renderChildren);

  if (!childrenDidRender) {
    renderChildren();
  }

  RenderCtl.renderFrameAfter(renderCtl, renderer);
};

const renderFrame = (now, component) => {
  const { renderer } = component;
  if (renderer) {
    renderer.render(now);
    renderFrameTree(renderer, component.childContext);
  }
};

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.rafId = 0;
    this.childContext = { [RENDERCTL]: null };
  }

  getChildContext() {
    return this.childContext;
  }

  componentDidMount() {
    // TODO extract this into an extra component: <Picimo.Animator/>
    const animate = () => {
      this.rafId = window.requestAnimationFrame((now) => {
        animate();
        renderFrame(now, this);
      });
    };
    animate();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.rafId);
  }

  render() {
    return (
      <Fragment>
        <div className={this.props.className}>
          <canvas ref={canvas => initRenderer(this, canvas)} />
        </div>
        { this.props.children }
      </Fragment>
    );
  }
}

Canvas.childContextTypes = {
  [RENDERCTL]: PropTypes.shape({
    renderer: PropTypes.object,
    children: PropTypes.object,
  }),
};

Canvas.propTypes = {
  children: PropTypes.node,
  className: PropTypes.any,
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
  className: undefined,
  alpha: false,
  depth: true,
  stencil: true,
  antialias: false,
  premultipliedAlpha: true,
  preserveDrawingBuffer: false,
  pixelRatio: undefined,
};

export default Canvas;
