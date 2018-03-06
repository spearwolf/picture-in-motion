import React from 'react';
import styled from 'styled-components';

import { Canvas, Scene } from './Picimo';
import FrameNo from './FrameNo';
import ClearBackground from './ClearBackground';

import './App.css';

const PicimoCanvas = styled(Canvas)`
  display: inline-block;
  width: 534px;
  height: 300px;
  margin: 0 auto;
  padding: 0;
`;

const App = () => (
  <div className="App">

    <PicimoCanvas alpha>
      <FrameNo />

      <Scene name="foo">
        <Scene name="bar">
          <ClearBackground color="#8ac" />
        </Scene>
        <Scene name="plah" />
      </Scene>
    </PicimoCanvas>

    <p className="App-intro">
      To get started, edit <code>src/App.js</code> and save to reload!
    </p>
  </div>
);

export default App;
