"use strict";

import gulp from "gulp";
import del from "del";
import extractData from 'formatjs-extract-cldr-data';

var data = extractData({
    locales    : ['en-US', 'en-GB'],
    pluralRules: true
});

console.log(data);
