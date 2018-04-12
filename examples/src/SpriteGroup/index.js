/* eslint-env browser */
/* eslint no-console: 0 */
import '@babel/polyfill';

import {
  IndexedPrimitive,
  ShaderSource,
  ShaderTool,
  SpriteGroup,
  VODescriptor,
} from '@picimo/core'; // eslint-disable-line

import { WebGlRenderer } from '@picimo/renderer'; // eslint-disable-line

// ---------------------------------------------------------------------------
//
// 1) create vertex object (aka sprite) definition
//
// ---------------------------------------------------------------------------

const descriptor = new VODescriptor({
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
  proto: {
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
// 2) create vertex shader
//
// ---------------------------------------------------------------------------

const vertexShader = ShaderSource.vertexShader()`

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

const fragmentShader = ShaderSource.fragmentShader()`

  precision mediump float;

  varying vec4 vColor;

  void main(void) {
    gl_FragColor = vColor;
  }

`;


// ---------------------------------------------------------------------------
//
// 4) create the sprite group
//
// ---------------------------------------------------------------------------

const sprites = new SpriteGroup(descriptor, IndexedPrimitive.createQuads, {
  vertexShader,
  fragmentShader,

  capacity: 100,

  setSpriteSize: (sprite, w, h) => sprite.setSize(w, h),
});

console.log('VOPool', sprites.voPool);


// ---------------------------------------------------------------------------
//
// 5) create a sprite
//
// ---------------------------------------------------------------------------

const quad = sprites.createSprite(300);

quad.setColor(
  1, 1, 0, 1,
  1, 0, 0, 1,
  1, 0, 0.5, 1,
  1, 0.5, 0, 1,
);


// ---------------------------------------------------------------------------
//
// 6) create picimo renderer
//
// ---------------------------------------------------------------------------

const renderer = new WebGlRenderer(document.getElementById('picimo'), { alpha: true });


// ---------------------------------------------------------------------------
//
// 7) start main loop
//
// ---------------------------------------------------------------------------

function animate() {
  renderer.resize();
  renderer.initFrame();

  const { now } = renderer;
  quad.setSize(200 + (Math.sin(now) * 100), 200 + (Math.cos(now) * 100));

  renderer.drawSpriteGroup(sprites);

  window.requestAnimationFrame(animate);
}

animate();
