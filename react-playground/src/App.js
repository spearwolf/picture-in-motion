import React from 'react';

import Picimo from './Picimo';
import FrameNo from './FrameNo';

import './App.css';

const App = () => (
  <div className="App">

    <Picimo.Canvas alpha className="Picimo-Canvas-Container">
      <Picimo.Scene name="foo">
        <Picimo.Scene name="bar">
          <Picimo.Clear color="#8ac" />
        </Picimo.Scene>
        <Picimo.Scene name="plah" />
      </Picimo.Scene>

      <div style={{ fontFamily: 'monospace', color: '#333' }}>
        <FrameNo />
      </div>
    </Picimo.Canvas>

    <p className="App-intro">
      To get started, edit <code>src/App.js</code> and save to reload!
    </p>
  </div>
);

export default App;
