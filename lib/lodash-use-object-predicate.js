'use strict';

var _ = require('lodash');
var util = require('util');

/**
 * Detects expressions of the form
 *   _.find(arr, function(x) { return x.y === z })
 * and suggests replacement with
 *   _.find(arr, { y: z })
 */
module.exports = function(context) {
  var VALID_FUNCTIONS = [
    'all',
    'any',
    'detect',
    'every',
    'filter',
    'find',
    'findLast',
    'partition',
    'reject',
    'remove',
    'some',
    'where'
  ];

  return {
    CallExpression: function(node) {
      if (node.arguments.length < 2 ||
          node.callee.type !== 'MemberExpression' ||
          node.callee.object.type !== 'Identifier' ||
          node.callee.object.name !== '_') {
        return;
      }

      var lodashFnName = node.callee.property.name;
      if (!_.contains(VALID_FUNCTIONS, lodashFnName)) return;

      var arrayArg = node.arguments[0];
      var fnArg = node.arguments[1];
      if (fnArg.type !== 'FunctionExpression' || fnArg.params.length > 1) return;

      var paramName = fnArg.params[0].name;

      if (fnArg.body.type !== 'BlockStatement' || fnArg.body.body.length !== 1) return;

      var stmt = fnArg.body.body[0];
      if (stmt.type !== 'ReturnStatement' || stmt.argument.type !== 'BinaryExpression') return;

      var binExp = stmt.argument;
      if (binExp.operator !== '===' ||
          binExp.left.type !== 'MemberExpression' ||
          binExp.left.object.name !== paramName) {
        return;
      }

      context.report(
        node,
        util.format(
          'Lodash call can be rewritten to: _.%s(%s, { %s: %s })',
          lodashFnName,
          context.getSource(arrayArg),
          binExp.left.property.name,
          context.getSource(binExp.right)
        )
      );
    }
  };
};
