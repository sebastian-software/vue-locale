/**
 * @license
 * VueLocale <https://www.sebastian-software.de/oss>
 * Copyright 2015-2016 Sebastian Software GmbH
 * Released under Apache 2.0 <http://www.apache.org/licenses/LICENSE-2.0>
 * Authors: Sebastian Werner <s.werner@sebastian-software.de>
 */

import test from "ava"
import "babel-register"

import VueLocale from "./src/VueLocale"

// Exports the later used global IntlPolyfill
import "intl"

// Import three common locales for testing
import locale_en from "intl/locale-data/json/en.json"
IntlPolyfill.__addLocaleData(locale_en)

import locale_de from "intl/locale-data/json/de.json"
IntlPolyfill.__addLocaleData(locale_de)

import locale_fr from "intl/locale-data/json/fr.json"
IntlPolyfill.__addLocaleData(locale_fr)


// The formatting for relative dates uses custom data
import IntlRelativeFormat from "intl-relativeformat"


/*
import locale_en_2 from "intl-relativeformat/dist/locale-data/en.js"
import locale_de_2 from "intl-relativeformat/dist/locale-data/de.js"
import locale_fr_2 from "intl-relativeformat/dist/locale-data/fr.js"
*/

test("VueLocale Plugin is valid", t => {
  t.same(typeof VueLocale, "object")
  t.same(typeof VueLocale.install, "function")
})

test("Simple Message", t => {
  t.same([ 1, 2 ], [ 1, 2 ])
})
