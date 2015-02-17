'use strict';

var fixer = require('./lib/fixer');
var merge = require('merge');
var through = require('through2');
var gutil = require('gulp-util');
var colors = gutil.colors;
var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gjslinter-fixer';

var gjslinterfixer = function(opts) {
  opts = merge({map: []}, opts);

  function transform(file, enc, cb) {

    if (file.gjslinter.success) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new PluginError(PLUGIN_NAME, 'Streaming is not supported'));
    }

    fixer(file, opts);

    return cb(null, file);
  };

  return through.obj(transform);
};

module.exports = gjslinterfixer;
