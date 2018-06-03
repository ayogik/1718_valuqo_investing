const express = require('express')
const favicon = require("express-favicon");
const app = express()
var path = require("path");


app.use(express.static('views'));
//app.use(express.static("public"));
app.use(favicon(__dirname + "/views/public/vqlogo.png"));

app.set('view engine','pug');
app.set('views', __dirname + '/views');

app.all('/*', function (req,res, next) {
  console.log(req.method)
  next()
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send("Something broke!")
  res.status(404).send ("404")
})

/*
app.get('/index.html', function(req, res) {
  res.sendFile('index');
});
*/
app.get('/', function(req, res) {
  res.render('index')
});
app.get('/index.html', function(req, res) {
  res.render('index', {title: "Valuqo - Dashboard"})
});
app.get('/charts.html', function(req, res) {
  res.render('charts')
});
app.get('/tables.html', function(req, res) {
  res.render('tables')
});
app.get('/login.html', function(req, res) {
  res.render('login')
});
app.get('/register.html', function(req, res) {
  res.render('login')
});



app.listen(80, () => console.log('App listening on port 80!'))
