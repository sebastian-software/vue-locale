<img src="assets/vuejs.png" alt="VueJS Logo" width="200" height="200"/>

# VueJS Locale<br/>[![Sponsored by][sponsor-img]][sponsor] [![Downloads][npm-version-img][npm] [![Downloads][npm-downloads-img]][npm] [![Build Status][ci-img]][ci] [![Dependencies][deps-img]][deps]

[VueJS] Plugin for advanced localization of web applications.

[sponsor-img]: https://img.shields.io/badge/Sponsored%20by-Sebastian%20Software-692446.svg
[sponsor]: https://www.sebastian-software.de
[VueJS]: https://github.com/vuejs/vue
[ci-img]:  https://travis-ci.org/sebastian-software/vue-locale.svg
[ci]:      https://travis-ci.org/sebastian-software/vue-locale
[deps]: https://david-dm.org/sebastian-software/vue-locale
[deps-img]: https://david-dm.org/sebastian-software/vue-locale.svg
[npm]: https://www.npmjs.com/package/vue-locale
[npm-downloads-img]: https://img.shields.io/npm/dm/vue-locale.svg
[npm-version-img]: https://img.shields.io/npm/v/vue-locale.svg



## Links

- [GitHub](https://github.com/sebastian-software/vue-locale)
- [NPM](https://www.npmjs.com/package/vue-locale)


## Installation

Should be installed locally in your project source code:

Installation via JSPM:

```bash
jspm install npm:vue-locale
```

Alternatively you can also use plain old NPM:

```bash
npm install vue-locale --save
```

## Integration

Inside your VueJS application you have to register the `VueLocale` plugin:

```js
import VueLocale from "vue-locale";

Vue.use(VueLocale,
{
  language: SELECTED_LANGUAGE,
  currency: SELECTED_CURRENCY,
  messages: MESSAGE_TEXTS
})
```

While these are typical examples of values:

- `SELECTED_LANGUAGE`: `"de"`, `"en"`, `"fr"`, ... (any valid language identifier)
- `SELECTED_CURRENCY`: `"EUR"`, `"USD"`, ... (any valid currency from [CLDR data](http://www.currency-iso.org/dam/downloads/lists/list_one.xml))
- `MESSAGE_TEXTS`: `{ key : value, ...}`


## Loading required locale data

Depending on whether your clients support the `Intl` API + all relevant locales (prominent exceptions right now are NodeJS, Safari on Mac and Safari on iOS) the amount of data and polyfills to load differs.

### Loading Intl-Polyfill + Data for 4 Locales

```js
import intl_en from "intl/locale-data/json/en.json"
import intl_de from "intl/locale-data/json/de.json"
import intl_fr from "intl/locale-data/json/fr.json"
import intl_es from "intl/locale-data/json/es.json"

IntlPolyfill.__addLocaleData(intl_en)
IntlPolyfill.__addLocaleData(intl_de)
IntlPolyfill.__addLocaleData(intl_fr)
IntlPolyfill.__addLocaleData(intl_es)
```

The data loaded here contains information on how to format dates (+ calendar data) and numbers (+ currencies).

### Loading FormatJS Data for 4 Locales

Because of an incompatible JSONP-like approach of the data delivered through FormatJS, we have integrated the data in some ES2015/JSPM compatible way in the `vue-locale` project. To load the data to the following:

```js
import IntlRelativeFormat from "intl-relativeformat"

import relative_en from "./data/en.js"
import relative_de from "./data/de.js"
import relative_fr from "./data/fr.js"
import relative_es from "./data/es.js"

IntlRelativeFormat.__addLocaleData(relative_en)
IntlRelativeFormat.__addLocaleData(relative_de)
IntlRelativeFormat.__addLocaleData(relative_fr)
IntlRelativeFormat.__addLocaleData(relative_es)
```

The data loaded here contains formatting instructions for relative formats + the required plural function for figuring out the required plural wording for message formatting.


## Usage

### Adding Messages

You should pass the matching locale data structure with relevant messages e.g. German.

```js
let messages =
{
  "my-message-identifier": "Hallo Welt!",
  "my-html-identifier": "Hallo <b>Welt</b>!",
  "my-personal-identifier": "Hallo {name}!",
  ...
}
```

### Translating messages using VueJS filter

- Plain Text: ```{{ "my-message-identifier" | format-message }}```
- HTML Output: ```{{{ "my-html-identifier" | format-message }}}```
- Personal: Not possible because we can't pass the required additional data structure to the filter


### Translating using function calls

- Plain Text: ```{{ $formatMessage("my-message-identifier") }}```
- HTML Output: ```{{{ $formatMessage("my-html-identifier") }}}```
- Personal: `{{{ $formatMessage("my-personal-identifier", { name : screenName }) }}}`


### Formatting Numbers

- Number Formatting #1: ```{{ 3.14159 | format-number }}``` => `"3,14159"`
- Number Formatting #2: ```{{ 3.14159 | format-number 2 }}``` => `"3,14"`
- Number Formatting #3: ```{{ 3.14159 | format-number 0 }}``` => `"3"`
- Percent Formatting #1: ```{{ 0.641322 | format-percent }}``` => `"64%"`
- Percent Formatting #2: ```{{ 0.641322 | format-percent 2 }}``` => `"64,13%"`
- Currency Formatting #1: ```{{ 21.37 | format-currency }}``` => `"21 €"`
- Currency Formatting #2: ```{{ 21.37 | format-currency-precise }}``` => `"21,37 €"`


### Formatting Dates/Times

- Date Formatting: ```{{ new Date | format-date }}``` => `12.2.2016`
- Time Formatting: ```{{ new Date | format-time }}``` => `14:23 Uhr`


### Formatting Relative Dates

- Relative Formatting: ```{{ new Date - (1000 * 60 * 10) | format-relative }}``` => `vor 10 Minuten`



## Copyright

<img src="assets/sebastiansoftware.png" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2015-2016<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)

