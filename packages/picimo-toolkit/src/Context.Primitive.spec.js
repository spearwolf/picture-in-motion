/* eslint-env browser */
/* eslint-env mocha */
/* eslint no-console: 0 */
import { expect } from 'chai';

import {
  IndexedPrimitive,
  ElementIndexArray,
} from '@picimo/core'; // eslint-disable-line

import { compile } from '.';

describe('Primitive', () => {
  before(() => console.groupCollapsed('Primitive'));
  after(() => console.groupEnd());

  describe('create()', () => {
    let ctx;
    let primitive;

    before(() => {
      ctx = compile(`

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

      console.log(ctx);

      primitive = ctx.create('TriQuads', { capacity: 10 });
    });

    it('@generate', () => {
      expect(primitive).to.be.an.instanceOf(IndexedPrimitive);
      expect(primitive.primitiveType).to.equal('TRIANGLES');
      expect(primitive.elementIndexArray).to.be.an.instanceOf(ElementIndexArray);
      expect(primitive.elementIndexArray.objectCount).to.equal(10);
    });
  });
});
