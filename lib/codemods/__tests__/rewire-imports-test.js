jest.autoMockOff();

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, 'rewire-imports', null, 'rewire-imports-default');
defineTest(__dirname, 'rewire-imports', null, 'rewire-imports-named');
