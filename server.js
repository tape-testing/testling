#!/usr/bin/env node

var app = require('./').createServer(process.argv[2]);
app.listen(8080);
