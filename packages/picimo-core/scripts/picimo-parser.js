const { parse } = require('../src/picimoParser');

const res = parse(`
DX = 150
DY = 120

foo 34 + (99.5 - 9) * 2
doubleDx DX * 3

bar: uint16 666
plah "lala"

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

@plah
@foo(bla)
@blub(true, "sdk jhsdkj hsdfkj", DY / 2.5)

`);

console.log(JSON.stringify(res, null, 2)); // eslint-disable-line
