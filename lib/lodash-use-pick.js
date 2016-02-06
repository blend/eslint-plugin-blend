'use strict';

var _ = require('lodash');
var util = require('util');

/**
 * Detects expressions like
 *   { a: x.a, b: x.b, c: x.c }
 * that can be simplified to
 *   _.pick(x, ['a', 'b', 'c'])
 */
module.exports = function(context) {
  return {
    ObjectExpression: function(node) {
      if (node.properties.length < 2 ||
          !_.every(node.properties, { type: 'Property' })) {
        return;
      }

      var firstProp = node.properties[0];
      if (firstProp.value.type !== 'MemberExpression') return;

      var first = node.properties[0].value.object.name;

      if (!_.every(node.properties, function(prop) {
        return prop.value.type === 'MemberExpression' &&
          prop.value.object.type === 'Identifier' &&
          prop.value.object.name === first &&
          prop.value.property.name === prop.key.name;
      })) {
        return;
      }

      var keyNames = _.map(node.properties, function(prop) {
        return '\'' + prop.value.property.name + '\'';
      }).join(', ');

      context.report(
        node,
        util.format('Object expression can be rewritten as _.pick(%s, [%s])', first, keyNames)
      );
    }
  };
};
