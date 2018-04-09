import React from 'react';
import styled from 'styled-components';

import { Canvas, Scene } from '@picimo/react'; // eslint-disable-line

import FrameNo from './FrameNo';
import WebGlInfo from './WebGlInfo';
import ClearBackground from './ClearBackground';

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

const ControlsLayout = styled.section`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Controls = styled.div`
  display: inline-block;
  border-radius: 3px;
  max-width: 100vw;
  min-width: 240px;
  padding: 15px 15px;
  background-color: #fff;
  z-index: 10;
`;

const App = () => (
  <PicimoCanvas alpha>
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
      </Controls>
    </ControlsLayout>
  </PicimoCanvas>
);

export default App;
