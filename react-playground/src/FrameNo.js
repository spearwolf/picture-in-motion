import React from 'react';
import PropTypes from 'prop-types';

import { GetRenderer } from './Picimo';

const FrameNo = ({ label }) => (
  <GetRenderer>
    { (renderer, frameNo) => (
      <div style={{ fontFamily: 'monospace', color: '#333' }}>
        { `${label}${frameNo} {${Math.round(renderer.now)} sec}` }
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
