var express = require('express');
var bodyParser = require("body-parser");
var nano = require('nano')('http://localhost:5984');
var report = require('./report');
var underscore = require('underscore');
var db = nano.db.use('statistics');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

  var locations = [
    { label: "Санкт-Петербург" },
    { label: "Москва" },
    { label: "Ташкент" },
  ];

  var result = underscore.filter(locations, function (item) {
    return item.label.indexOf(term) != -1;
  });

  res.json(result || []);
});

app.get('/events.json', function (req, res) {
  var term = req.query.term;

  var events = [
    { label: "Январь 2016",  type: "monthly", date: [2016, 1] },
    { label: "Февраль 2016", type: "monthly", date: [2016, 2] },
    { label: "Март 2016",    type: "monthly", date: [2016, 3] },
    { label: "Марафон Прабхупады 2016 (Декабрь)", type: "event" },
  ];

  var result = underscore.filter(events, function (item) {
    return item.label.indexOf(term) != -1;
  });

  res.json(result || []);
});

app.post('/api/report/new', function (req, res) {
  var doc = req.body;
  var reportCheckState = report.check(doc);

  if (reportCheckState.success) {
    db.insert(doc, function(err, body) {
      if (!err)
        console.log(body);
      else
        console.log(err);
    });
  } else {
    console.log(reportCheckState);
  }

  res.send(reportCheckState);
});

app.get('/api/location/check', function (req, res) {

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
