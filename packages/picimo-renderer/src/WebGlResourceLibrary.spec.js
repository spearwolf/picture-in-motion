/* eslint-env browser */
/* eslint-env mocha */
import { assert } from 'chai';

import {
  ElementIndexArray,
  ShaderSource,
  ShaderTool,
  VODescriptor,
} from '@picimo/core'; // eslint-disable-line

import WebGlBuffer from './WebGlBuffer';
import WebGlRenderer from './WebGlRenderer';
import WebGlResourceLibrary from './WebGlResourceLibrary';

describe('WebGlResourceLibrary', () => {
  let container;
  let renderer;

  before(() => {
    container = document.createElement('div');
    container.style.width = '320px';
    container.style.height = '240px';
    document.body.appendChild(container);
    renderer = new WebGlRenderer(container);
  });

  after(() => {
    document.body.removeChild(container);
  });

  it('renderer has a resource library', () => {
    assert.exists(renderer.resources);
    assert.instanceOf(renderer.resources, WebGlResourceLibrary, 'renderer.resources is a instance of WebGlResourceLibrary');
  });

  describe('Resource: ElementIndexArray', () => {
    const quadIndices = ElementIndexArray.Generate(10, [0, 1, 2, 0, 2, 3], 4, 0, 'dynamic');

    it('loadBuffer()', () => {
      const ref = renderer.resources.loadBuffer(quadIndices.ref);
      assert.strictEqual(ref.type, 'WebGlBuffer', 'dataRef.type should be "WebGlBuffer"');
      assert.instanceOf(ref.data, WebGlBuffer, 'dataRef.data should be an instance of WebGlBuffer');
      assert.strictEqual(ref.id, quadIndices.ref.id, 'dataRef.id should be equals to ElementIndexArray.ref.id');
      assert.strictEqual(ref.serial, 0, 'dataRef.serial should be initially set to 0');
      assert.strictEqual(ref.data.usage, renderer.glx.gl.DYNAMIC_DRAW, 'usage hint should be "dynamic"');
    });

    it('findBuffer()', () => {
      const ref = renderer.resources.findBuffer(quadIndices.ref);
      assert.strictEqual(ref.type, 'WebGlBuffer', 'dataRef.type should be "WebGlBuffer"');
      assert.strictEqual(ref.id, quadIndices.ref.id, 'dataRef.id should be equals to ElementIndexArray.ref.id');
    });

    it('gl.isBuffer()', () => {
      const ref = renderer.resources.findBuffer(quadIndices.ref);
      ref.data.bufferData();
      assert.isTrue(renderer.glx.gl.isBuffer(ref.data.glBuffer));
    });

    it('freeBuffer()', () => {
      const { glBuffer } = renderer.resources.findBuffer(quadIndices.ref).data;
      renderer.resources.freeBuffer(quadIndices.ref);
      const ref = renderer.resources.findBuffer(quadIndices.ref);
      assert.notExists(ref);
      assert.isFalse(renderer.glx.gl.isBuffer(glBuffer));
    });
  });

  describe('Resource: VOArray', () => {
    const vod = new VODescriptor({
      vertexCount: 3,
      attributes: [
        {
          name: 'position',
          type: 'float32',
          size: 3,
          attrNames: ['x', 'y', 'z'],
        },
      ],
    });
    const voArray = vod.createVOArray(100, { usage: 'static' });

    it('loadBuffer()', () => {
      const ref = renderer.resources.loadBuffer(voArray.ref);
      assert.strictEqual(ref.type, 'WebGlBuffer', 'dataRef.type should be "WebGlBuffer"');
      assert.instanceOf(ref.data, WebGlBuffer, 'dataRef.data should be an instance of WebGlBuffer');
      assert.strictEqual(ref.id, voArray.ref.id, 'dataRef.id should be equals to VOArray.ref.id');
      assert.strictEqual(ref.serial, 0, 'dataRef.serial should be initially set to 0');
      assert.strictEqual(ref.data.usage, renderer.glx.gl.STATIC_DRAW, 'usage hint should be "static"');
      assert.exists(ref.data.typedArray, 'typedArray hint should be created');
    });

    it('gl.isBuffer()', () => {
      const ref = renderer.resources.findBuffer(voArray.ref);
      ref.data.bufferData();
      assert.isTrue(renderer.glx.gl.isBuffer(ref.data.glBuffer));
    });

    it('freeBuffer()', () => {
      const { glBuffer } = renderer.resources.findBuffer(voArray.ref).data;
      renderer.resources.freeBuffer(voArray.ref);
      assert.isFalse(renderer.glx.gl.isBuffer(glBuffer));
    });
  });

  describe('Resource: Shader', () => {
    it('compile vertexShader', () => {
      const shaderSource = ShaderSource.vertexShader()`

        attribute vec2 pos2d;
        attribute float posZ;
        attribute vec2 uv;
        attribute vec2 translate;
        attribute float rotate;
        attribute float scale;
        attribute float opacity;

        uniform mat4 viewMatrix;

        varying vec4 vTextureCoordScaleOpacity;

        ${ShaderTool.rotate('rotateZ', 0.0, 0.0, 1.0)}

        void main(void)
        {
          mat4 rotationMatrix = rotateZ(rotate);
          gl_Position = viewMatrix * ((rotationMatrix * (vec4(scale, scale, scale, 1.0) * vec4(pos2d.xy, posZ, 1.0))) + vec4(translate.xy, 0.0, 0.0));
          vTextureCoordScaleOpacity = vec4(uv.xy, opacity, 0.0);
        }
      `;

      const vertexShader = renderer.resources.loadVertexShader(shaderSource);
      assert.exists(vertexShader);
    });

    it('compile fragmentShader', () => {
      const shaderSource = ShaderSource.fragmentShader()`
        precision mediump float;

        varying vec4 vTextureCoordScaleOpacity;
        uniform sampler2D tex;

        void main(void) {
          gl_FragColor = vTextureCoordScaleOpacity.z * texture2D(tex, vec2(vTextureCoordScaleOpacity.s, vTextureCoordScaleOpacity.t));
        }
      `;

      const fragmentShader = renderer.resources.loadFragementShader(shaderSource);
      assert.exists(fragmentShader);
    });
  });
});
