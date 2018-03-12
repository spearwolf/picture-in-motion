import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import makeRenderable from './makeRenderable';

class Scene extends React.Component {
  renderFrame(renderer, renderChildren) {
    if (renderer.frameNo === 66) {
      console.log('<Scene>::renderFrame:', this.props.name); // eslint-disable-line
    }

    renderChildren();

    if (renderer.frameNo === 66) {
      console.log('<Scene>::renderFrameAfter:', this.props.name); // eslint-disable-line
    }
  }

  render() {
    const { children } = this.props;
    if (children) {
      return (
        <Fragment>{ this.props.children }</Fragment>
      );
    }
    return null;
  }
}

Scene.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.any,
};

Scene.defaultProps = {
  children: undefined,
};

export default makeRenderable(Scene);
