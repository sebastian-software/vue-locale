import gulp from "gulp"
import del from "del"
import extractData from "formatjs-extract-cldr-data"
import jsonfile from "jsonfile"
import { map } from "lodash"

gulp.task("clean-data", function()
{
  return del([ "data/*" ])
})

gulp.task("build-data", function()
{
  let data = extractData(
  {
    pluralRules: true,
    relativeFields: true
  })

  jsonfile.spaces = 0

  return Promise.all(map(data, (value, locale) =>
  {
    return new Promise((resolve) =>
    {
      jsonfile.writeFile("data/" + locale + ".json", value, resolve)
    })
  }))
})
