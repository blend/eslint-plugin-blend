'use strict';

var _ = require('lodash');

/**
 * Detects expressions of the form "_.partial(f)" and "_.map(f)".
 */
module.exports = function(context) {
  return {
    CallExpression: function(node) {
      var fnIsLodashMultiArgumentCall = node.callee.type === 'MemberExpression' &&
            node.callee.object.type === 'Identifier' &&
            node.callee.object.name === '_' &&
            _.includes(['map', 'partial'], node.callee.property.name);

      if (fnIsLodashMultiArgumentCall && node.arguments.length < 2) {
        context.report(node, '_.partial and _.map must be called with at least 2 arguments.');
      }
    }
  };
};
