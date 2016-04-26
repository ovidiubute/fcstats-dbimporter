"use strict";

var path = require('path');
var process = require('process');

function staticPath(countryCode, csvFilename) {
  return path.join(process.cwd(), '/node_modules/fcstats-staticdata/' + countryCode + '/' + csvFilename + '.csv');
}

// Init persistence layer
var persistence = require('fcstats-persistence');
persistence.createTables().then(function () {
  // Import data
  var main = require('./src/main');
  main.fromCsv([
    // English Premiership
    staticPath('en', 'en_E0_1993-1994'),

    // Bundesliga
    staticPath('de', 'de_D1_1993-1994'),

    // La Liga
    staticPath('es', 'es_SP1_1993-1994'),

    // Scotland Premiership
    staticPath('sc', 'sc_SC0_1994-1995'),

    // Turkish
    staticPath('tr', 'tr_T1_1994-1995')
  ]);
});

module.exports = require('./src/main');
