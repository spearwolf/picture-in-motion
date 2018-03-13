import React from 'react';
import styled from 'styled-components';

import { Canvas, Clear } from '@picimo/react'; // eslint-disable-line

const Layout = styled.div`
  text-align: center;
`;

const StatusBar = styled.div`
  padding-top: 4px;
  font-size: 15px;
  font-family: monospace;
  color: #eee;
`;

const PicimoCanvas = styled(Canvas)`
  max-width: 960px;
  height: 350px;
  margin-left: auto;
  margin-right: auto;
`;

export default () => (
  <Layout>
    <PicimoCanvas>
      <Clear color="#222" />
    </PicimoCanvas>
    <StatusBar>
      hej tafl-i!
    </StatusBar>
  </Layout>
);
