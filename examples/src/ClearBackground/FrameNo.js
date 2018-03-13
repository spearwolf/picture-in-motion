import React from 'react';
import PropTypes from 'prop-types';

import { GetRenderer } from '@picimo/react'; // eslint-disable-line

const FrameNo = ({ label }) => (
  <GetRenderer updateOnEachFrame>
    { (renderer, frameNo) => (
      <div style={{ fontFamily: 'monospace', color: '#333' }}>
        { `${label}${frameNo} {${Math.round(renderer.now)} sec} ${renderer.width}x${renderer.height}` }
      </div>
    )}
  </GetRenderer>
);

FrameNo.propTypes = {
  label: PropTypes.string,
};

FrameNo.defaultProps = {
  label: 'frame #',
};

export default FrameNo;
