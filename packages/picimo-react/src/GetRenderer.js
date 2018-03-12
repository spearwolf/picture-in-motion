import React from 'react';
import PropTypes from 'prop-types';

import makeRenderable from './makeRenderable';

class GetRenderer extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = { renderer: null };
  }

  renderFrame(renderer) {
    if (this.props.updateOnEachFrame) {
      this.setState({
        renderer,
        frameNo: renderer.frameNo, // eslint-disable-line
      });
    } else {
      this.setState({ renderer });
    }
  }

  render() {
    const { children } = this.props;
    const { renderer } = this.state;
    if (renderer && typeof children === 'function') {
      return children(renderer, renderer.frameNo);
    }
    return null;
  }
}

GetRenderer.propTypes = {
  children: PropTypes.func,
  updateOnEachFrame: PropTypes.bool,
};

GetRenderer.defaultProps = {
  children: undefined,
  updateOnEachFrame: false,
};

export default makeRenderable(GetRenderer);
