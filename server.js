/* global __dirname */
var express = require('express'), app = express();
var path = require('path');

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8080);
console.log('8080 is the magic port!');