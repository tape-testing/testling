# testling

Run [testling-ci](http://ci.testling.com) tests locally.

# example

write a test:

``` js
var test = require('tape');
var myCode = require('../my_code.js');

test('make sure my code works', function (t) {
  t.plan(2);
  t.equal(myCode.beep(5), 555);
  
  myCode.boop(333, function (n) {
    t.equal(n, 3);
  });
});
```

configure your package.json and set up a web hook:

```
$ testling init
```

run your tests locally:

```
$ testling
```


# install

With [npm](http://npmjs.org) just do:

```
npm install -g testling
```

![attack of the testlings!](http://substack.net/images/browsers/war_of_the_browsers.png)
