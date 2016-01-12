'use strict';

var eslint = require('eslint');
var rule = require('../lib/provide-no-return-value');
var _ = require('lodash');

new eslint.RuleTester().run('lib/provide-no-return-value', rule, {
  valid: [
    'var x = function(err) { if (err) { return cb(err); } console.log("hello"); return cb(); }',
    'var x = function(err) { if (err) { return cb(err); } return cb(null, "yo"); }',
    'var x = function(err) { cb(); }'
  ],
  invalid: _.map([
    'var x = function(err) { if (err) { return cb(err); } return cb(); }',
    'var x = function(err) { if (err) { return cb(err); } cb(); }',
    'var x = function(err, ret) { if (err) { return cb(err); } cb(); }',
    'var x = function(err) { if (err) return cb(err); return cb(); }'
  ], function(code) {
    return {
      code: code,
      errors: [{
        message: 'Function of the form "function(err, x) { if (err) return cb(err); cb(); }" ' +
          'should be simplified to "langUtils.provide(cb)".'
      }]
    };
  })
});
