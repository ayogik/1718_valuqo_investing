const express = require('express')
const app = express()
var path = require("path");

app.set('view engine','pug');
app.set('views','./pug');

app.use(express.static(__dirname + '/public'));

app.get('/index.html', function(req, res) {
  res.sendFile('index');
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))
