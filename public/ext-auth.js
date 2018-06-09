//requires
var mysql = require("mysql");
var natural = require('natural');

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
    if (path.indexOf("login") < 0
    &&path.indexOf("tables") < 0
    &&path.indexOf("api") < 0
    &&path.indexOf("vendor") < 0
    &&path.indexOf("css") < 0
    &&path.indexOf("img") < 0
    &&path != '/'){
      if (!req.mySession || !req.mySession.user) {//check if session exists
        redirect = true;
      }
    }
    if (redirect){
      console.log("redirected " + req.path);
      console.log(req.mySession);
      res.redirect("/");
    }
    else{
      next();
    }
  }
}

$(document).ready(function() mysqlInput(values, id){
    connection.connect(function(err) {
        if (err) throw err;
        connection.query("INSERT INTO "+id+" (date, details, amount) VALUES ("+values+")", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
        //now, find the type of expense.
        //example bayes classifier ML training
        classifier = new natural.BayesClassifier();
        classifier.addDocument("gas", 'commodities')
        classifier.addDocument("gasko", 'commodities')
        classifier.addDocument("sunoco", 'commodities')
        classifier.addDocument("exxon", 'commodities')
        classifier.addDocument("conoco", 'commodities')
        classifier.addDocument("valero", 'commodities')
        classifier.addDocument("gassko", 'commodities')
        classifier.addDocument("stove gas", 'utilities')
        classifier.addDocument("electricity", 'utilities')
        classifier.addDocument("gas", 'utilities')
        classifier.addDocument("gas", 'utilities')
        classifier.addDocument("gas", 'utilities')
        classifier.addDocument("gas", 'utilities')
        //categorize with ML-predicted expense type
        connection.query("INSERT INTO "+id+" (date, details, amount) VALUES ("+values+")", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });

    });
});

$(document).ready(function() getGasPrices(desc, address){

    connection.connect(function(err) {
        if (err) throw err;
        connection.query("INSERT INTO "+id+" (date, details, amount) VALUES ("+values+")", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
        //now, find the type of expense.
        //example bayes classifier ML training
        classifier = new natural.BayesClassifier();
        //comms
        classifier.addDocument("gas", 'commodities')
        classifier.addDocument("gasko", 'commodities')
        classifier.addDocument("sunoco", 'commodities')
        classifier.addDocument("exxon", 'commodities')
        classifier.addDocument("conoco", 'commodities')
        classifier.addDocument("valero", 'commodities')
        classifier.addDocument("gassko", 'commodities')
        //utils
        classifier.addDocument("stove gas", 'utilities')
        classifier.addDocument("electricity", 'utilities')
        classifier.addDocument("water", 'utilities')
        classifier.addDocument("garbage", 'utilities')
        classifier.addDocument("recycling", 'utilities')
        classifier.addDocument("cable", 'utilities')
        classifier.addDocument("verizon", 'utilities')
        classifier.addDocument("xfinity", 'utilities')
        classifier.addDocument("internet", 'utilities')
        classifier.train();
        connection.query("INSERT INTO "+classifier.classify(desc)+" (date, details, amount) VALUES ("+values+")", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });

    });
});
