const main = require('../src/main');
const path = require('path');

describe('main', function () {
  describe('#import', function () {
    it('should import all CSVs from a directory to a DB file', function () {
      return main.import(path.join(process.cwd(), './test/1993-1994'), 'fcstats0_1.json').then((result) => {
        console.log(result)
      })
    })
  })
})
