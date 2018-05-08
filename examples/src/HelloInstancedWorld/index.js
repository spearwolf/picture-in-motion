/* eslint-env browser */
/* eslint no-console: 0 */
import '@babel/polyfill';

import {
  ShaderSource,
  ShaderTool,
  ShaderProgram,
  ShaderVariableBufferGroup,
  VODescriptor,
  VOPool,
  ElementIndexArray,
} from '@picimo/core'; // eslint-disable-line

import { WebGlRenderer } from '@picimo/renderer'; // eslint-disable-line


// ---------------------------------------------------------------------------
//
// 1) create vertex object definition
//
// ---------------------------------------------------------------------------

const vodBase = new VODescriptor({
  vertexCount: 4,
  attributes: {
    position: ['x', 'y', 'z'],
  },
});

const vod = new VODescriptor({
  instanceOf: vodBase,
  attributes: {
    translate: ['tx', 'ty', 'tz'],
    color: ['r', 'g', 'b', 'a'],
  },
});


// ---------------------------------------------------------------------------
//
// 2) create vertex shader
//
// ---------------------------------------------------------------------------

const vs = ShaderSource.vertexShader()`

  attribute vec3 position;
  attribute vec3 translate;
  attribute vec4 color;

  uniform float time;
  uniform mat4 projection;

  varying vec4 vColor;

  ${ShaderTool.rotate('rotateZ', 0.0, 0.0, 1.0)}

  void main(void)
  {
    mat4 rotation = rotateZ(time);
    gl_Position = projection * (vec4(translate, 1.0) + (rotation * vec4(position, 1.0)));
    vColor = color;
  }

`;


// ---------------------------------------------------------------------------
//
// 3) create fragment shader
//
// ---------------------------------------------------------------------------

const fs = ShaderSource.fragmentShader()`

  precision mediump float;

  varying vec4 vColor;

  void main(void) {
    gl_FragColor = vColor;
  }

`;


// ---------------------------------------------------------------------------
//
// 4) create shader program
//
// ---------------------------------------------------------------------------

const shaderProgram = new ShaderProgram(vs, fs);


// ---------------------------------------------------------------------------
//
// 5) create a vertex object pool
//
// ---------------------------------------------------------------------------

const voBasePool = new VOPool(vodBase, {
  capacity: 1000,
  maxAllocVOSize: 100,
  usage: 'static',
});

const voPool = new VOPool(vod, {
  capacity: 1000,
  maxAllocVOSize: 100,
});

const voBasePoolShaderVars = new ShaderVariableBufferGroup(voBasePool);
const voPoolShaderVars = new ShaderVariableBufferGroup(voPool);


// ---------------------------------------------------------------------------
//
// 6) create a base quad
//
// ---------------------------------------------------------------------------

const DX = 150;
const DY = 150;

voBasePool.alloc().setPosition(
  -DX, DY, 0,
  DX, DY, 0,
  DX, -DY, 0,
  -DX, -DY, 0,
);


// ---------------------------------------------------------------------------
//
// 7) create some quad instances
//
// ---------------------------------------------------------------------------

const COLORS = [
  [246 / 255, 84 / 255, 84 / 255, 1],
  [249 / 255, 114 / 255, 114 / 255, 1],
  [250 / 255, 220 / 255, 109 / 255, 1],
  [246 / 255, 236 / 255, 102 / 255, 1],
];

const len = COLORS.length;
const x = (len - 1) * DX * -0.5;

for (let i = 0; i < len; i++) {
  const quad = voPool.alloc();
  quad.setTranslate(x + (i * DX), 0, 0);
  quad.setColor(...COLORS[i % len]);
}


// ---------------------------------------------------------------------------
//
// 8) create vertex indices
//
// ---------------------------------------------------------------------------

const quadIndices = ElementIndexArray.Generate(1000, [0, 1, 2, 0, 2, 3], 4);


// ---------------------------------------------------------------------------
//
// 9) create picimo renderer
//
// ---------------------------------------------------------------------------

const renderer = new WebGlRenderer(document.getElementById('picimo'), { alpha: true });


// ---------------------------------------------------------------------------
//
// 10) start main loop
//
// ---------------------------------------------------------------------------

function animate() {
  renderer.resize();
  renderer.initFrame();

  // render our vertex object pool
  //
  renderer.shaderContext.pushVar(voBasePoolShaderVars);
  renderer.shaderContext.pushVar(voPoolShaderVars);

  renderer.useShaderProgram(shaderProgram);
  renderer.drawIndexedInstanced('TRIANGLES', quadIndices, 6, 0, len);

  window.requestAnimationFrame(animate);
}

animate();
