var express = require('express');
var app = require('express')();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var jwt = require('jsonwebtoken');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var _ = require('underscore');
require('./models/Users');
var Users = mongoose.model('Users');
sockets = {};
peoples = {};

app.use(express.static(__dirname + '/dist/'));
app.set('view engine', 'html');
app.set('port', (process.env.PORT || 3000));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

if(process.env.NODE_ENV) {
    mongoose.connect('mongodb://chat:chat123456@ds047166.mlab.com:47166/chat');
} else {
    mongoose.connect('mongodb://localhost/chat');
}

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', startServer);

function startServer(){
	server.listen(app.get('port'), function(){
		console.log("Aplicação executada na porta"+app.get('port'));
		app.get('*', function(req, res) {
			res.sendFile(__dirname + '/dist/index.html');
		});
	});
};

var users = require('./routes/users');
app.use('/', users);

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});