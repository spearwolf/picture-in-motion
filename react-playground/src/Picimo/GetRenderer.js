import React from 'react';
import PropTypes from 'prop-types';

import makeRenderable from './makeRenderable';

class GetRenderer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { renderer: null };
  }

  renderFrame(renderer) {
    this.setState({
      renderer,
      frameNo: renderer.frameNo,
    });
  }

  render() {
    const { children } = this.props;
    const { renderer, frameNo } = this.state;
    if (renderer && typeof children === 'function') {
      return children(renderer, frameNo);
    }
    return null;
  }
}

GetRenderer.propTypes = {
  children: PropTypes.func,
};

GetRenderer.defaultProps = {
  children: undefined,
};

export default makeRenderable(GetRenderer);
