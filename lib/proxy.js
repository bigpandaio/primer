var Proxy = function(gateway) {
  this.gateway = gateway;
}

Proxy.prototype.send = function(event, data, context) {
  this.gateway.send(event, data, context)
}

Proxy.prototype.broadcast = function(event, data, context) {
  this.gateway.broadcast(event, data, context)
}

module.exports = Proxy;
