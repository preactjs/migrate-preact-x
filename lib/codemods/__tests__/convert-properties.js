jest.autoMockOff();

const runTest = require('jscodeshift/dist/testUtils').runTest;
jest.mock('@babel/code-frame');
const codeFrame = require('@babel/code-frame');
codeFrame.codeFrameColumns = jest.fn(() => '');

describe('convert-properties', () => {
  it ('transforms correctly using "convert-properties-attributes" data', () => {
    runTest(__dirname, 'convert-properties', null, 'convert-properties-attributes');
    expect(codeFrame.codeFrameColumns).toHaveBeenCalledTimes(1);
  });

  it ('transforms correctly using "convert-properties-attributes" data', () => {
    codeFrame.codeFrameColumns.mockClear()
    runTest(__dirname, 'convert-properties', null, 'convert-properties-nodename');
    expect(codeFrame.codeFrameColumns).toHaveBeenCalledTimes(1);
  });
});
