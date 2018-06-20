/* eslint-env browser */
/* eslint no-console: 0 */
import '@babel/polyfill';

import { compile } from '@picimo/toolkit'; // eslint-disable-line

import {
  IndexedPrimitive,
  ShaderProgram,
  ShaderSource,
  ShaderTool,
  SpriteGroup,
} from '@picimo/core'; // eslint-disable-line

import {
  hexCol2rgba,
  makeCircleCoords,
  sample,
} from '@picimo/utils'; // eslint-disable-line

import { WebGlRenderer, BlendMode } from '@picimo/renderer'; // eslint-disable-line


// ---------------------------------------------------------------------------
//
// 1) create vertex object definition
//
// ---------------------------------------------------------------------------

const ctx = compile(`

  VertexObject voBase {
    @vertexCount(4)

    position: float32 {
      x
      y
      z
    }
  }

  VertexObject vo instantiates voBase {

    translate {
      tx
      ty
      tz
    }

    color: uint8 {
      r
      g
      b
      a
    }

  }

`);

const vod = ctx.create('vo');


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
    vColor = color / 255.0;
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

  base: {
    primitive: IndexedPrimitive.createQuads,
    capacity: 1000,
    maxAllocVOSize: 100,
    usage: 'static',
  },

  capacity: 1000,
  maxAllocVOSize: 100,
});


// ---------------------------------------------------------------------------
//
// 6) create a base quad
//
// ---------------------------------------------------------------------------

const DX = 10;
const DY = 110;

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
  '3ec1d3',
  'f6f7d7',
  'ff9a00',
  'ff165d',
];

makeCircleCoords(100, 1000).forEach(([x, y]) => {
  const quad = sprites.createSprite();
  quad.setTranslate(x, y, 0);
  quad.setColor(...hexCol2rgba(sample(COLORS), 180));
});


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

  renderer.universalContext.push('blend', BlendMode.make('additive'));

  // render the instanced sprite group
  //
  renderer.drawSpriteGroup(sprites);

  window.requestAnimationFrame(animate);
}

animate();
