var Gateway = require('./gateway');
var Proxy = require('./proxy');

module.exports = function (server) {

  var Application = function () {
    this.configuration = {};
    this.gateway = null;
  }

  Application.prototype.configure = function (configureFun) {
    configureFun();

    this.gateway = new Gateway(server, this.configuration);
  }

  Application.prototype.set = function (property, value) {
    this.configuration[property] = value;
  }

  Application.prototype.get = function(property) {
    return this.configuration[property];
  }

  Application.prototype.react = function(event, callback) {
    var proxy = new Proxy(this.gateway)

    this.gateway.on(event, function(data) {
      callback(data.message, proxy, data.$context);
    });
  }

  return new Application();

}
