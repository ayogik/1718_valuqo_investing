const express = require('express')
const app = express()
var path = require("path");
var dir = path.dirname(require.main.filename);

app.set('view engine','pug');
app.set('views','./views');

app.get('/', function(req, res) {
  res.render('index', {title: "Hey", message: "Hello there!"});
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))
