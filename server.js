const express = require('express')
const favicon = require("express-favicon");
const session = require("client-sessions");
//const $ = require("jquery");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var extend = require("extend");
var request = require("request");
var fs = require("fs");
var https = require("https");
var auth = require("./public/auth.js")
var mysql = require('mysql');
const app = express();
var path = require("path");


//all https related code
var httpsRedirect = require('express-https-redirect');
app.use("/*",httpsRedirect(true));
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
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
  next();
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
  cookieName: "Authorization",
  secret: "woshitingchechang9359&*($Y&(t7t#g$78gg&*($g&(gy9y894ghHG99gghh)))))",
  duration: 1000 * 60 * 60 * 60,
  cookie: {
    httpOnly: true
  }

}));

/*
app.get(["/login","/landing*","/api*"], function (req, res, next) {
  console.log("no");
  next('route');
});
*/
//checks session, but only if its not the routes specified above
app.get("/*" , auth.testCookie);


//---------//

var yodlee_path = "https://developer.api.yodlee.com/ysl/";
var request_header = {
  headers: {
    "Api-Version" : "1.1",
    "Cobrand-Name" : "restserver",
    "content-type" : "application/json"
  }
};
var cobrandlogin = {
  url: yodlee_path + "cobrand/login",
  json : {
    "cobrand":	{
      "cobrandLogin" : "sbCobdbf3615a663fa406a1fbef6009fe38075a",
      "cobrandPassword" : "de178e45-9aff-4c88-a59b-4518c0ff6ce1",
      "locale" : "en_US"
    }
  }
};
var userlogin = {
  url: yodlee_path + "user/login",
  headers : {
    'Authorization' : {}
  },
  json : {
    "cobrand":	{
      "cobrandLogin" : "sbCobdbf3615a663fa406a1fbef6009fe38075a",
      "cobrandPassword" : "de178e45-9aff-4c88-a59b-4518c0ff6ce1",
      "locale" : "en_US"
    }
  }
};

//api handlers
app.get("/api/cobrandlogin", function(req,res,next) {
  request.post(extend(request_header,cobrandlogin), function(error, response, body){
    res.json(body);
    next();
  });
});

app.post("/api/userlogin", function(req,res,next) {
  //console.log(typeof(req) + "\n\n");
  console.log(req.body);
  option = extend(true,request_header,userlogin);
  option.headers.Authorization = "cobSession=" + req.Authorization.session.cobSession;
  request.post(option, function(error, response, body){
    req.mySession = body;
    console.log(body);
    res.json(body);
    next();
  });
});

//web calls
app.get('/', function(req, res) {
  res.render('landing');
});
app.get('/index', function(req, res) {
  res.render('index', {title: "Dashboard"})
});
app.get('/charts', function(req, res) {
  res.render('charts')
});
app.get('/tables', function(req, res) {
  res.render('tables')
});
app.get('/login', function(req, res) {
  res.render('login', {title: "Login"})
});
app.get('/register', function(req, res) {
  res.render('login')
});



var httpsServer = https.createServer(options,app);
httpsServer.listen(443, () => console.log("https on 443"));

app.listen(80, () => console.log('App listening on port 80!'))

//app.listen(80, () => console.log('App listening on port 8080!'))
