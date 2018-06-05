const express = require('express')
const favicon = require("express-favicon");
const session = require("client-sessions");
var auth = require("./public/auth.js")
var mysql = require('mysql');
const app = express();
var path = require("path");

//static files and favicon
app.enable('trust proxy');
app.use(express.static('public'));
app.use(express.static('views'));
app.use(favicon(__dirname + "/public/vqlogo.png"));

//view engine for rendering websites
app.set('view engine','pug');
app.set('views', __dirname + '/views');

//general handler for any web request
var ips = [];
app.all('/*', function (req,res, next) {
  if (!(ips.includes(req.ip))){
    console.log(req.ip);
    ips.push(req.ip);
  }
  next()
});

//database handling
var connection = mysql.createConnection({
  host     : 'valuqo.cf2muhtlwios.us-east-2.rds.amazonaws.com',
  user     : 'root',
  password : '12345678',
  database : 'accounts'
});
/* database stuff
connection.connect();
connection.query("NEW TABLE accounts",function (err, rows, fields) {
  if (err) throw err
})
*/

//---SESSIONS---//
//cookie made with Session node
app.use(session({
  cookieName: 'mySession',
  secret: 'abcdefgsomeoneshouldatoldyounottofwithme&*(T@rghu9T*(&#789hg#W0g0)($Y*G))',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

//checks session
app.get("/*" , auth.testCookie);


//---------//

//page handlers
app.get('/', function(req, res) {
  res.redirect("/index.html")
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
  res.render('login', {title: "Valuqo - Login"})
});
app.get('/register.html', function(req, res) {
  res.render('login')
});



app.listen(80, () => console.log('App listening on port 8080!'))
