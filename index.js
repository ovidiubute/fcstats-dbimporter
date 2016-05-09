"use strict";

const main = require('./src/main');
const path = require('path');

const importPath = path.join(process.cwd(), '../../FootballData/football-data.co.uk/');

return main.import(importPath, 'fcstats0_5.json').then((result) => {
  console.log(result);
});
