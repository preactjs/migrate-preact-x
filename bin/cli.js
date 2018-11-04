#!/usr/bin/env node
const path = require('path');
const JscodeshiftRunner = require('jscodeshift/dist/Runner');

JscodeshiftRunner.run(
  path.resolve(__dirname + '/../lib/migrate-preact-x.js'),
  process.argv.slice(2),
  {
    runInBand: true,
  }
);
