/* eslint-env browser */
/* eslint-env mocha */
/* eslint no-console: 0 */
import { assert } from 'chai';

import {
  ElementIndexArray,
  Mat4,
  ShaderProgram,
  ShaderSource,
  ShaderUniformVariable,
  ShaderVariableBufferGroup,
  VODescriptor,
} from '@picimo/core'; // eslint-disable-line

import WebGlBuffer from './WebGlBuffer';
import WebGlRenderer from './WebGlRenderer';
import WebGlResourceLibrary from './WebGlResourceLibrary';
import WebGlShader from './WebGlShader';

describe('WebGlResourceLibrary', () => {
  let container;
  let renderer;
  let voDescriptor;
  let voArray;
  let vsSource;
  let fsSource;

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
          scalars: ['x', 'y', 'z'],
        },
        {
          name: 'color',
          type: 'float32',
          size: 4,
          scalars: ['r', 'g', 'b', 'a'],
        },
      ],
    });
    voDescriptor = vod;
    voArray = vod.createVOArray(100, { usage: 'static' });

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

        attribute vec3 position;
        attribute vec4 color;

        uniform mat4 projection;
        uniform mat4 viewMatrix;
        uniform float time;

        varying vec4 vColor;
        varying vec4 vTime;

        void main(void)
        {
          gl_Position = projection * viewMatrix * vec4(position.xyz, 1.0);
          vColor = color;
          float t = (((time - floor(time)) * 180.0) - 90.0) * 3.1415926535897932384626433832795 / 180.0;
          vTime = vec4(sin(t), cos(t), sin(t + 0.666), 1.0);
        }
      `;

      const vertexShader = renderer.resources.loadVertexShader(shaderSource);
      assert.exists(vertexShader);
      assert.instanceOf(vertexShader, WebGlShader, 'vertexShader should be an instance of WebGlShader');

      vsSource = shaderSource;
    });

    it('compile fragmentShader', () => {
      const shaderSource = ShaderSource.fragmentShader()`
        precision mediump float;

        varying vec4 vColor;
        varying vec4 vTime;

        void main(void) {
          gl_FragColor = vColor * vTime;
        }
      `;

      const fragmentShader = renderer.resources.loadFragementShader(shaderSource);
      assert.exists(fragmentShader);
      assert.instanceOf(fragmentShader, WebGlShader, 'vertexShader should be an instance of WebGlShader');

      fsSource = shaderSource;
    });

    describe('useShaderProgram', () => {
      it('initialize shader context', () => {
        renderer.initFrame();
        renderer.shaderContext.pushVar(new ShaderUniformVariable('viewMatrix', new Mat4()));
        renderer.shaderContext.pushVar(new ShaderVariableBufferGroup(voArray, voDescriptor));
      });

      it('useShaderProgram()', () => {
        const success = renderer.useShaderProgram(new ShaderProgram(vsSource, fsSource));
        console.debug('renderer.glx.enabledVertexAttribLocations=', renderer.glx.enabledVertexAttribLocations);
        assert.isTrue(success, 'renderer.useShaderProgram(..) returned with errors');
      });
    });
  });
});
