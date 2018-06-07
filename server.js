const express = require('express')
const favicon = require("express-favicon");
const session = require("client-sessions");
var cors = require('cors');
var fs = require("fs");
var https = require("https");
var auth = require("./public/auth.js")
var mysql = require('mysql');
const app = express();
var path = require("path");

app.options('*', cors())
app.use(cors());
app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
});

//ssl attempts
var options = {
  key: fs.readFileSync("./ssl_certification/keyo.key"),
  cert: fs.readFileSync("./ssl_certification/valuqo_us.crt"),
  ca: [
    fs.readFileSync('./ssl_certification/COMODORSADomainValidationSecureServerCA.crt'),
    fs.readFileSync('./ssl_certification/COMODORSAAddTrustCA.crt')
  ]
};

//static files and favicon
app.enable('trust proxy');
app.use(express.static('public'));
app.use(express.static('views'));
app.use(favicon(__dirname + "/public/vqlogo.png"));

//view engine for rendering websites
app.engine('pug',require('pug').__express);
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

app.use(session({
  cookieName: "authorizationToken",
  secret: "woshitingchechang9359&*($Y&(t7t#g$78gg&*($g&(gy9y894ghHG99gghh)))))",

}))

//checks session
app.get("/*" , auth.testCookie);


//---------//
//all https related code (except for the other thing)
var httpsRedirect = require('express-https-redirect');
app.use("/*",httpsRedirect(true));


/*
//page handlers
app.get('/', function(req, res) {
  res.redirect("/index")
});
*/



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



var httpsServer = https.createServer(options,app);
httpsServer.listen(443, () => console.log("https on 443"));

app.listen(80, () => console.log('App listening on port 80!'))

//app.listen(80, () => console.log('App listening on port 8080!'))
