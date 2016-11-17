var express = require('express');
var bodyParser = require("body-parser");
var nano = require('nano')('http://localhost:5984');
var report = require('./report');
var underscore = require('underscore');
var db = nano.db.use('statistics');

var database = require("./db")(db);

var app = express();

var apiReports = require("./app/api/reports")(db);
var apiSuggestions = require("./app/api/suggestions")(db);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
	next();
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/send.html');
});

app.get('/locations.json', function(req, res) {
	apiSuggestions.locations(req.query.term, (result) => res.json(result));
});

app.get('/events.json', function(req, res) {
	apiSuggestions.events(req.query.term, (result) => res.json(result));
});

app.post('/api/report/new', function(req, res) {
	var doc = req.body;
	var events = require('./app/api/events')().generateEvents();
	var reportCheckState = report.check(doc, { events });
	var event = underscore.find(events, (event) => event.label == doc.event);

	if (reportCheckState.success) {
		var key = doc.location + ":" + doc.event;
		database.save(key, doc);

		if (event && event.actions && event.actions.copy) {
			var doc2 = Object.assign({}, doc);
			doc2.type = "monthly";
			doc2.event = event.actions.copy;
			console.log(doc2);
			database.save(doc2.location + ":" + doc2.event, doc2);
		}
	}

	res.send(reportCheckState);
});

app.get('/api/report/byLocation', function(req, res) {
	apiReports.byLocation((result) => res.json(result));
});

app.get('/api/report/byEvent', function(req, res) {
	apiReports.byEvent(req.query.event, (result) => res.json(result));
});

app.get('/api/report/byPerson', (req, res) => {
	apiReports.byPerson(req.query.event, (result) => res.json(result));
});

app.get('/api/report/byDays', (req, res) => {
	apiReports.byDays(req.query.event, (result) => res.json(result));
});


app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});
