"use strict";

var parser = require('fcstats-parser');
var persistence = require('fcstats-persistence');
var q = require('promised-io/promise');

module.exports = {
  import: function (dir, dbname) {
    return q.seq([
      () => {
        return parser.parseDirectory(dir)
      },
      (results) => {
        return q.seq([
          () => {
            return persistence.createDatabase(dbname);
          },
          (db) => {
            return q.seq([
              () => {
                return persistence.createTable(db, 'matches', {
                  unique: ['matchId']
                });
              },
              (table) => {
                return q.all(results.map((result) => {
                  return result.matches.map((match) => {
                    return persistence.insert(table, match);
                  });
                }));
              },
              (results) => {
                var deferred = q.defer();

                process.nextTick(() => {
                  db.saveDatabase();
                  const matchCount = results.map((matches) => {
                    return matches.length;
                  }).reduce((prev, cur) => {
                    return prev + cur;
                  }, 0);
                  deferred.resolve("Imported " + matchCount + " matches in the DB.");
                });

                return deferred.promise;
              }
            ]);
          }
        ])
      }
    ]);
  }
};
