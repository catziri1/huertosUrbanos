let express = require('express');
let app = express();
app.set('view engine', 'ejs');
path = require('path');
var async = require('async');
app.use('/public', express.static(__dirname + '/public'));
var Observable = require('rxjs');
var dynamo = require('./dynamo.js');
var temp = new dynamo('Temperatura');
var luz = new dynamo('Luz');

temp.init(
  function () {
    console.log("temp Storage Starter");
  }
)

luz.init(
  function () {
    console.log("temp Storage Starter");
  }
)


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

app.get('/a', function (req, res) {
  var imageurls = [];

  var processData = function (callback) {
    temp.get(function (err, data) {
      imageurls = data;
      callback(undefined, imageurls);

    });
  };

  processData(function (err, queryresults) {
    console.log("teme"+queryresults);
    res.json(queryresults);
  });

});
 app.get('/b', function (req, res) {
  var imageurls = [];

  var processData2 = function (callback) {
    luz.getL(function (err, data) {
      // imageurls = data;
      imageurls = data;
      callback(undefined, imageurls);

    });
  };

  processData2(function (err, queryresults) {
    //console.log(queryresults);
    res.json(queryresults);
  });

}); 

app.get('/calendario', function (req, res) {
  //res.end('hola mundo');
  res.sendFile(__dirname + '/public/views/calendario.html');
});

app.get('/bitacoras', function (req, res) {
  //res.end('hola mundo');
  res.sendFile(__dirname + '/public/views/bitacoras.html');
});
app.listen(process.env.PORT||80);

