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
// 1) create picimo renderer
//
// ---------------------------------------------------------------------------

const renderer = new WebGlRenderer(document.getElementById('picimo'), { alpha: true });


// ---------------------------------------------------------------------------
//
// 2) create vertex object definition
//
// ---------------------------------------------------------------------------

const vod = new VODescriptor({
  vertexCount: 4,
  attributes: [
    {
      name: 'position',
      type: 'float32',
      size: 3,
      attrNames: ['x', 'y', 'z'],
    },
    {
      name: 'color',
      type: 'float32',
      size: 4,
      attrNames: ['r', 'g', 'b', 'a'],
    },
  ],
});


// ---------------------------------------------------------------------------
//
// 3) create vertex shader
//
// ---------------------------------------------------------------------------

const vs = ShaderSource.vertexShader()`

  attribute vec3 position;
  attribute vec4 color;

  uniform float time;
  uniform mat4 projection;

  varying vec4 vColor;

  ${ShaderTool.rotate('rotateZ', 0.0, 0.0, 1.0)}

  void main(void)
  {
    mat4 rotation = rotateZ(time);
    gl_Position = projection * rotation * vec4(position.xyz, 1.0);
    vColor = color;
  }

`;


// ---------------------------------------------------------------------------
//
// 4) create fragment shader
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
// 5) create shader program
//
// ---------------------------------------------------------------------------

const shaderProgram = new ShaderProgram(vs, fs);


// ---------------------------------------------------------------------------
//
// 6) create a vertex object pool
//
// ---------------------------------------------------------------------------

const voPool = new VOPool(vod, {
  capacity: 1000,
  maxAllocVOSize: 100,
});

const voPoolShaderVars = new ShaderVariableBufferGroup(voPool);


// ---------------------------------------------------------------------------
//
// 7) create a quad
//
// ---------------------------------------------------------------------------

const quad = voPool.alloc();

quad.setPosition(
  -150, 150, 0,
  150, 150, 0,
  150, -150, 0,
  -150, -150, 0,
);

quad.setColor(
  0, 1, 0, 1,
  0, 1, 1, 1,
  1, 0, 1, 1,
  0, 0, 1, 1,
);

console.log('quad vertices', quad.toArray(['position']), 'colors', quad.toArray(['color']));


// ---------------------------------------------------------------------------
//
// 8) create vertex indices
//
// ---------------------------------------------------------------------------

const quadIndices = ElementIndexArray.Generate(1000, [0, 1, 2, 0, 2, 3], 4);


// ---------------------------------------------------------------------------
//
// 9) start main loop
//
// ---------------------------------------------------------------------------

function animate() {
  renderer.resize();
  renderer.initFrame();

  // render our vertex object pool
  //
  renderer.shaderContext.pushVar(voPoolShaderVars);
  renderer.useShaderProgram(shaderProgram);
  renderer.drawIndexed('TRIANGLES', quadIndices, 6);

  window.requestAnimationFrame(animate);
}

animate();

console.log('hello world');
