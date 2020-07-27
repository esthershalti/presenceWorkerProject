const express = require('express');//רפרנס למחלקה
const app = express();// מופע של המחלקה
const worker = require('./WorkerFunction')
const fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




//פונקציה שתמיד מגיע אליה קודם ואז ממשיך הלאה כי יש לה נקסט
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/', function (req, res) {
  res.send('<b>get /</b>');
});

app.use('/WorkerFunction', worker);//use by another page
app.use(function (req, res, next) {
  console.log("url not found");
  next();
});






