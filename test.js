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

/* eslint camelcase: 0 */
/* eslint no-magic-numbers: 0 */

/* global IntlPolyfill */

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

import relative_en from "./data/en.js"
import relative_de from "./data/de.js"
import relative_fr from "./data/fr.js"
import relative_es from "./data/es.js"

IntlRelativeFormat.__addLocaleData(relative_en)
IntlRelativeFormat.__addLocaleData(relative_de)
IntlRelativeFormat.__addLocaleData(relative_fr)
IntlRelativeFormat.__addLocaleData(relative_es)


function getFakeVue() {
  function FakeVue() {
    // nothing to do
  }

  FakeVue.filters = {}
  FakeVue.directives = {}
  FakeVue.components = {}

  FakeVue.filter = function(name, callback) {
    FakeVue.filters[name] = callback
  }

  FakeVue.directive = function(name, callback) {
    FakeVue.directives[name] = callback
  }

  FakeVue.component = function(name, config) {
    FakeVue.components[name] = config
  }

  return FakeVue
}

test("VueLocale Plugin is valid", (api) => {
  api.same(typeof VueLocale, "object")
  api.same(typeof VueLocale.install, "function")
})

test("Installation works", (api) => {
  var FakeVue = getFakeVue()

  api.notThrows(() => {
    VueLocale.install(FakeVue, {
      language: "de-DE",
      currency: "EUR",
      messages: {}
    })
  })
})

test("Check Prototype Methods Exists", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "de-DE",
    currency: "EUR",
    messages: {}
  })

  api.same(typeof FakeVue.prototype.$formatMessage, "function")
  api.same(typeof FakeVue.prototype.$formatDate, "function")
  api.same(typeof FakeVue.prototype.$formatTime, "function")
  api.same(typeof FakeVue.prototype.$formatNumber, "function")
  api.same(typeof FakeVue.prototype.$formatRelative, "function")
})

test("Instance works", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "de-DE",
    currency: "EUR",
    messages: {}
  })

  api.notThrows(() => {
    var vue = new FakeVue()
    api.ok(vue instanceof FakeVue)
  })
})

test("Translation Singular", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "de-DE",
    currency: "EUR",
    messages: {
      "hello-singular": "Hallo"
    }
  })

  var vue = new FakeVue()
  api.same(vue.$formatMessage("hello-singular"), "Hallo")
})

test("Translation Placeholder", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "de-DE",
    currency: "EUR",
    messages: {
      "hello-name": "Hallo {name}!"
    }
  })

  var vue = new FakeVue()
  api.same(vue.$formatMessage("hello-name", { name: "Frank-Rüdiger" }), "Hallo Frank-Rüdiger!")
})

test("Translation Placeholder with Markup", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "de-DE",
    currency: "EUR",
    messages: {
      "hello-name": "Hallo <strong>{name}</strong>!"
    }
  })

  var vue = new FakeVue()
  api.same(vue.$formatMessage("hello-name", { name: "Frank-Rüdiger" }), "Hallo <strong>Frank-Rüdiger</strong>!")
})

test("Translation Plural", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "de-DE",
    currency: "EUR",
    messages: {
      "photo-info": "You have {num, plural, =0 {no photos.} =1 {one photo.} other {# photos.}}"
    }
  })

  var vue = new FakeVue()
  api.same(vue.$formatMessage("photo-info", { num: 0 }), "You have no photos.")
  api.same(vue.$formatMessage("photo-info", { num: 1 }), "You have one photo.")
  api.same(vue.$formatMessage("photo-info", { num: 2 }), "You have 2 photos.")
})

test("Format Number - EN", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "en",
    currency: "EUR",
    messages: {}
  })

  var vue = new FakeVue()
  api.same(vue.$formatNumber(3.14159), "3.142")
  api.same(vue.$formatNumber(10000000), "10,000,000")
})

test("Format Number - ES", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "es",
    currency: "EUR",
    messages: {}
  })

  var vue = new FakeVue()
  api.same(vue.$formatNumber(3.14159), "3,142")
  api.same(vue.$formatNumber(10000000), "10.000.000")
})

test("Format Number - FR", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "fr",
    currency: "EUR",
    messages: {}
  })

  var vue = new FakeVue()
  api.same(vue.$formatNumber(3.14159), "3,142")
  api.same(vue.$formatNumber(10000000), "10 000 000")
})

test("Format Number - DE", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "de",
    currency: "EUR",
    messages: {}
  })

  var vue = new FakeVue()
  api.same(vue.$formatNumber(3.14159), "3,142")
  api.same(vue.$formatNumber(10000000), "10.000.000")
})




test("Format Currency - EN", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "en",
    currency: "USD",
    messages: {}
  })

  var vue = new FakeVue()
  api.same(vue.$formatNumber(7.98, "currency"), "$7.98")
  api.same(vue.$formatNumber(1234.5, "currency"), "$1,234.50")
})

test("Format Currency - ES", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "es",
    currency: "EUR",
    messages: {}
  })

  var vue = new FakeVue()
  api.same(vue.$formatNumber(7.98, "currency"), "7,98 €")
  api.same(vue.$formatNumber(1234.5, "currency"), "1.234,50 €")
})

test("Format Currency - FR", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "fr",
    currency: "EUR",
    messages: {}
  })

  var vue = new FakeVue()
  api.same(vue.$formatNumber(7.98, "currency"), "7,98 €")
  api.same(vue.$formatNumber(1234.5, "currency"), "1 234,50 €")
})

test("Format Currency - DE", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "de",
    currency: "EUR",
    messages: {}
  })

  var vue = new FakeVue()
  api.same(vue.$formatNumber(7.98, "currency"), "7,98 €")
  api.same(vue.$formatNumber(1234.5, "currency"), "1.234,50 €")
})




test("Format Date Medium - EN", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "en",
    currency: "EUR",
    messages: {}
  })

  var testDate = new Date(2012, 8, 12);

  var vue = new FakeVue()
  api.same(vue.$formatDate(testDate, "medium"), "Sep 12, 2012")
})

test("Format Date Medium - ES", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "es",
    currency: "EUR",
    messages: {}
  })

  var testDate = new Date(2012, 8, 12);

  var vue = new FakeVue()
  api.same(vue.$formatDate(testDate, "medium"), "12 sept. 2012")
})

test("Format Date Medium - FR", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "fr",
    currency: "EUR",
    messages: {}
  })

  var testDate = new Date(2012, 8, 12);

  var vue = new FakeVue()
  api.same(vue.$formatDate(testDate, "medium"), "12 sept. 2012")
})

test("Format Date Medium - DE", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "de",
    currency: "EUR",
    messages: {}
  })

  var testDate = new Date(2012, 8, 12);

  var vue = new FakeVue()
  api.same(vue.$formatDate(testDate, "medium"), "12. Sep. 2012")
})






test("Format Time Medium - EN", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "en",
    currency: "EUR",
    messages: {}
  })

  var testDate = new Date(2012, 8, 12, 14, 22, 38);

  var vue = new FakeVue()
  api.same(vue.$formatTime(testDate, "medium"), "2:22:38 PM")
})

test("Format Time Medium - ES", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "es",
    currency: "EUR",
    messages: {}
  })

  var testDate = new Date(2012, 8, 12, 14, 22, 38);

  var vue = new FakeVue()
  api.same(vue.$formatTime(testDate, "medium"), "14:22:38")
})

test("Format Time Medium - FR", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "fr",
    currency: "EUR",
    messages: {}
  })

  var testDate = new Date(2012, 8, 12, 14, 22, 38);

  var vue = new FakeVue()
  api.same(vue.$formatTime(testDate, "medium"), "14:22:38")
})

test("Format Time Medium - DE", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "de",
    currency: "EUR",
    messages: {}
  })

  var testDate = new Date(2012, 8, 12, 14, 22, 38);


  var vue = new FakeVue()
  api.same(vue.$formatTime(testDate, "medium"), "14:22:38")
})






test("Format Relative Minutes - EN", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "en",
    currency: "EUR",
    messages: {}
  })

  var minutes = 27;
  var now = new Date();
  var testDate = now - (1000 * 60 * minutes);

  var vue = new FakeVue()
  api.same(vue.$formatRelative(testDate, "medium", now), "27 minutes ago")
})

test("Format Relative Minutes - ES", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "es",
    currency: "EUR",
    messages: {}
  })

  var minutes = 27;
  var now = new Date();
  var testDate = now - (1000 * 60 * minutes);

  var vue = new FakeVue()
  api.same(vue.$formatRelative(testDate, "medium"), "hace 27 minutos")
})

test("Format Relative Minutes - FR", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "fr",
    currency: "EUR",
    messages: {}
  })

  var minutes = 27;
  var now = new Date();
  var testDate = now - (1000 * 60 * minutes);

  var vue = new FakeVue()
  api.same(vue.$formatRelative(testDate, "medium"), "il y a 27 minutes")
})

test("Format Relative Minutes - DE", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "de",
    currency: "EUR",
    messages: {}
  })

  var minutes = 27;
  var now = new Date();
  var testDate = now - (1000 * 60 * minutes);

  var vue = new FakeVue()
  api.same(vue.$formatRelative(testDate, "medium"), "vor 27 Minuten")
})





test("Format Relative Dates - EN", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "en",
    currency: "EUR",
    messages: {}
  })

  var minutes = 27;
  var now = new Date();
  var testDate = now - (1000 * 60 * 60 * 24 * 2.5);

  var vue = new FakeVue()
  api.same(vue.$formatRelative(testDate, "medium", now), "2 days ago")
})

test("Format Relative Dates - ES", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "es",
    currency: "EUR",
    messages: {}
  })

  var minutes = 27;
  var now = new Date();
  var testDate = now - (1000 * 60 * 60 * 24 * 2.5);

  var vue = new FakeVue()
  api.same(vue.$formatRelative(testDate, "medium"), "anteayer")
})

test("Format Relative Dates - FR", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "fr",
    currency: "EUR",
    messages: {}
  })

  var minutes = 27;
  var now = new Date();
  var testDate = now - (1000 * 60 * 60 * 24 * 2.5);

  var vue = new FakeVue()
  api.same(vue.$formatRelative(testDate, "medium"), "avant-hier")
})

test("Format Relative Dates - DE", (api) => {
  var FakeVue = getFakeVue()

  VueLocale.install(FakeVue, {
    language: "de",
    currency: "EUR",
    messages: {}
  })

  var minutes = 27;
  var now = new Date();
  var testDate = now - (1000 * 60 * 60 * 24 * 2.5);

  var vue = new FakeVue()
  api.same(vue.$formatRelative(testDate, "medium"), "vorgestern")
})
