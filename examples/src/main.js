/* eslint-env browser */
import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import AppShell from './AppShell';

console.log('welcome to the picimo app shell :-)'); // eslint-disable-line

ReactDOM.render(<AppShell />, document.getElementById('picimo-examples'));
