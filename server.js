var fs = require('fs');

var express = require('express');
var app = express.createServer();
app.listen(8080);

app.helpers({
    version : JSON.parse(fs.readFileSync(__dirname + '/package.json')).version,
});

app.get('/', function (req, res) {
    res.render('index.jade');
});
