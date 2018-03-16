/* eslint-env browser */
/* eslint-env mocha */
import { assert } from 'chai';

import {
  ShaderProgram,
  ShaderSource,
  ShaderTool,
} from '@picimo/core'; // eslint-disable-line

import WebGlRenderer from './WebGlRenderer';

describe('WebGlProgram', () => {
  let container;
  let renderer;
  let vertexShader;
  let fragmentShader;

  before(() => {
    container = document.createElement('div');
    container.style.width = '320px';
    container.style.height = '240px';
    document.body.appendChild(container);
    renderer = new WebGlRenderer(container);

    vertexShader = new ShaderSource(ShaderSource.VERTEX_SHADER, `

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

    `);

    fragmentShader = new ShaderSource(ShaderSource.FRAGMENT_SHADER, `
      precision mediump float;

      varying vec4 vTextureCoordScaleOpacity;
      uniform sampler2D tex;

      void main(void) {
        gl_FragColor = vTextureCoordScaleOpacity.z * texture2D(tex, vec2(vTextureCoordScaleOpacity.s, vTextureCoordScaleOpacity.t));
      }
    `);
  });

  after(() => {
    document.body.removeChild(container);
  });

  let prg;

  it('create ShaderProgram', () => {
    prg = new ShaderProgram(vertexShader, fragmentShader);
    assert.exists(prg, 'ShaderProgram should exists');
  });

  let glProgram;

  it('load WebGlProgram', () => {
    glProgram = renderer.resources.loadProgram(prg);
    assert.exists(glProgram, 'WebGlProgram should exists');
  });

  it('uniformNames', () => {
    assert.deepEqual(glProgram.uniformNames.sort(), ['tex', 'viewMatrix']);
  });

  it('attributeNames', () => {
    assert.deepEqual(glProgram.attributeNames.sort(), [
      'opacity',
      'pos2d',
      'posZ',
      'rotate',
      'scale',
      'translate',
      'uv',
    ]);
  });
});
