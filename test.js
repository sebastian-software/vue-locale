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
import intl_en from "intl/locale-data/json/en.json"
import intl_de from "intl/locale-data/json/de.json"
import intl_fr from "intl/locale-data/json/fr.json"
import intl_es from "intl/locale-data/json/es.json"

IntlPolyfill.__addLocaleData(intl_en)
IntlPolyfill.__addLocaleData(intl_de)
IntlPolyfill.__addLocaleData(intl_fr)
IntlPolyfill.__addLocaleData(intl_es)


// The formatting for relative dates uses custom data
import IntlRelativeFormat from "intl-relativeformat"

import relative_en from "./data/en.json"
import relative_de from "./data/de.json"
import relative_fr from "./data/fr.json"
import relative_es from "./data/es.json"

IntlRelativeFormat.__addLocaleData(relative_en)
IntlRelativeFormat.__addLocaleData(relative_de)
IntlRelativeFormat.__addLocaleData(relative_fr)
IntlRelativeFormat.__addLocaleData(relative_es)


function getFakeVue() {
  var fakeVue = function() {}

  fakeVue.filters = {}
  fakeVue.directives = {}

  fakeVue.filter = function(name, callback) {
    fakeVue.filters[name] = callback
  }

  fakeVue.directive = function(name, callback) {
    fakeVue.directives[name] = callback
  }

  return fakeVue
}

test("VueLocale Plugin is valid", t => {
  t.same(typeof VueLocale, "object")
  t.same(typeof VueLocale.install, "function")
})

test("Installation works", t => {
  var fakeVue = getFakeVue()

  VueLocale.install(fakeVue, {
    language: "de-DE",
    currency: "EUR",
    messages: {}
  })
})

test("Check Prototype Methods Exists", t => {
  var fakeVue = getFakeVue()

  VueLocale.install(fakeVue, {
    language: "de-DE",
    currency: "EUR",
    messages: {}
  })

  t.same(typeof fakeVue.prototype.$formatMessage, "function")
  t.same(typeof fakeVue.prototype.$formatDate, "function")
  t.same(typeof fakeVue.prototype.$formatTime, "function")
  t.same(typeof fakeVue.prototype.$formatNumber, "function")
  t.same(typeof fakeVue.prototype.$formatRelative, "function")
})
