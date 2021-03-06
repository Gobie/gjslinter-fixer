'use strict';

var fs = require('fs');

var unnecessaryRequireRegexp = /Unnecessary\sgoog\.require:\s+(.+)/
var unnecessaryProvideRegexp = /Unnecessary\sgoog\.provide:\s+(.+)/
var missingRequireRegexp = /goog\.require\('([^']+)'\);/g
var missingProvideRegexp = /goog\.provide\('([^']+)'\);/g

var mapPath = function(path, map) {
  for (var i = 0, len = map.length; i < len; ++i) {
    var replacement = map[i];
    if (!replacement.from || !replacement.to) {
      continue;
    }
    path = path.replace(replacement.from, replacement.to);
  }
  return path;
}

var actionCreatorsMap = {
  142: function(desc) {
    var actions = [];
    desc.replace(missingRequireRegexp, function(_0, _1) {
      actions.push(createPrependAction("goog.require '" + _1 + "'\n"));
    });
    return actions;
  },
  143: function(desc) {
    var actions = [];
    desc.replace(missingProvideRegexp, function(_0, _1) {
      actions.push(createPrependAction("goog.provide '" + _1 + "'\n"));
    });
    return actions;
  },
  144: function(desc) {
    var match = desc.match(unnecessaryRequireRegexp);
    return createRemoveAction("goog\.require ['\"]" + match[1] + "['\"]\n");
  },
  145: function(desc) {
    var match = desc.match(unnecessaryProvideRegexp);
    return createRemoveAction("goog\.provide ['\"]" + match[1] + "['\"]\n");
  },
}

var createRemoveAction = function(string) {
  var regexp = new RegExp(string, 'g');
  return function(content) {
    return content.replace(regexp, '');
  }
}

var createPrependAction = function(string) {
  return function(content) {
    return string + content;
  }
}

var createActions = function(errors) {
  var actions = [];
  for (var i = 0, len = errors.length; i < len; ++i) {
    var error = errors[i];
    var actionCreator = actionCreatorsMap[error.code];
    if (typeof actionCreator === 'function') {
      actions = actions.concat(actionCreator(error.description));
    }
  }
  return actions;
}

var applyActions = function(content, actions) {
  for (var i = 0, len = actions.length; i < len; ++i) {
    content = actions[i](content);
  }
  return content;
}

module.exports = function(file, opts) {
  var path = mapPath(file.path, opts.map);
  var actions = createActions(file.gjslinter.results.errors);
  var content = fs.readFileSync(path, {encoding: 'utf-8'});
  content = applyActions(content, actions);
  fs.writeFileSync(path, content, {encoding: 'utf-8'});
  return path;
};
