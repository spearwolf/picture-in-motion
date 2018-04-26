/* eslint-env browser */
/* eslint no-console: 0 */
import '@babel/polyfill';

import {
  IndexedPrimitive,
  ShaderSource,
  TexturedSpriteGroup,
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

  attributes: {
    position: ['x', 'y', 'z'],
    texCoords: ['s', 't'],
  },

  proto: {

    translate(x, y) {
      this.x0 += x;
      this.x1 += x;
      this.x2 += x;
      this.x3 += x;
      this.y0 += y;
      this.y1 += y;
      this.y2 += y;
      this.y3 += y;
    },

    setTexCoordsByTexture({
      minS,
      minT,
      maxS,
      maxT,
    }) {
      this.setTexCoords(minS, minT, maxS, minT, maxS, maxT, minS, maxT);
    },

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

  precision highp float;

  attribute vec3 position;
  attribute vec2 texCoords;

  uniform float time;
  uniform mat4 projection;

  varying vec2 vTexCoords;

  void main(void)
  {
    gl_Position = projection * vec4(position.x, position.y + (150.0 * sin((3.0 * time) + (position.x / 300.0))), position.z, 1.0);
    vTexCoords = texCoords;
  }

`;


// ---------------------------------------------------------------------------
//
// 3) create fragment shader
//
// ---------------------------------------------------------------------------

const fragmentShader = ShaderSource.fragmentShader()`

  precision mediump float;

  uniform sampler2D tex;

  varying vec2 vTexCoords;

  void main(void) {
    gl_FragColor = texture2D(tex, vec2(vTexCoords.s, vTexCoords.t));
  }

`;


// ---------------------------------------------------------------------------
//
// 4) create the sprite group
//
// ---------------------------------------------------------------------------

const sprites = new TexturedSpriteGroup(descriptor, IndexedPrimitive.createQuads, {
  vertexShader,
  fragmentShader,

  capacity: 100,
  usage: 'static',

  setSize: (sprite, w, h) => sprite.setSize(w, h),
  setTexCoordsByTexture: (sprite, texture) => sprite.setTexCoordsByTexture(texture),
});

console.log('TexturedSpriteGroup', sprites);


// ---------------------------------------------------------------------------
//
// 5) load texture atlas and create some sprites
//
// ---------------------------------------------------------------------------

sprites.loadTextureAtlas('tex', '/assets/nobinger.json').then((atlas) => {
  const STEP_X = 60;
  const COUNT = 40;

  let x = -0.5 * COUNT * STEP_X;
  for (let i = 0; i < COUNT; i++) {
    sprites.createSprite(atlas.randomFrame()).translate(x, 0);
    x += STEP_X;
  }

  sprites.touchVertexBuffers(); // inform the renderer that our vertices have been changed and need to be uploaded to gpu memory
});


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

  renderer.drawSpriteGroup(sprites);

  window.requestAnimationFrame(animate);
}

animate();
