import React from 'react';

import Picimo from './Picimo';

import logo from './logo.svg';
import './App.css';

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Welcome to React</h1>
    </header>

    <Picimo.Canvas />

    <p className="App-intro">
      To get started, edit <code>src/App.js</code> and save to reload!
    </p>
  </div>
);

export default App;
