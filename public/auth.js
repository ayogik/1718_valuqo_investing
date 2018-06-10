var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'valuqo.cf2muhtlwios.us-east-2.rds.amazonaws.com',
  user     : 'root',
  password : '12345678',
  database : 'accounts'
});

module.exports = {
  testCookie: function(req,res,next) {
    var redirect = false;
    path = req.path;
    if (path.indexOf('login') < 0
   &&path.indexOf('tables') < 0
   &&path.indexOf('testajax') < 0
   &&path.indexOf('api') < 0
   &&path.indexOf('vendor') < 0
   &&path.indexOf('css') < 0
    &&path.indexOf("img") < 0
    &&path.indexOf("js") < 0
    &&path.indexOf(".png") < 0
   &&path.indexOf('as223ewwer') > 0
    &&path != '/'){
      if (!req.mySession || !req.mySession.user) {//check if session exists
        redirect = true;
      }
    }
    if (redirect){
      console.log('redirected ' + req.path);
      console.log(req.mySession);
      res.redirect('/');
    }
    else{
      next();
    }
  }
}
