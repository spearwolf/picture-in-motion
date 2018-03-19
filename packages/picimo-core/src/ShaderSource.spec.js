/* eslint-env jest */
/* eslint-env browser */
/* eslint no-console: 0 */
import { assert } from 'chai';

import ShaderSource from './ShaderSource';
import * as ShaderTool from './ShaderTool';

describe('ShaderSource', () => {
  it('create vertex shader source', () => {
    const source = ShaderSource.vertexShader({ id: 'foo' })`
      attribute vec2 position;
      uniform mat4 viewMatrix;

      ${ShaderTool.rotate('rotateZ', 0.0, 0.0, 1.0)}

      void main(void)
      {
        mat4 rotationMatrix = rotateZ(rotate);
        gl_Position = viewMatrix * (rotationMatrix * vec4(position.xy, 0, 1.0));
      }
    `;
    assert.instanceOf(source, ShaderSource);
    const compiledSource = source.compile();
    console.groupCollapsed('VERTEX SHADER');
    console.log(compiledSource);
    console.groupEnd();
    assert.strictEqual(source.id, 'foo');
    assert.strictEqual(source.type, ShaderSource.VERTEX_SHADER);
    assert.isTrue(compiledSource.indexOf('mat4(c, -s, 0.0, 0.0, s, c, 0.0, 0.0, 0.0, 0.0, oc + c, 0.0, 0.0, 0.0, 0.0, 1.0)') >= 0);
  });

  it('create fragment shader source', () => {
    const source = ShaderSource.fragmentShader()`
      precision mediump float;

      varying vec4 vTextureCoordScaleOpacity;
      uniform sampler2D tex;

      void main(void) {
        gl_FragColor = vTextureCoordScaleOpacity.z * texture2D(tex, vec2(vTextureCoordScaleOpacity.s, vTextureCoordScaleOpacity.t));
      }
    `;
    assert.instanceOf(source, ShaderSource);
    const compiledSource = source.compile();
    console.groupCollapsed('FRAGMENT SHADER');
    console.log(compiledSource);
    console.groupEnd();
    assert.isAbove(source.id.length, 0);
    assert.strictEqual(source.type, ShaderSource.FRAGMENT_SHADER);
    assert.isTrue(compiledSource.indexOf('gl_FragColor =') >= 0);
  });

  it('create and include partials', () => {
    const partial = ShaderSource.partial()`
      vec4 ${({ bar }) => bar}(float x)
      {
        return vec4(x, 0, 0, 0);
      }
    `;

    const source = ShaderSource.fragmentShader({ bar: 'foo' })`
      precision mediump float;
      uniform sampler2D tex;

      ${partial}

      void main(void) {
        gl_FragColor = vTextureCoordScaleOpacity.z * texture2D(tex, vec2(vTextureCoordScaleOpacity.s, vTextureCoordScaleOpacity.t));
      }
    `;
    assert.instanceOf(source, ShaderSource);
    const compiledSource = source.compile();
    console.groupCollapsed('PARTIAL INCLUDED SHADER');
    console.log(compiledSource);
    console.groupEnd();
    assert.isAbove(source.id.length, 0);
    assert.strictEqual(source.type, ShaderSource.FRAGMENT_SHADER);
    assert.isTrue(compiledSource.indexOf('vec4 foo') >= 0);
  });

  it('vertex shader fromElement()', () => {
    const el = document.createElement('script');
    el.setAttribute('type', 'x-shader/vertex');
    el.setAttribute('id', 'plah');
    el.textContent = `
      attribute vec3 position;

      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const source = ShaderSource.fromElement(el);
    assert.instanceOf(source, ShaderSource);
    assert.strictEqual(source.id, 'plah');
    assert.strictEqual(source.type, ShaderSource.VERTEX_SHADER);
    assert.isTrue(source.compile().indexOf('gl_Position = vec4') >= 0);
  });

  it('fragment shader fromElement()', () => {
    const el = document.createElement('script');
    el.setAttribute('type', 'x-shader/fragment');
    el.textContent = `
      precision mediump float;

      uniform float time;
      uniform vec2 resolution;

      void main( void ) {
        vec2 position = - 1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
        float red = abs( sin( position.x * position.y + time / 5.0 ) );
        float green = abs( sin( position.x * position.y + time / 4.0 ) );
        float blue = abs( sin( position.x * position.y + time / 3.0 ) );
        gl_FragColor = vec4( red, green, blue, 1.0 );
      }
    `;

    const source = ShaderSource.fromElement(el);
    assert.instanceOf(source, ShaderSource);
    assert.isAbove(source.id.length, 0);
    assert.strictEqual(source.type, ShaderSource.FRAGMENT_SHADER);
    assert.isTrue(source.compile().indexOf('gl_FragColor = vec4') >= 0);
  });
});
