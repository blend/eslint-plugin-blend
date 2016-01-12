'use strict';

var eslint = require('eslint');
var rule = require('../lib/lodash-use-pick');

new eslint.RuleTester().run('lib/lodash-use-pick', rule, {
  valid: [
    'var z = { a: x.a, b: y.b };',
    'var z = { a: x.a, b: x.a };',
    'var z = { a: x.a };',
    'var z = {};'
  ],
  invalid: [{
    code: 'var z = { a: x.a, b: x.b }',
    errors: [{ message: 'Object expression can be rewritten as _.pick(x, [\'a\', \'b\'])' }]
  }, {
    code: 'var z = { a: x.a, b: x.b, c: x.c }',
    errors: [{ message: 'Object expression can be rewritten as _.pick(x, [\'a\', \'b\', \'c\'])' }]
  }]
});
