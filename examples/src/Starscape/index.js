/* eslint-env browser */
/* eslint no-console: 0 */
import '@babel/polyfill';

import {
  IndexedPrimitive,
  Projection,
  ProjectionUniform,
  ShaderSource,
  ShaderUniformVariable,
  TexturedSpriteGroup,
  VODescriptor,
} from '@picimo/core'; // eslint-disable-line

import { BlendMode, WebGlRenderer } from '@picimo/renderer'; // eslint-disable-line

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
      scalars: ['x', 'y', 'z'],
    },
    {
      name: 'translate',
      uniform: true,
      scalars: ['tx', 'ty', 'tz'],
    },
    {
      name: 'texCoords',
      scalars: ['s', 't'],
    },
  ],

  proto: {

    moveTo(x, y, z) {
      this.tx = x;
      this.ty = y;
      this.tz = z;
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
  attribute vec3 translate;
  attribute vec2 texCoords;

  uniform float time;
  uniform mat4 projection;
  uniform vec3 speed;
  uniform vec3 offset;
  uniform vec3 range;

  varying vec2 vTexCoords;
  varying vec3 vDepth;

  void main(void)
  {
    vec3 move =  mod(translate + (speed * time) + offset, range);
    gl_Position = projection * vec4(position + move - (range / 2.0), 1.0);
    vTexCoords = texCoords;
    vDepth = (move.z / range.z) * vec3(0.85, 0.9, 1.0);
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
  varying vec3 vDepth;

  void main(void) {
    gl_FragColor = texture2D(tex, vec2(vTexCoords.s, vTexCoords.t)) * vec4(vDepth.xyz, 1.0);
  }

`;


// ---------------------------------------------------------------------------
//
// 4) create the sprite group
//
// ---------------------------------------------------------------------------

const STARS = 16000;

const sprites = new TexturedSpriteGroup(descriptor, IndexedPrimitive.createQuads, {
  vertexShader,
  fragmentShader,

  capacity: STARS,
  maxAllocVOSize: STARS,
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

const RANGE = [400, 400, 400];

sprites.loadTextureAtlas('tex', '/assets/starscape.json').then((atlas) => {
  const COUNT = sprites.capacity;

  for (let i = 0; i < COUNT; i++) {
    const [x, y, z] = [
      Math.random() * RANGE[0],
      Math.random() * RANGE[1],
      Math.random() * RANGE[2],
    ];
    sprites.createSprite(atlas.frame('glowing-star'), 4).moveTo(x, y, z);
  }

  sprites.touchVertexBuffers(); // inform the renderer that our vertices have been changed and need to be uploaded to gpu memory
});


// ---------------------------------------------------------------------------
//
// 6) create perspective projection and custom uniforms
//
// ---------------------------------------------------------------------------

const projection = new ProjectionUniform(new Projection({
  fit: 'contain',
  width: RANGE[0] / 1.7,
  height: RANGE[1] / 1.7,
  perspective: RANGE[2] / 2.0,
}));

const speed = new ShaderUniformVariable('speed', [0, 0, 0]);
const offset = new ShaderUniformVariable('offset', [0, 0, 0]);
const range = new ShaderUniformVariable('range', RANGE);


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

  projection.update(renderer.width, renderer.height);
  renderer.shaderContext.pushVar(projection);

  speed.data = [
    0,
    0,
    -20,
  ];

  offset.data = [
    (Math.sin(renderer.now * 0.2) * RANGE[0] * 0.05) + (Math.sin(renderer.now * 0.5) * RANGE[0] * 0.1),
    Math.cos(renderer.now * 0.4) * RANGE[1] * 0.1,
    Math.sin(renderer.now * 0.2) * RANGE[2] * 0.2,
  ];

  renderer.shaderContext.pushVar(speed);
  renderer.shaderContext.pushVar(offset);
  renderer.shaderContext.pushVar(range);

  renderer.universalContext.push('blend', BlendMode.make('additive'));

  renderer.drawSpriteGroup(sprites);

  window.requestAnimationFrame(animate);
}

animate();
