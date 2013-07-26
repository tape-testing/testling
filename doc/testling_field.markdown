This document is a comprehensive list of all the parameters you can put into the
`"testling"` field of `package.json`.

# browsers

testling uses the
[normalize-browser-names](https://npmjs.org/package/normalize-browser-names)
module to parse and expand the browser version ranges listed in the `"browsers"`
field.

The [browser list](http://testling.com/browsers.json)
is routinely updated as we add more browsers. Here is a list but check the 
[json data](http://testling.com/browsers.json) for the most up to date version.

* iexplore - 6.0, 7.0, 8.0, 9.0, 10.0
* chrome - 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0,
    16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0, canary
* firefox - 3.0, 3.5, 3.6, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0,
    14.0, 15.0, 16.0, 17.0, 18.0, 19.0, nightly
* opera - 10.0, 10.5, 11.0, 11.5, 11.6, 12.0, next
* safari - 4.0, 5.0.5, 5.1, 6.0
* iphone - 6.0
* ipad - 6.0
* android-browser - 4.2

When listing browser support, you can use "ie" as shorthand for "iexplore" and
"ff" for "firefox".

Here's an example of
[normalize-browser-names](https://npmjs.org/package/normalize-browser-names)-compliant
`"browsers"` data:

``` json
"browsers": [
    "ie/8..10"
    "firefox/3.5", "firefox/latest",
    "chrome/latest",
    "safari/5..latest",
    "opera/11", "opera/next"
]
```

# files

`"files"` is a single
[glob string](http://npmjs.org/package/glob)
or an array of
[glob strings](http://npmjs.org/package/glob)
that will be run to collect test output written with `console.log()`.

Each file is run through [browserify](http://browserify.org/) so you can
`require()` other files using
[node-style module loading](http://nodejs.org/docs/latest/api/modules.html#modules_modules).

Usually a single string glob is sufficient:

``` json
"files": "test/*.js"
```

but sometimes extra globs or direct filenames are useful:

``` json
"files": [ "test/*.js", "test/browser/*.js" ]
```

# scripts

`"scripts"` is a single
[glob string](http://npmjs.org/package/glob)
or an array of
[glob strings](http://npmjs.org/package/glob)
that will be run to collect test output written with `console.log()`.

Unlike `"files"` which are run through [browserify](http://browserify.org) to
make `require()` work, each file from `"scripts"` is inserted directly into the
page with a `<script>` tag.

# html

Instead of using `"files"` and `"scripts"` to populate an html file with
`<script>` tags, you can give an html file directly.

The `"html"` entry is just a relative path string from the project root:

``` json
"html": "test.html"
```

# preprocess

Instead of using [browserify](http://browserify.org) to turn `"files"` into a
bundle, you can use a custom command.

Specify a string and it will be run:

``` json
"preprocess": "./build.sh"
```
