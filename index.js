"use strict";

const main = require('./src/main');
const q = require('promised-io/promise');
const util = require('util');
const path = require('path');
const fs = require('fs');

const relativeDataPath = '../../FootballData/football-data.co.uk/';
const countries = [
  'france',
  'germany',
  'spain',
  'italy',
  'greece',
  'netherlands',
  'portulgal',
  'turkey',
  'scotland',
  'belgium'
]
let years = [];
for (let i = 1995; i <= 2014; i++) {
  years.push(util.format('%s-%s', i, i + 1));
}

let promises = countries.map((country) => {
  const dirPath = path.join(process.cwd(), relativeDataPath + country + '/');
  return main.import(dirPath, 'fcstats0_3.json');
})

q.all(promises).then((results) => {
  console.log(results);
});
