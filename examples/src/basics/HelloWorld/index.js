/* eslint-env browser */
/* eslint no-console: 0 */
import '@babel/polyfill';

import { compile } from '@picimo/toolkit'; // eslint-disable-line
import { WebGlRenderer } from '@picimo/renderer'; // eslint-disable-line

import {
  ShaderSource,
  ShaderTool,
  ShaderProgram,
  ShaderVariableBufferGroup,
  VOPool,
} from '@picimo/core'; // eslint-disable-line


// ---------------------------------------------------------------------------
//
// 1) create vertex object definition
//
// ---------------------------------------------------------------------------

const ctx = compile(`

  VertexObject Quads {
    @vertexCount(4)

    position {
      x
      y
      z
    }

    color {
      r
      g
      b
      a
    }
  }

  Primitive TriQuads {
    @type(TRIANGLES)
    @generate

    stride 4
    offset 0

    indices [
      0, 1, 2,
      0, 2, 3,
    ]
  }

`, {
  Quads: {
    setSize(w, h) {
      const w2 = w / 2;
      const h2 = h / 2;

      this.setPosition(
        -w2, h2, 0,
        w2, h2, 0,
        w2, -h2, 0,
        -w2, -h2, 0,
      );
    },
  },
});

const vod = ctx.create('Quads');


// ---------------------------------------------------------------------------
//
// 2) create vertex shader
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

const voPool = new VOPool(vod, {
  capacity: 1000,
  maxAllocVOSize: 100,
});

const voPoolShaderVars = new ShaderVariableBufferGroup(voPool);


// ---------------------------------------------------------------------------
//
// 6) create a quad
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
// 7) create primitive
//
// ---------------------------------------------------------------------------

const primitive = ctx.create('TriQuads', { capacity: 1 });


// ---------------------------------------------------------------------------
//
// 8) create picimo renderer
//
// ---------------------------------------------------------------------------

const renderer = new WebGlRenderer(document.getElementById('picimo'), { alpha: true });


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
  renderer.drawPrimitive(primitive, 1);

  window.requestAnimationFrame(animate);
}

animate();

console.log('hello world');
