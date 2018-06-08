var mysql = require("mysql");
var pathToRegexp = require("path-to-regexp");
var connection = mysql.createConnection({
  host     : 'valuqo.cf2muhtlwios.us-east-2.rds.amazonaws.com',
  user     : 'root',
  password : '12345678',
  database : 'accounts'
});

module.exports = {
  testCookie: function(req,res,next) {
    path = req.path;
    if (path.indexOf("login") < 0
      &&path.indexOf("api") < 0
      &&path.indexOf("landing") < 0)
    {
      if (req.mySession && req.mySession.user) { // Check if session exists
        // lookup the user in the DB by pulling their email from the session
        connection.query("SELECT email IN user WHERE email = '" + req.session.user.email + "'",function (err, result, fields) {
          if (err) throw err;
          if (result.length > 0) {
            next();
          }
        });
      }
      else {
        res.redirect("/login");
        next();
      }
    }
    next();

  }

};
