var Proxy = function(gateway) {
  this.gateway = gateway;
}

Proxy.prototype.send = function(event, data, context) {
  this.gateway.send(event, data, context)
}

module.exports = Proxy;
