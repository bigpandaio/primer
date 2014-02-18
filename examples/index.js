var http = require('http');
var primer = require('../lib/primer');
var util = require('util');

var server = http.createServer();
var app = primer(server);
app.configure(function() {
  app.set('engine', 'engine.io')
  app.set('generate', __dirname +'/../examples/primus.js');
})

var port = app.get('port') || 4000;
server.listen(port, function() {
  console.log(util.format('listening on port %s', port))
});

