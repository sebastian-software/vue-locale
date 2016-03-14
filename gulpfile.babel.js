import gulp from "gulp"
import del from "del"
import fs from "fs"
import extractData from "formatjs-extract-cldr-data"
import stringify from "javascript-stringify"
import { map } from "lodash"

gulp.task("clean-data", function()
{
  return del([ "data" ])
})

gulp.task("build-data", ["clean-data"], function()
{
  let data = extractData(
  {
    pluralRules: true,
    relativeFields: true
  })

  fs.mkdirSync("data")

  return Promise.all(map(data, (value, locale) =>
  {
    return new Promise((resolve) =>
    {
      let stringified = stringify(value, null, "  ")
      let result = `"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=${stringified};`

      fs.writeFile("data/" + locale + ".js", result, function(err)
      {
        if (err) throw err
        resolve()
      })
    })
  }))
})
