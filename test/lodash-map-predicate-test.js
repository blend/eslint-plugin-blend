'use strict';

var eslint = require('eslint');
var rule = require('../lib/lodash-map-predicate');

new eslint.RuleTester().run('lib/lodash-map-predicate', rule, {
  valid: [
    '_.map([], "x")',
    '_.notMap([], function(x) { return x.y; })',
    '_.map([], function(x) { return z.y; })',
    '_.map([], function(x) { return z; })',
    '_.map([], function(x) { return x.y.a; })',
    '_.map([], function(x) { return {a: 1}.y.a; })'
  ],
  invalid: [{
    code: '_.map([], function(x) { return x.y; })',
    errors: [{ message: 'Lodash call can be rewritten as: _.map([], \'y\')' }]
  }]
});
