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
const serverless = require('serverless-http');
const ejs = require('ejs');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://niubi:123@cluster0.lfrkz.mongodb.net/niubi?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const collections = ["balance", "cashflow", "cpd", "income"]


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
app.use("/excel", express.static(__dirname + "/excel"));
app.use("/data", express.static(__dirname + "/data-scraper/bbb_data/output"));

console.log('Example app listening at http://localhost:8080');

app.get("/graph", async (req, res) => {
  const code = String(req.query.code).padStart(6, "0")
  let data = {}
  const schema = JSON.parse(fs.readFileSync('./config/schema.json'))
  try {
    for (const cname of collections) {
      const collection = client.db("niubi").collection(cname)
      const cursor = collection.aggregate([
        { $match: { SECURITY_CODE: code } },
        { $sort: { REPORT_DATE: 1 } },
      ])
      while (await cursor.hasNext()) {
        const nxt = await cursor.next()
        for (k in schema[cname]) {
          if (!(schema[cname][k] in data)) {
            data[schema[cname][k]] = new Array()
          }
          data[schema[cname][k]].push(nxt[k])
        }
      }
    }
  } catch (e) {
    console.error(e)
  }

  if (Object.getOwnPropertyNames(data).length === 0) {  // stupid ass js bullshit ¯\_(ツ)_/¯
    console.log(`No data available for ${code}`)
    res.render("404", {})
  } else {
    res.render("graph", {
      data: data
    })
  }
})


app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/byd', (req, res) => {
  res.render('byd');
});
app.get('/contact', (req, res) => {
  res.render('contact');
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
app.get('/pingan', (req, res) => {
  res.render('pingan');
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

app.get('/nanfang', (req, res) => {
  res.render('nanfang');
});

app.get('/yiwei', (req, res) => {
  res.render('yiwei');
});

app.get('/mairui', (req, res) => {
  res.render('mairui');
});

app.get('/ziguang', (req, res) => {
  res.render('ziguang');
});

app.get('/dfyh', (req, res) => {
  res.render('dfyh');
});

app.get('/ningde', (req, res) => {
  res.render('ningde');
});

app.get('/wuliangye', (req, res) => {
  res.render('wuliangye');
});

app.get('/tianci', (req, res) => {
  res.render('tianci');
});

app.get('/changchun', (req, res) => {
  res.render('changchun');
});

app.get('/zhaoyi', (req, res) => {
  res.render('zhaoyi');
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
