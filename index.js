// const http = require('http');
// const hostname = '0.0.0.0';
// const port = 80;
// const server = http.createServer((req, res) => { 
//  res.statusCode = 200;
//  res.setHeader('Content-Type', 'text/plain');
//  res.end('Hello World\n');
// }); 
// server.listen(port, hostname, () => { 
//  console.log(`Server running at http://${hostname}:${port}/`);
// });
// const express = require('express')
// const path = require('path')
// const app = express()
// const port = 8080
// app.use(express.static(__dirname + '/client'));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'index.ejs'));
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })

// Load Node modules
var express = require('express');
const router = express.Router();

const ejs = require('ejs');
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
app.use("/css",express.static(__dirname + "/css"));
app.use("/js",express.static(__dirname + "/js"));
console.log('Example app listening at http://localhost:8080');
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/byd', (req, res) => {
  res.render('byd');
});
app.get('/jdf', (req, res) => {
  res.render('jdf');
});
app.get('/knowledge', (req, res) => {
  res.render('knowledge');
});
app.get('/longi', (req, res) => {
  res.render('longi');
});
app.get('/maotai', (req, res) => {
  res.render('maotai');
});
app.get('/terms', (req, res) => {
  res.render('terms');
});
app.get('/video', (req, res) => {
  res.render('video');
});
app.get('/yonghui', (req, res) => {
  res.render('yonghui');
});

var bodyParser = require('body-parser');

app.use(bodyParser());

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://niubi:123@cluster0.lfrkz.mongodb.net/niubi?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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
