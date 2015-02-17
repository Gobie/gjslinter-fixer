# gjslinter-fixer

Stream wrapper to fix source files according to output of [gjslinter](https://github.com/gobie/gjslinter) wrapper for [Google Closure Linter](https://developers.google.com/closure/utilities/).

Google Closure Linter has autofixer for Javascript files. This fixer is aimed to solve the problem for Coffeescript files.

## Getting Started
Install the module with:
```bash
npm install gjslinter-fixer
```

Execute the fixer
```javascript
var glob = require('glob-stream');
var gjslinter = require('gjslinter');
var gjslinterfixer = require('gjslinter-fixer');

glob.create('./build/**/*.js')
  .pipe(gjslinter({
    flags: ['--nojsdoc']
  }))
  .pipe(gjslinterfixer({map: [
      from: /^.+build\/(.+).js$/
      to: (_0, _1) -> "src/#{_1}.coffee"
    ]
  }));
```

## Supported fixes
* Missing require [142] - inserts missing require at the beginning of the file
* Missing provide [143] - inserts missing provide at the beginning of the file
* Unnecessary require [144] - removes unnecessary require from the file
* Unnecessary provide [145] - removes unnecessary provide from the file

