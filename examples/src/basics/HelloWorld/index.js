/* eslint-env browser */
/* eslint no-console: 0 */
import '@babel/polyfill';

import { compile } from '@picimo/toolkit'; // eslint-disable-line
import { WebGlRenderer } from '@picimo/renderer'; // eslint-disable-line

import {
  ShaderSource,
  ShaderTool,
} from '@picimo/core'; // eslint-disable-line

import {
  hexCol2rgba,
  toFloatColors,
} from '@picimo/utils'; // eslint-disable-line


// ---------------------------------------------------------------------------
//
// I. Define vertex object, sprite group and webgl shaders
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

  SpriteGroup Sprites {
    @vertexObject(Quads)
    @primitive(TriQuads)
    @vertexShader(vs)
    @fragmentShader(fs)

    maxAllocVOSize 100

    Quads {
      @prototype(QuadsProto)
    }
  }

`, {
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
// II. Create a sprite group and a sprite
//
// ---------------------------------------------------------------------------

const sprites = ctx.create('Sprites', {
  capacity: 1,

  QuadsProto: {
    stretch(w, h) {
      const w2 = w / 2;
      const h2 = h / 2;

      this.setPosition(
        -w2, h2, 0,
        w2, h2, 0,
        w2, -h2, 0,
        -w2, -h2, 0,
      );
    },

    setColorHex(a, b, c, d) {
      this.setColor(
        ...toFloatColors(hexCol2rgba(a)),
        ...toFloatColors(hexCol2rgba(b)),
        ...toFloatColors(hexCol2rgba(c)),
        ...toFloatColors(hexCol2rgba(d)),
      );
    },
  },
});

const quad = sprites.createSprite();

quad.setColorHex(
  'f9ed69',
  'f08a5d',
  'b83b5e',
  '6a2c70',
);


// ---------------------------------------------------------------------------
//
// III. Create renderer and start main loop
//
// ---------------------------------------------------------------------------

const renderer = new WebGlRenderer(document.getElementById('picimo'), { alpha: true });

function animate() {
  renderer.resize();
  renderer.initFrame();

  const { now } = renderer;
  quad.stretch(230 + (Math.sin(now * 1.25) * 200), 230 + (Math.cos(now) * 200));

  renderer.drawSpriteGroup(sprites);

  window.requestAnimationFrame(animate);
}

animate();
