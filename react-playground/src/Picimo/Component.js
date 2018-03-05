import React from 'react';
import PropTypes from 'prop-types';

class Component extends React.Component {
  render() {
    const { renderer } = this.context;
    if (renderer) {
      this.renderFrame(renderer);
    }
    return null;
  }
}

Component.contextTypes = {
  renderer: PropTypes.object,
};

export default Component;
