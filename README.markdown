testling
========

Run browser unit tests headlessly with jsdom locally and remotely with
[testling.com](http://testling.com).

example
=======

To run a test locally, just:

```
$ testling test.js 
node/jsdom                      1/1  100 % ok
$ 
```

To run the same test on remote browsers, just add `--browsers=...`!

```
$ testling test.js --browsers=iexplore/7.0,iexplore/8.0,firefox/3.5
Bundling...  done

iexplore/7.0        0/1    0 % ok
  Error: 'JSON' is undefined
    at [anonymous]() in /test.js : line: 4, column: 5
    at [anonymous]() in /test.js : line: 3, column: 29
    at test() in /test.js : line: 3, column: 1

  > t.deepEqual(JSON.parse('[1,2]'), [1,2]);

iexplore/8.0        1/1  100 % ok
firefox/3.5         1/1  100 % ok

total               2/3   66 % ok
$ 
```

Super easy!

For more information, consult the
[testling documentation](http://testling.com/docs/).

usage
=====

```
Usage: testling [test files] {OPTIONS}

Options:
  --browsers, -b     Run your tests remotely in real browsers on testling.com.

  --output, -o       The output format to use in remote mode.
      http://testling.com/docs/#output-parameter
                 
  --noinstrument     Turn off instrumentation for particular files in remote mode.
      http://testling.com/docs/#noinstrument

  --browserlist, -l  Show the available browsers on testling.com.

  --config           Read configuration information from this file.
```

install
=======

With [npm](http://npmjs.org) just do:

    npm install -g testling

![attack of the testlings!](http://substack.net/images/browsers/war_of_the_browsers.png)
