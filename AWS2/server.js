var express = require('express');
var app = express();
const bodyParser = require('body-parser');
var port = 8080;

app.use(bodyParser.json({ type: '*/*', limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.post('/user', function (req, res) {
  const message = "Data has been processed by api:" + JSON.stringify(req.body);
  res.send(message);
  console.log(message);
});


app.listen(port);
console.log('Magic happens on port ' + port);