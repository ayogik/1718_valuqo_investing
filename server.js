const express = require('express')
const favicon = require("express-favicon");
const session = require("client-sessions");
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
app.all('/*', function (req,res, next) {
  console.log(req.ip)
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
//cookie with session node
app.use(session({
  cookieName: 'session',
  secret: 'abcdefgsomeoneshouldatoldyounottofwithme&*(T@rghu9T*(&#789hg#W0g0)($Y*G))',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

function testCookie(req,res) {
  //Database.findmyuserplease({more parameters}, ty);
}
/* this is a meme atm
app.get("/*" , function(req, res, next) {
  if (req.path == "/login.html") {
    next();
  }
  else {
    if (req.session && req.session.user) { // Check if session exists
      // lookup the user in the DB by pulling their email from the session
      User.findOne({ email: req.session.user.email }, function (err, user) {
        if (!user) {
          // if the user isn't found in the DB, reset the session info and
          // redirect the user to the login page
          req.session.reset();
          res.redirect('/login.html');
        } else {
          // expose the user to the template
          res.locals.user = user;

          // render the dashboard page
          res.render('index', {title: "Valuqo - Dashboard"});
        }
      });
    } else {
      res.redirect('/login.html');
    }
  }
});
*/

//---------//

//page handlers
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
  res.render('login', {title: "Valuqo - Login"})
});
app.get('/register.html', function(req, res) {
  res.render('login')
});



app.listen(80, () => console.log('App listening on port 80!'))
