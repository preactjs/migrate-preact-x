jest.autoMockOff();

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, 'pragma-createElement', null, 'pragma-createElement-h');
defineTest(__dirname, 'pragma-createElement', null, 'pragma-createElement-preact');
defineTest(__dirname, 'pragma-createElement', null, 'pragma-createElement-alias');
