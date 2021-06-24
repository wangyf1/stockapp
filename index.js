// Load Node modules
var express = require('express');
const router = express.Router();
const serverless = require('serverless-http');
const ejs = require('ejs');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://niubi:123@cluster0.lfrkz.mongodb.net/niubi?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Initialise Express
var app = express();
// Render static files
app.use(express.static('public'));
// Set the view engine to ejs
app.set('view engine', 'ejs');
// Port website will run on
app.listen(8080);

// *** GET Routes - display pages ***
// Root Route
app.get('/', function (req, res) {
  res.render('index');
});
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/media", express.static(__dirname + "/media"));
app.use("/public", express.static(__dirname + "/public"));

console.log('Example app listening at http://localhost:8080');

app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/contact', (req, res) => {
  res.render('contact');
});
app.get('/knowledge', (req, res) => {
  res.render('knowledge');
});
app.get('/terms', (req, res) => {
  res.render('terms');
});
app.get('/video', (req, res) => {
  res.render('video');
});

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.post('/updatestate', (req, res) => {
  const newValue = updateDatabase(res.body);
  res.json(newValue);
});


client.connect(err => {
  const collection = client.db("niubi").collection("email");
  // perform actions on the collection object
  app.post('/post-email', function (req, res) {

    collection.insertOne(req.body);
    return res.redirect('/');
    //res.send('Data received:\n' + JSON.stringify(req.body));
  });
  //client.close();
});

module.exports.handler = serverless(app);
