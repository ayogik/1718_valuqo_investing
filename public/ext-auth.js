//requires
var mysql = require("mysql");
var natural = require('natural');
var jss = require('jssoup')

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

$(document).ready(function() mysqlInput(values,desc,id){
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
        //categorize with ML-predicted expense type and insert into expenses table
        connection.query("INSERT INTO expenses (comm_or_util) VALUES ("+((classifier.classify(desc)).equals('commodities')0:1)+")", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });

    });
});

$(document).ready(function() getGasPrices(desc, address){
    //read in html body of text.
    var url = 'https://www.gasbuddy.com/home?search='+encodeURIComponent(address)+'&fuel=1'
    $.get(url, function(response){
        var body = response;
    });
    var soup = new JSSoup(body);
    var pricesByDistance = [];
    //scrape for prices.
    for(var i = 0;;i++){
        var price = soup.nextElement.descendants[0].descendants[2*2].descendants[0].descendants[0].descendants[0].descendants[2*2].descendants[2*2].descendants[0].descendants[3*2].descendants[1]
        pricesByDistance.push(price);
        if(soup.nextElement.descendants.length!=1) break;
    }
    //get date and insert into MySQL database "utilities" table
    connection.connect(function(err) {
        if (err) throw err;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10) {
            dd = '0'+dd
        }
        if(mm<10) {
            mm = '0'+mm
        }
        today = mm + '/' + dd + '/' + yyyy;
        for(var i = 0;i<pricesByDistance.length;i++){
            connection.query("INSERT INTO "+utilities+" (date, details, amount) VALUES (\'"+today+"\', \'"+desc+"\', "+pricesByDistance[i]+")", function (err, result, fields) {
                if (err) throw err;
                console.log(result);
            });
        }
    });
});
