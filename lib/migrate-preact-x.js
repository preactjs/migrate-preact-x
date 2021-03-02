const pragmaCodemod = require('./codemods/pragma-createElement');
const defaultImportCodemod = require('./codemods/default-import');
const convertProperties = require('./codemods/convert-properties');
const styleStringtoObject = require('./codemods/style-string-to-object');
const combineCodemods = require('./util/combineCodemods');

module.exports = combineCodemods([pragmaCodemod, defaultImportCodemod, convertProperties, styleStringtoObject]);
