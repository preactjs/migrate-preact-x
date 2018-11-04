const path = require('path');
const fs = require('fs');
const { execFile  } = require('child_process');
const fixturesDir = path.resolve(`${__dirname}/../__testfixtures__`);

describe('cli', () => {
  let testFile = path.join(fixturesDir, 'cli.tmp.js');
  beforeEach(() => {
    const fixtureContent = fs.readFileSync(path.join(fixturesDir, 'cli.input.js'), 'utf8');
    fs.writeFileSync(testFile, fixtureContent);
  });

  afterEach(() => {
    fs.unlinkSync(testFile);
  });

  it('transforms a file correctly', done => {
    execFile('node', [path.resolve(`${__dirname}/../cli.js`), testFile], (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        expect(true).toBe(false);
        done();
      }

      const result = fs.readFileSync(testFile, 'utf8');
      const expected = fs.readFileSync(path.join(fixturesDir, 'cli.output.js'), 'utf8');

      expect(result.trim()).toEqual(expected.trim());
      done();
    });
  });
});
