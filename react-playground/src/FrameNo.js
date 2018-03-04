import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const FrameNo = ({ label }, { renderer }) => renderer && (
  <Fragment>{ `${label}${renderer.frameNo} {${Math.round(renderer.now)} sec}` }</Fragment>
);

FrameNo.contextTypes = {
  renderer: PropTypes.object,
};

FrameNo.propTypes = {
  label: PropTypes.string.isRequired,
};

FrameNo.defaultProps = {
  label: 'frame #',
};

export default FrameNo;
