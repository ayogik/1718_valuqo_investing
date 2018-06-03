const express = require('express')
const app = express()
var path = require("path");

app.set('view engine','pug');
app.set('views',__dirname + '/views');

app.use(express.static(__dirname + '/views'));

app.get('/', function (req,res, next) {
  console.log(req.method)
  next()
});

/*
app.get('/index.html', function(req, res) {
  res.sendFile('index');
});
*/
app.get('/', function(req, res) {
  res.render('index')
});
app.get('/index.html', function(req, res) {
  res.render('index', {title: "Dashboard"})
});
app.get('/charts.html', function(req, res) {
  res.render('charts')
});
app.get('/login.html', function(req, res) {
  res.render('login')
});
app.get('/register.html', function(req, res) {
  res.render('login')
});



app.listen(3000, () => console.log('Example app listening on port 3000!'))
