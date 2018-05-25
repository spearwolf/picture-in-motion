/* eslint-env browser */
/* eslint-env mocha */
/* eslint no-console: 0 */
import { expect } from 'chai';

import { parse } from './picimoParser';

const itParse = (title, picimoDsl, expectedResult) => {
  it(title, () => {
    console.groupCollapsed(title);
    console.log(picimoDsl);
    const out = parse(picimoDsl);
    console.dir(out);
    console.log(JSON.stringify(out, null, 2));
    console.groupEnd();
    expect(out).to.deep.equal(expectedResult);
  });
};

describe('parse()', () => {
  itParse('substitute constants', `
    DX = 150
    DY = 666

    VertexObject myVertices {
      @foo(DX)
      bar -DY * 2

      position {
        x [-DX, DX, DX, -DX]
      }
    }
  `, [
    {
      type: 'declaration',
      declarationType: 'vertexobject',
      name: 'myVertices',
      data: [
        {
          type: 'propertyCall',
          name: 'foo',
          args: [
            150,
          ],
        },
        {
          type: 'data',
          name: 'bar',
          value: -1332,
        },
        {
          type: 'dataBlock',
          name: 'position',
          data: [
            {
              type: 'data',
              name: 'x',
              value: [
                -150, 150, 150, -150,
              ],
            },
          ],
        },
      ],
    },
  ]);

  itParse('thinktank', `
    DX = 150
    DY = 150

    VertexObject MyBaseQuad {
      @vertexCount(4)

      position: float32 {
        x [ -DX, DX, DX, -DX ]
        y [ DY, DY, -DY, -DY ]
        z
      }
    }

    VertexObject MyQuads instantiates MyBaseQuad {
      translate {
        tx
        ty
        tz
      }
      color: uint8 {
        r
        g
        b
        a
      }
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

    SpriteGroup MySprites {
      @vertexObject(MyQuads)
      @primitive(TriQuads)
      @dynamic

      MyBaseQuads {
        @textured

        capacity 100

        texture {
          tex "/foo.png"
        }
      }

      MyQuads {
        @doublebuffer
      }
    }
  `, [
    {
      type: 'declaration',
      data: [
        {
          type: 'propertyCall',
          name: 'vertexCount',
          args: [
            4,
          ],
        },
        {
          type: 'dataBlock',
          data: [
            {
              type: 'data',
              name: 'x',
              value: [
                -150,
                150,
                150,
                -150,
              ],
            },
            {
              type: 'data',
              name: 'y',
              value: [
                150,
                150,
                -150,
                -150,
              ],
            },
            {
              type: 'data',
              name: 'z',
            },
          ],
          dataType: 'float32',
          name: 'position',
        },
      ],
      name: 'MyBaseQuad',
      declarationType: 'vertexobject',
    },
    {
      type: 'declaration',
      data: [
        {
          type: 'dataBlock',
          data: [
            {
              type: 'data',
              name: 'tx',
            },
            {
              type: 'data',
              name: 'ty',
            },
            {
              type: 'data',
              name: 'tz',
            },
          ],
          name: 'translate',
        },
        {
          type: 'dataBlock',
          data: [
            {
              type: 'data',
              name: 'r',
            },
            {
              type: 'data',
              name: 'g',
            },
            {
              type: 'data',
              name: 'b',
            },
            {
              type: 'data',
              name: 'a',
            },
          ],
          dataType: 'uint8',
          name: 'color',
        },
      ],
      name: 'MyQuads',
      declarationType: 'vertexobject',
      verb: 'instantiates',
      subject: 'MyBaseQuad',
    },
    {
      type: 'declaration',
      data: [
        {
          type: 'propertyCall',
          name: 'type',
          args: [
            'TRIANLGES',
          ],
        },
        {
          type: 'propertyCall',
          name: 'generate',
        },
        {
          type: 'data',
          name: 'stride',
          value: 4,
        },
        {
          type: 'data',
          name: 'offset',
        },
        {
          type: 'data',
          name: 'indices',
          value: [
            0,
            1,
            2,
            0,
            2,
            3,
          ],
        },
      ],
      name: 'TriQuads',
      declarationType: 'primitive',
    },
    {
      type: 'declaration',
      data: [
        {
          type: 'propertyCall',
          name: 'vertexObject',
          args: [
            'MyQuads',
          ],
        },
        {
          type: 'propertyCall',
          name: 'primitive',
          args: [
            'TriQuads',
          ],
        },
        {
          type: 'propertyCall',
          name: 'dynamic',
        },
        {
          type: 'dataBlock',
          data: [
            {
              type: 'propertyCall',
              name: 'textured',
            },
            {
              type: 'data',
              name: 'capacity',
              value: 100,
            },
            {
              type: 'dataBlock',
              data: [
                {
                  type: 'data',
                  name: 'tex',
                  value: '/foo.png',
                },
              ],
              name: 'texture',
            },
          ],
          name: 'MyBaseQuads',
        },
        {
          type: 'dataBlock',
          data: [
            {
              type: 'propertyCall',
              name: 'doublebuffer',
            },
          ],
          name: 'MyQuads',
        },
      ],
      name: 'MySprites',
      declarationType: 'spritegroup',
    },
  ]);

  itParse('various syntax examples', `
    DX = 150
    DY = 120

    VertexObject myVertices {

        foo 34 + (99.5 - 9) * 2
        doubleDx DX * 3

        bar: uint16 666
        plah "lala"

    }

    VertexObject myQuads instantiates myVertices {

        x 12
        yy [
            1, 2,
            4, 8,
            16, 32
        ]
        z [[ 1, 2, 3 ], [ 4, 5, 6 ]]
        w 1
        c [ 10, 12, 999, 128736 ]
        a [ -DX, DX, DX, -DX ]
        r
        b: uint8

        translate {
            tx
            ty
            tz
        }

        position: float32 {
            x [ -DX, DX, DX, -DX ]
            y [ DY, DY, -DY, -DY ]
            z
        }

        @plah
        @foo(bla)
        @blub(true, "sdk jhsdkj hsdfkj", DY / 2.5)

    }
  `, [
    {
      type: 'declaration',
      data: [
        {
          type: 'data',
          name: 'foo',
          value: 215,
        },
        {
          type: 'data',
          name: 'doubleDx',
          value: 450,
        },
        {
          type: 'data',
          name: 'bar',
          value: 666,
          valueType: 'uint16',
        },
        {
          type: 'data',
          name: 'plah',
          value: 'lala',
        },
      ],
      name: 'myVertices',
      declarationType: 'vertexobject',
    },
    {
      type: 'declaration',
      data: [
        {
          type: 'data',
          name: 'x',
          value: 12,
        },
        {
          type: 'data',
          name: 'yy',
          value: [
            1,
            2,
            4,
            8,
            16,
            32,
          ],
        },
        {
          type: 'data',
          name: 'z',
          value: [
            [
              1,
              2,
              3,
            ],
            [
              4,
              5,
              6,
            ],
          ],
        },
        {
          type: 'data',
          name: 'w',
          value: 1,
        },
        {
          type: 'data',
          name: 'c',
          value: [
            10,
            12,
            999,
            128736,
          ],
        },
        {
          type: 'data',
          name: 'a',
          value: [
            -150,
            150,
            150,
            -150,
          ],
        },
        {
          type: 'data',
          name: 'r',
        },
        {
          type: 'data',
          name: 'b',
          valueType: 'uint8',
        },
        {
          type: 'dataBlock',
          data: [
            {
              type: 'data',
              name: 'tx',
            },
            {
              type: 'data',
              name: 'ty',
            },
            {
              type: 'data',
              name: 'tz',
            },
          ],
          name: 'translate',
        },
        {
          type: 'dataBlock',
          data: [
            {
              type: 'data',
              name: 'x',
              value: [
                -150,
                150,
                150,
                -150,
              ],
            },
            {
              type: 'data',
              name: 'y',
              value: [
                120,
                120,
                -120,
                -120,
              ],
            },
            {
              type: 'data',
              name: 'z',
            },
          ],
          dataType: 'float32',
          name: 'position',
        },
        {
          type: 'propertyCall',
          name: 'plah',
        },
        {
          type: 'propertyCall',
          name: 'foo',
          args: [
            'bla',
          ],
        },
        {
          type: 'propertyCall',
          name: 'blub',
          args: [
            true,
            'sdk jhsdkj hsdfkj',
            48,
          ],
        },
      ],
      name: 'myQuads',
      declarationType: 'vertexobject',
      verb: 'instantiates',
      subject: 'myVertices',
    },
  ]);

  itParse('boolean values', `
    VertexObject myVertices {
      @falsy(0, false, no, off)
      @falsy2(no, off, false)

      @truthy(1, true, yes, on)

      falsy [ 0, false, no, off ]
      truthy [ 1, true, yes, on ]
    }
  `, [
    {
      type: 'declaration',
      data: [
        {
          type: 'propertyCall',
          name: 'falsy',
          args: [
            0,
            false,
            false,
            false,
          ],
        },
        {
          type: 'propertyCall',
          name: 'falsy2',
          args: [
            false,
            false,
            false,
          ],
        },
        {
          type: 'propertyCall',
          name: 'truthy',
          args: [
            1,
            true,
            true,
            true,
          ],
        },
        {
          type: 'data',
          name: 'falsy',
          value: [
            0,
            false,
            false,
            false,
          ],
        },
        {
          type: 'data',
          name: 'truthy',
          value: [
            1,
            true,
            true,
            true,
          ],
        },
      ],
      name: 'myVertices',
      declarationType: 'vertexobject',
    },
  ]);

  itParse('empty source', '', []);

  itParse('data annotations', `
    X1 = 666

    VertexObject MyVertices {
      position: float32 @xyz {
        x @usage(dynamic) [ -X1, X1 ]
        z @foo
        x: uint8 255 @foo @bar(X1, yes) @plah
      }
    }
  `, [
    {
      type: 'declaration',
      data: [
        {
          type: 'dataBlock',
          data: [
            {
              type: 'data',
              name: 'x',
              value: [
                -666,
                666,
              ],
              annotations: [
                {
                  type: 'propertyCall',
                  name: 'usage',
                  args: [
                    'dynamic',
                  ],
                },
              ],
            },
            {
              type: 'data',
              name: 'z',
              annotations: [
                {
                  type: 'propertyCall',
                  name: 'foo',
                },
              ],
            },
            {
              type: 'data',
              name: 'x',
              value: 255,
              valueType: 'uint8',
              annotations: [
                {
                  type: 'propertyCall',
                  name: 'foo',
                },
                {
                  type: 'propertyCall',
                  name: 'bar',
                  args: [
                    666,
                    true,
                  ],
                },
                {
                  type: 'propertyCall',
                  name: 'plah',
                },
              ],
            },
          ],
          dataType: 'float32',
          annotations: [
            {
              type: 'propertyCall',
              name: 'xyz',
            },
          ],
          name: 'position',
        },
      ],
      name: 'MyVertices',
      declarationType: 'vertexobject',
    },
  ]);
});
