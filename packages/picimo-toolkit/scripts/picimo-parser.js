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
