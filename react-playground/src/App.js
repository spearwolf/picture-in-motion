import React from 'react';
import styled from 'styled-components';

import { Canvas, Scene } from './Picimo';
import FrameNo from './FrameNo';
import WebGlInfo from './WebGlInfo';
import ClearBackground from './ClearBackground';

import './App.css';

const PicimoCanvas = styled(Canvas)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  padding: 0;
  z-index: -1;
`;
//   display: inline-block;
//   width: 534px;
//   max-width: 100vw;
//   height: 300px;
//   margin: 0 auto;
//   padding: 0;
// `;

const ControlsLayout = styled.section`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const Controls = styled.div`
  display: inline-block;
  border-radius: 20px;
  max-width: 100vw;
  padding: 10px 10px;
  background-color: #fff;
  z-index: 10;
`;

const App = () => (
  <div className="App">

    <PicimoCanvas alpha disableWebGL2>
      <ControlsLayout>
        <Controls>
          <FrameNo />
          <WebGlInfo />

          <Scene name="foo">
            <Scene name="bar">
              <ClearBackground color="#8ac" />
            </Scene>
            <Scene name="plah" />
          </Scene>

          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload!
          </p>
        </Controls>
      </ControlsLayout>
    </PicimoCanvas>

  </div>
);

export default App;
