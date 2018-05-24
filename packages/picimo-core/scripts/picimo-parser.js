const { parse } = require('../src/picimoParser');

const res = parse(`
DX = 150
DY = 120

foo 34 + (99.5 - 9) * 2
doubleDx DX * 3

bar: uint16 666
plah "lala"

@plah
@foo(bla)
@blub(true, "sdk jhsdkj hsdfkj", DY / 2.5)

`);

console.log(JSON.stringify(res, null, 2)); // eslint-disable-line
