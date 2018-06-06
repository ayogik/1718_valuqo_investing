const express = require('express')
const favicon = require("express-favicon");
const session = require("client-sessions");
var fs = require("fs");
var https = require("https");
var auth = require("./public/auth.js")
var mysql = require('mysql');
const app = express();
var path = require("path");

//ssl stuff
var options = {
  key: fs.readFileSync("./private_key.pem"),
  cert: fs.readFileSync("./certificate_file.crt")
};

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

//---SESSIONS---//
//cookie made with Session node
app.use(session({
  cookieName: 'mySession',
  secret: 'abcdefgsomeoneshouldatoldyounottofwithme&*(T@rghu9T*(&#789hg#W0g0)($Y*G))',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
/*
//checks session
app.get("/*" , auth.testCookie);


//---------//

//page handlers
app.get('/', function(req, res) {
  res.redirect("/index.html")
});
app.get('/index', function(req, res) {
  res.render('index', {title: "Valuqo - Dashboard"})
});
app.get('/charts', function(req, res) {
  res.render('charts')
});
app.get('/tables', function(req, res) {
  res.render('tables')
});
app.get('/login', function(req, res) {
  res.render('login', {title: "Valuqo - Login"})
});
app.get('/register', function(req, res) {
  res.render('login')
});

/*
var httpsServer = https.createServer(options,app);
httpsServer.listen(443, () => console.log("https on 443"))

//app.listen(80, () => console.log('App listening on port 80!'))
*/

'use strict';
require('greenlock-express').create({

  // Let's Encrypt v2 is ACME draft 11
  version: 'draft-11'

, server: 'https://acme-staging-v02.api.letsencrypt.org/directory'
  // Note: If at first you don't succeed, switch to staging to debug
  // https://acme-v02.api.letsencrypt.org/directory

  // You MUST change this to a valid email address
, email: 'bizhao@ctemc.org'

  // You MUST NOT build clients that accept the ToS without asking the user
, agreeTos: true

  // You MUST change these to valid domains
  // NOTE: all domains will validated and listed on the certificate
, approveDomains: [ 'www.valuqo.onmypc.net', 'valuqo.onmypc.net' ]

  // You MUST have access to write to directory where certs are saved
  // ex: /home/foouser/acme/etc
, configDir: require('path').join(require('os').homedir(), 'acme', 'etc')

, app: require('express')().use('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end('Hello, World!\n\n💚 🔒.js');
  })

  // Join the community to get notified of important updates and help me make greenlock better
, communityMember: true

  // Contribute telemetry data to the project
, telemetry: true

//, debug: true

}).listen(80, 443);
