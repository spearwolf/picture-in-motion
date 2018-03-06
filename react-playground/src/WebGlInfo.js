import React from 'react';

import { GetRenderer } from './Picimo';

const WebGlInfo = () => (
  <GetRenderer>
    { renderer => (
      <div style={{ fontFamily: 'monospace', color: '#666', marginTop: '4px' }}>
        { `WebGL Version: ${renderer.glx.isWebGL2 ? '2' : '1'}` }
      </div>
    )}
  </GetRenderer>
);

export default WebGlInfo;
