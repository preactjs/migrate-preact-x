const pragmaCodemod = require('./codemods/pragma-createElement');
const rewireImportsCodemod = require('./codemods/rewire-imports');
const combineCodemods = require('./util/combineCodemods');

module.exports = combineCodemods([pragmaCodemod, rewireImportsCodemod]);
