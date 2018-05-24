const { parse } = require('../src/picimoParser');

const res = parse(`
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

`);

console.log(JSON.stringify(res, null, 2)); // eslint-disable-line

/*
const res = parse(`
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

`);
*/