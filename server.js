const { request } = require('express');
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const PORT = 8080;
require('dotenv').config();

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'sign-request-data';

// connect to Mongo client
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  db.collection('shelf-sign-request')
    .find()
    .sort({ dateRequested: -1 })
    .toArray()
    .then((data) => {
      res.render('index.ejs', { info: data });
    })
    .catch((error) => console.log(error));
});

app.post('/addShelfRequest', (req, res) => {
  let currentDate = new Date().toDateString();
  db.collection('shelf-sign-request')
    .insertOne({
      productName: req.body.productName,
      productPrice: req.body.productPrice,
      productSize: req.body.productSize,
      productSku: req.body.productSku,
      signMissing: req.body.signMissing === 'on' ? true : false,
      tastingNotes: req.body.tastingNotes,
      dateRequested: currentDate,
    })
    .then((result) => {
      console.log('Product Request Added');
      res.redirect('/');
    })
    .catch((error) => console.log(error));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
