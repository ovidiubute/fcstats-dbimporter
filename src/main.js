"use strict";

var parser = require('fcstats-parser');
var transformer = require('fcstats-transformer');
var adapter = require('fcstats-vogels-adapter');
var MatchEntity = require('fcstats-persistence').models.match;
var SeasonModel = require('fcstats-models').SeasonModel;

module.exports = {
  fromCsv: function (fileNames) {
    if (Object.prototype.toString.call(fileNames) !== '[object Array]') {
      fileNames = [fileNames];
    }

    fileNames.forEach(function (fileName) {
      console.log("Parsing " + fileName + "...");
      parser.fromFile(fileName).then(function (result) {
        // Season must be set for all matches, parse it from file name
        var seasonYears = parser.extractSeasonYears(fileName);
        var leagueName = parser.extractLeagueName(fileName);
        var seasonModel = new SeasonModel({yearStart: seasonYears[0], yearEnd: seasonYears[1], leagueName: leagueName});

        var matchAttrsList = result.map(function (matchArray) {
          var model = transformer.match.fromArray(matchArray, seasonModel);
          return adapter.convertFromModel(model);
        });

        console.log("Adding DB items...");

        // All of this because of DynamoDB provisioned throughput...
        var chunkedMatchAttrs = [];
        var size = 30;
        for (var i = 0; i < matchAttrsList.length; i += size) {
          chunkedMatchAttrs.push(matchAttrsList.slice(i, size + i));
        }

        chunkedMatchAttrs.forEach(function (chunk) {
          setTimeout(function () {
            chunk.forEach(function (matchPlainModel) {
              MatchEntity.create(matchPlainModel, {overwrite: false}, function (err, match) {
                if (err) {
                  console.log("Could not create DB match: " + err);
                } else {
                  console.log("Created DB match: " + JSON.stringify(match));
                }
              });
            });
          }, 60000);
        });
      }, function (err) {
        console.log(err);
        throw new Error('Could not parse, ending everything right now: ' + err);
      });
    });
  }
};
