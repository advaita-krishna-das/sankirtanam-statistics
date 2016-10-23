var express = require('express');
var bodyParser = require("body-parser");
var nano = require('nano')('http://localhost:5984');
var report = require('./report');
var underscore = require('underscore');
var db = nano.db.use('statistics');

var database = require("./db")(db);

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var events = [];
var locations = [];

db.get('config:events', function(err, body) {
  if (!err) events = body.events;
});

db.get('config:locations', function(err, body) {
  if (!err) locations = body.locations;
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/send.html');
});

app.get('/locations.json', function (req, res) {
  var term = req.query.term;
  var lterm = term.toLowerCase();

  var result = underscore.filter(locations, function (item) {
    var label = item.label.toLowerCase();
    return label.indexOf(lterm) != -1;
  });

  res.json(result || []);
});

app.get('/events.json', function (req, res) {
  var term = req.query.term;
  var lterm = term.toLowerCase();

  var result = underscore.filter(events, function (item) {
    var label = item.label.toLowerCase();
    return label.indexOf(lterm) != -1;
  });

  res.json(result || []);
});

app.post('/api/report/new', function (req, res) {
  var doc = req.body;
  var reportCheckState = report.check(doc, { events: events });

  if (!reportCheckState.success) {
    res.send(reportCheckState);
    return;
  }

  var event = underscore.find(events,  (f) => f.label == doc.date );
  var key = doc.type == "monthly" ?
    doc.location + ":" + event.date[0] + "/" + event.date[1] :
    doc.location + ":" + event.date;
  doc.date = event.date;
  doc.type = event.type;

  database.save(key, doc);

  res.send(reportCheckState);
});

app.get('/api/location/check', function (req, res) {

});

app.get('/api/report/overall', function (req, res) {
  var bookScores = [2, 1, 0.5, 0.25];

  db.view('overall', 'overallByLocation', { reduce: true, group_level: 1 }, function(err, body) {
    if (!err) {
      var result = underscore.map(body.rows, function(row) {
        var location = row.key[0];
        var books    = row.value;
        var scores   = books.map((v, i) => v * bookScores[i]);
        var overallBooks  = books.reduce((pv, cv) => pv + cv, 0);
        var overallScores = scores.reduce((pv, cv) => pv + cv, 0);

        return { location, books, scores, overallBooks, overallScores };
      });

      res.json(result);
    }
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
