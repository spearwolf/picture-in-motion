/* eslint-disable no-console */
/* eslint-env node */
const fs = require('fs');

const cjs = fs.readFileSync(process.argv[2], 'utf8');
const esm = cjs.replace(/module.exports = {[^}]+};\n/, `
const SyntaxError = peg$SyntaxError;
const parse = peg$parse;

export {
  SyntaxError,
  parse
};
`);

const outfile = process.argv[3];
if (outfile) {
  fs.writeFileSync(outfile, esm);
} else {
  console.log(esm);
}
