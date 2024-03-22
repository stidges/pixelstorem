const postcss = require('postcss');
const { equal } = require('node:assert');
const { test } = require('node:test');

const plugin = require('./');

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  equal(result.css, output)
  equal(result.warnings().length, 0)
}

test('it converts convert-rem to the right syntax', async () => {
    await run(`.foo { font-size: convert-rem(10); }`, `.foo { font-size: 0.625rem; }`);
});

test('it converts convert-em to the right syntax', async () => {
    await run(`.foo { font-size: convert-em(10); }`, `.foo { font-size: 0.625em; }`);
});

test('it ignores regular rem function calls', async () => {
    await run(`.foo { font-size: rem(10); }`, `.foo { font-size: rem(10); }`);
});

test('it ignores regular rems', async () => {
    await run(`.foo { font-size: 10rem; }`, `.foo { font-size: 10rem; }`);
});

test('it converts px to the right unit', async () => {
    await run(`.foo { font-size: 10px; }`, `.foo { font-size: 0.625rem; }`);
});

test('a base can be specified', async () => {
    await run(`.foo { font-size: 10px; }`, `.foo { font-size: 1rem; }`, { base: 10 });
});

test('css properties can be excluded', async () => {
    await run(`.foo { font-size: 10px; }`, `.foo { font-size: 10px; }`, { exclude: ['font-size'] });
});

