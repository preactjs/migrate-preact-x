const pragmaCodemod = require('./codemods/pragma-createElement');
const defaultImportCodemod = require('./codemods/default-import');
const combineCodemods = require('./util/combineCodemods');

module.exports = combineCodemods([pragmaCodemod, defaultImportCodemod]);
