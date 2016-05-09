"use strict";

var parser = require('fcstats-parser');
var persistence = require('fcstats-persistence').lib;
var q = require('promised-io/promise');

module.exports = {
  import: function (dir, dbname) {
    return q.seq([
      () => {
        return parser.parseDirectory(dir)
      },
      (results) => {
        let db = persistence.newDatabase(dbname);
        let table = persistence.createTable(db, 'matches', {
          unique: ['matchId']
        });
        
        return q.seq([
          () => {
            return q.all(results.map((match) => {
              return persistence.insert(table, match);
            }));
          },
          (results) => {
            var deferred = q.defer();
            process.nextTick(() => {
              db.saveDatabase();
            });

            return deferred.promise;
          }
        ]);
      }
    ]);
  }
};
