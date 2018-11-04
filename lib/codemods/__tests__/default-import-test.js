jest.autoMockOff();

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, 'default-import', null, 'default-import-default');
defineTest(__dirname, 'default-import', null, 'default-import-named');
defineTest(__dirname, 'default-import', null, 'default-import-mixed');
