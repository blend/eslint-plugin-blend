'use strict';

var util = require('util');

/**
 * Detects expressions of the form
 *   _.map(arr, function(x) { return x.y; })
 * and suggests replacement with
 *   _.map(arr, 'y')
 */
module.exports = function(context) {
  return {
    CallExpression: function(node) {
      if (node.arguments.length < 2 ||
          node.callee.type !== 'MemberExpression' ||
          node.callee.object.type !== 'Identifier' ||
          node.callee.object.name !== '_' ||
          node.callee.property.name !== 'map') {
        return;
      }

      var arrayArg = node.arguments[0];
      var fnArg = node.arguments[1];
      if (fnArg.type !== 'FunctionExpression' || fnArg.params.length > 1) return;

      var paramName = fnArg.params[0].name;

      if (fnArg.body.type !== 'BlockStatement' || fnArg.body.body.length !== 1) return;

      var stmt = fnArg.body.body[0];
      if (stmt.type !== 'ReturnStatement' || stmt.argument.type !== 'MemberExpression') return;

      var memberExp = stmt.argument;
      if (memberExp.object.type !== 'Identifier' ||
          memberExp.object.name !== paramName) {
        return;
      }

      var memberProp = memberExp.property.name;
      context.report(
        node,
        util.format(
          'Lodash call can be rewritten as: _.map(%s, \'%s\')',
          context.getSource(arrayArg),
          memberProp
        )
      );
    }
  };
};
