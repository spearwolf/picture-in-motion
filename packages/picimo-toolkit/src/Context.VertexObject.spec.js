/* eslint-env browser */
/* eslint-env mocha */
/* eslint no-console: 0 */
import { expect } from 'chai';
import { get, omit } from 'lodash';

import { VODescriptor } from '@picimo/core'; // eslint-disable-line

import { compile, Context } from '.';

describe('VertexObject', () => {
  before(() => console.groupCollapsed('VertexObject'));
  after(() => console.groupEnd());

  describe('compile()', () => {
    let ctx;

    before(() => {
      ctx = compile(`
        FOO = 42
        bar.plah = 23

        VertexObject myVertices {
          @vertexCount(4)

          position: uint32 {
            x [-FOO, FOO, 666, bar.plah ]
            y
          }
          rotate: uint16 @uniform 90.5
          foo @alias(rotate)
          bar(offset: 2, size: 8): uint8 @alias
        }

        Primitive TriQuads {
          @type(TRIANLGES)
          @generate

          stride 4
          offset 0

          indices [
            0, 1, 2,
            0, 2, 3,
          ]
        }

        SpriteGroup Sprites {
          @vertexObject(myVertices)
          @primitive(TriQuads)

          @vertexShader(VS)
          @fragmentShader(FS)

          @autotouch(off)
          @dynamic

          maxAllocVOSize 100

          textures {
            tex(nearest: no, repeatable: no) "foo.png"
            bar(flipY: yes) @atlas "plah.jpg"
          }

          myVertices {
            @doubleBuffer(off)
            @textured

            @setSize(fooBar)

            capacity 1000
          }
        }

      `);
      console.log('compile', ctx);
    });

    it('returns an instance of Context', () => {
      expect(ctx).to.be.an.instanceOf(Context);
    });

    it('"FOO" option', () => {
      expect(ctx.readOption('FOO')).to.equal(42);
    });

    it('"bar.plah" option', () => {
      expect(ctx.readOption('bar.plah')).to.equal(23);
    });

    it('"myVertices" declaration', () => {
      expect(get(ctx.declaration, 'myVertices.declarationType')).to.equal('vertexobject');
    });

    it('"myVertices.voDescriptor" section', () => {
      expect(get(ctx.declaration, 'myVertices.voDescriptor')).to.deep.equal({
        vertexCount: 4,
        attributes: [
          {
            name: 'position',
            type: 'uint32',
            scalars: [
              'x',
              'y',
            ],
            size: 2,
          },
          {
            name: 'rotate',
            type: 'uint16',
            uniform: true,
          },
        ],
        aliases: {
          foo: 'rotate',
          bar: {
            name: 'bar',
            size: 8,
            offset: 2,
            type: 'uint8',
          },
        },
      });
    });

    it('"myVertices.voNew" section', () => {
      expect(get(ctx.declaration, 'myVertices.voNew')).to.deep.equal({
        rotate: 90.5,
        x0: -42,
        x1: 42,
        x2: 666,
        x3: 23,
      });
    });

    it('"TriQuads" declaration', () => {
      expect(omit(get(ctx.declaration, 'TriQuads'), ['_parsedTree'])).to.deep.equal({
        declarationType: 'primitive',
        primitiveType: 'TRIANLGES',
        generate: true,
        stride: 4,
        offset: 0,
        indices: [
          0,
          1,
          2,
          0,
          2,
          3,
        ],
      });
    });

    it('"Sprites" declaration', () => {
      expect(omit(get(ctx.declaration, 'Sprites'), ['_parsedTree'])).to.deep.equal({
        voDescriptor: 'myVertices',
        vertexShader: 'VS',
        fragmentShader: 'FS',
        primitive: 'TriQuads',
        usage: 'dynamic',
        autotouch: false,
        maxAllocVOSize: 100,
        textureMap: {
          tex: {
            hints: {
              repeatable: false,
              nearest: false,
            },
            src: 'foo.png',
            type: 'texture',
          },
          bar: {
            hints: {
              flipY: true,
            },
            src: 'plah.jpg',
            type: 'atlas',
          },
        },
        myVertices: {
          doubleBuffer: false,
          textured: true,
          setSize: 'fooBar',
          capacity: 1000,
        },
        declarationType: 'spritegroup',
      });
    });
  });

  describe('create()', () => {
    let ctx;
    let vod;

    before(() => {
      ctx = compile(`

        VertexObject MyVertices {
          @vertexCount(3)
          @prototype(MyVerticesProto)

          position {
            x
            y
          }
          rotate: uint16 @uniform
        }

        VertexObject voBase {
          @vertexCount(4)

          position: float32 {
            x
            y
            z
          }
        }

        VertexObject vo instantiates voBase {
          translate {
            tx
            ty
            tz
          }
          color {
            r
            g
            b
            a
          }
        }

      `, {

        MyVerticesProto: {
          fooBar() {
            return this.x0 + 1234;
          },
        },
      });

      console.log('create', ctx);

      vod = ctx.create('MyVertices');
    });

    it('works', () => {
      expect(vod).to.be.an.instanceOf(VODescriptor);
      expect(vod.vertexCount).to.equal(3);
      expect(vod.hasAttribute('position', 2)).to.equal(true);
      expect(vod.hasAttribute('rotate', 1)).to.equal(true);
    });

    it('prototype from Context', () => {
      const vo = vod.createVO();
      expect(vo.fooBar).to.be.a('function');

      vo.x0 = 1000;
      expect(vo.fooBar()).to.equal(2234);
    });

    it('prototype from options (override Context)', () => {
      const vo = ctx.create('MyVertices', {
        fooBar() {
          return this.x0 + 2235;
        },
      }).createVO();
      expect(vo.fooBar).to.be.a('function');

      vo.x0 = 1000;
      expect(vo.fooBar()).to.equal(3235);
    });

    it('vo instantiates voBase', () => {
      const vo = ctx.create('vo');
      expect(vo, 'vo').to.be.an.instanceOf(VODescriptor);
      expect(vo.isInstanced, 'vo.isInstanced').to.be.true; // eslint-disable-line
      expect(vo.base, 'vo.base').to.be.an.instanceOf(VODescriptor);
      expect(vo.vertexCount, 'vo.vertexCount').to.equal(1);
      expect(vo.base.vertexCount, 'vo.base.vertexCount').to.equal(4);
    });
  });
});
