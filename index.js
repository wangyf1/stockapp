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
const express = require('express')
const path = require('path')
const app = express()
const port = 8080
app.use(express.static(__dirname + '/client'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
var bodyParser = require('body-parser');

app.use(bodyParser());

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://niubi:123@cluster0.lfrkz.mongodb.net/niubi?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("niubi").collection("email");
  // perform actions on the collection object
  app.post('/index.js', function (req, res) {
    
    collection.insertOne(req.body);
    return res.redirect('/');
    //res.send('Data received:\n' + JSON.stringify(req.body));
});
  //client.close();
});
