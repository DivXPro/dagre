"use strict";

var _ = require("../lodash");

module.exports = forkOrder;

/*
 * Assigns an initial order value for each node by performing a DFS search
 * starting from nodes in the first rank. Nodes are assigned an order in their
 * rank as they are first visited.
 *
 * This approach comes from Gansner, et al., "A Technique for Drawing Directed
 * Graphs."
 *
 * Returns a layering matrix with an array per layer and each layer sorted by
 * the order of its nodes.
 */
function forkOrder(g, fork) {
  var visited = {};
  var simpleNodes = _.filter(g.nodes(), function (v) {
    return !g.children(v).length;
  });
  var maxRank = _.max(_.map(simpleNodes, function (v) { return g.node(v).rank; }));
  var layers = _.map(_.range(maxRank + 1), function () { return []; });
  for (var i = 0; i < maxRank; ++ i) {
    if (i === 0) {
      _.forEach(simpleNodes, function(v) {
        visited[v] = true;
        layers[i].push(v);
      });
    } else {
      _.forEach(layers[i-1], function(parent) {
        _.forEach(fork[parent].children, function(v) {
          if (!visited[v] && _.find(simpleNodes, function(node) {
            node === v;
          })) {
            visited[v] = true;
            layers[i].push(v);
          }
        });
        var unvisited = _.filter(simpleNodes, function(v) {
          return !visited[v];
        });
        _.forEach(unvisited, function(v) {
          visited[v] = true;
          layers[i].push(v);
        });
      });
    }
  }

  return layers;
}
