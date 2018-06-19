/* eslint-env browser */
/* eslint no-console: 0 */
import '@babel/polyfill';

import {
  hexCol2rgba,
  IndexedPrimitive,
  ShaderProgram,
  ShaderSource,
  ShaderTool,
  SpriteGroup,
  VODescriptor,
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

const sprites = new SpriteGroup(vod, {
  shaderProgram,

  base: new SpriteGroup(vodBase, {
    primitive: IndexedPrimitive.createQuads,
    capacity: 1000,
    maxAllocVOSize: 100,
    usage: 'static',
  }),

  capacity: 1000,
  maxAllocVOSize: 100,
});


// ---------------------------------------------------------------------------
//
// 6) create a base quad
//
// ---------------------------------------------------------------------------

const DX = 150;
const DY = 150;

sprites.base.createSprite().setPosition(
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
  hexCol2rgba('3ec1d3'),
  hexCol2rgba('f6f7d7'),
  hexCol2rgba('ff9a00'),
  hexCol2rgba('ff165d'),
];

const len = COLORS.length;
const x = (len - 1) * DX * -0.5;

for (let i = 0; i < len; i++) {
  const quad = sprites.createSprite();
  quad.setTranslate(x + (i * DX), 0, 0);
  quad.setColor(...COLORS[i % len]);
}


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

  // render the instanced sprite group
  //
  renderer.drawSpriteGroup(sprites);

  window.requestAnimationFrame(animate);
}

animate();
