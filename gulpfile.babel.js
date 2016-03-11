"use strict";

import gulp from "gulp";
import del from "del";
import extractData from 'formatjs-extract-cldr-data';
import jsonfile from "jsonfile";
import { map } from "lodash";

gulp.task("build-data", function(done) {

  var data = extractData({
    pluralRules: true,
    relativeFields: true
  });

  jsonfile.spaces = 0;

  return Promise.all(map(data, function(value, locale) {
    return new Promise(function(resolve, reject) {
      jsonfile.writeFile("data/" + locale + ".json", value, resolve);
    });
  }));
});
