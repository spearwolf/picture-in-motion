/* eslint-env browser */
/* eslint no-console: 0 */
import '@babel/polyfill';

import { compile } from '@picimo/toolkit'; // eslint-disable-line
import { WebGlRenderer } from '@picimo/renderer'; // eslint-disable-line

import {
  ShaderSource,
  ShaderTool,
} from '@picimo/core'; // eslint-disable-line


// ---------------------------------------------------------------------------
//
// create vertex object description
//
// ---------------------------------------------------------------------------

const ctx = compile(`

  VertexObject Quads {
    @vertexCount(4)
    @prototype(QuadsProto)

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

`, {
  QuadsProto: {
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


// ---------------------------------------------------------------------------
//
// define webgl shaders
//
// ---------------------------------------------------------------------------

ctx.configure({
  vs: ShaderSource.vertexShader()`

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

  `,
  fs: ShaderSource.fragmentShader()`

    precision mediump float;

    varying vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }

  `,
});


// ---------------------------------------------------------------------------
//
// 3) define sprite group
//
// ---------------------------------------------------------------------------

ctx.compile(`

  SpriteGroup Sprites {
    @vertexObject(Quads)
    @primitive(TriQuads)
    @vertexShader(vs)
    @fragmentShader(fs)

    maxAllocVOSize 100
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

`);


// ---------------------------------------------------------------------------
//
// 4) create a sprite
//
// ---------------------------------------------------------------------------

const sprites = ctx.create('Sprites', { capacity: 1 });
const quad = sprites.createSprite();

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


// ---------------------------------------------------------------------------
//
// 5) create picimo renderer
//
// ---------------------------------------------------------------------------

const renderer = new WebGlRenderer(document.getElementById('picimo'), { alpha: true });


// ---------------------------------------------------------------------------
//
// 6) start main loop
//
// ---------------------------------------------------------------------------

function animate() {
  renderer.resize();
  renderer.initFrame();

  renderer.drawSpriteGroup(sprites);

  window.requestAnimationFrame(animate);
}

animate();
