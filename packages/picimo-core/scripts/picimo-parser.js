const { parse } = require('../src/picimoParser');

const res = parse(`

foo 34 + (99.5 - 9) * 2

bar 666
plah "lala"

@plah
@foo(bla)
@blub(true, "sdk jhsdkj hsdfkj")

`);

console.log(JSON.stringify(res, null, 2)); // eslint-disable-line
