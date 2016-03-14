/*
===========================================================================
    Copyright 2015-2016 Sebastian Software GmbH, Germany
    Licensed under Apache-2.0
===========================================================================
*/

import IntlMessageFormat from "intl-messageformat"
import IntlRelativeFormat from "intl-relativeformat"
import areLocalesSupported from "intl-locales-supported"

import createFormatCache from "intl-format-cache"

import { kebabCase, isPlainObject, isString, isNumber, isDate, each, clamp } from "lodash"

// Be sure to import the Polyfill
// TODO: Figure out if there is a ES2015 way to conditional load this
import "intl"

// NodeJS by default to not offer full ICU support and therefor break the unit tests
if (!areLocalesSupported([ "en", "de", "fr", "es" ]))
{
  /* global IntlPolyfill */
  Intl.NumberFormat = IntlPolyfill.NumberFormat
  Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
}

const formats = IntlMessageFormat.formats

const getCachedNumberFormat = createFormatCache(Intl.NumberFormat)
const getCachedDateTimeFormat = createFormatCache(Intl.DateTimeFormat)
const getCachedMessageFormat = createFormatCache(IntlMessageFormat)
const getCachedRelativeFormat = createFormatCache(IntlRelativeFormat)


function install(Vue, options)
{
  var { language, currency, messages } = options
  var locale = language

  function formatDate(date, format)
  {
    let parsedDate = new Date(date)
    if (!isDate(parsedDate))
      throw new TypeError("A date or timestamp must be provided to {{formatDate}}")

    if (isString(format) && format in formats.date)
      format = formats.date[format]

    return getCachedDateTimeFormat(locale, format).format(parsedDate)
  }

  function formatTime(date, format)
  {
    let parsedDate = new Date(date)
    if (!isDate(date))
      throw new TypeError("A date or timestamp must be provided to {{formatTime}}")

    if (isString(format) && format in formats.time)
      format = formats.time[format]

    return getCachedDateTimeFormat(locale, format).format(parsedDate)
  }

  function formatNumber(num, format)
  {
    if (!isNumber(num))
      throw new TypeError("A number must be provided to {{formatNumber}}")

    if (isString(format))
    {
      if (format === "currency")
        format = { style: "currency", currency: currency }
      else if (format in formats.number)
        format = formats.number[format]
    }

    return getCachedNumberFormat(locale, format).format(num)
  }

  // Figuring out whether the separator is either "," or "." (Are there any other possibilities at all?)
  var decimalTestNumber = 3.1
  var decimalSeparator = formatNumber(decimalTestNumber).charAt(1)

  function extractNumberParts(value)
  {
    var parsed = parseInt(value.replace(/[^0-9]/g, ""), 0)
    return isNaN(parsed) ? 0 : parsed
  }

  function parseToNumber(value)
  {
    if (value == null || value === "")
      return 0

    var splits = value.split(decimalSeparator).map(extractNumberParts)

    // Build up float number to let parseFloat convert it back into a number
    if (splits[1] > 0)
      return parseFloat(splits[0] + "." + splits[1])

    // Return plain integer
    return splits[0]
  }

  function formatRelative(date, format, now)
  {
    let parsedDate = new Date(date)
    if (!isDate(parsedDate))
      throw new TypeError("A date or timestamp must be provided to {{formatRelative}}")

    return getCachedRelativeFormat(locale, format).format(parsedDate, {
      now: now || new Date()
    })
  }

  function formatMessage(message, ...formatOptions)
  {
    // Read real message from DB
    if (message in messages)
      message = messages[message]

    if (typeof message === "string")
      message = getCachedMessageFormat(message, locale, {})

    // If there is a single map parameter, use that instead of the formatOptions array
    if (formatOptions.length === 1 && isPlainObject(formatOptions[0]))
      formatOptions = formatOptions[0]

    return message.format(formatOptions)
  }



  var helpers = { formatDate, formatTime, formatRelative, formatNumber, formatMessage }

  each(helpers, function(helper, name)
  {
    // Adding features as a VueJS filter for easily pass a string over (only numberic parameters though)
    Vue.filter(kebabCase(name), helper)

    // Support alternative full blown calling of methods with real options object
    Vue.prototype["$" + name] = helper
  })

  Vue.directive("i18n", function(id)
  {
    /* eslint no-invalid-this: 0 */
    if (id == null || isNaN(id))
      id = this.expression

    this.el.innerHTML = formatMessage(id)
  })

  // Via: http://jsfiddle.net/6jjuoypf/2/
  Vue.filter("format-currency",
  {
    // model -> view: formats the value when updating the input element.
    read: function(val)
    {
      var numberOptions =
      {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }

      return formatNumber(val == null || val === "" ? 0 : val, numberOptions)
    },

    // view -> model: formats the value when writing to the data.
    write: function(val) {
      return parseToNumber(val)
    }
  })

  Vue.filter("format-currency-precise",
  {
    // model -> view: formats the value when updating the input element.
    read: function(val) {
      return formatNumber(val == null || val === "" ? 0 : val, "currency")
    },

    // view -> model: formats the value when writing to the data.
    write: function(val) {
      return parseToNumber(val)
    }
  })

  Vue.filter("format-percent",
  {
    // model -> view: formats the value when updating the input element.
    read: function(val, fractionDigits)
    {
      return formatNumber(val == null || val === "" ? 0 : clamp(val / 100, 0, 1), {
        style: "percent",
        minimumFractionDigits: fractionDigits == null ? 0 : fractionDigits
      })
    },

    // view -> model: formats the value when writing to the data.
    write: function(val) {
      return parseToNumber(val)
    }
  })

  Vue.filter("format-number",
  {
    // model -> view: formats the value when updating the input element.
    read: function(val, fractionDigits)
    {
      return val == null || val === "" ? 0 : formatNumber(val,
      {
        minimumFractionDigits: fractionDigits == null ? 0 : fractionDigits,
        maximumFractionDigits: fractionDigits == null ? Infinity : fractionDigits
      })
    },

    // view -> model: formats the value when writing to the data.
    write: function(val) {
      return parseToNumber(val)
    }
  })
}

var plugin = {
  install
}

export default plugin
