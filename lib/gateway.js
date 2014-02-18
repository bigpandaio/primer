var Primus = require('primus');
var _ = require('underscore');
var util = require('util');
var EventEmitter = require('eventemitter3').EventEmitter

function mustBeSet(propertyName) {
  return util.format('"%s" must be set. Use app.set("%s", ..)', propertyName, propertyName);
}

function validate(configuration) {
  if (!configuration.engine) {
    throw new Error(mustBeSet('engine'));
  }
}

function respond(spark, event, data) {
  var response = {
    event: event,
    message: data
  }
  spark.write(response);
}

var Gateway = function(server, configuration) {

  var self = this;
  this.registry = {}

  validate(configuration)

  this.primus = new Primus(server, {
    transformer: configuration.engine,
    pathname: configuration.path || "/"
  })

  if (configuration.generate) {
    var path = configuration.generate
    this.primus.save(path);
  }
  this.primus.on('connection', function (spark) {
    console.log('Connection')

    var context = { client: spark };
    self.registry[spark.id] = spark;

    spark.on('data', function (data) {
      data.$context = context;

      self.emit(data.event, data.message)
    })
  });

  this.primus.on('disconnection', function(spark) {
    delete self.registry[spark.id];
  })

}

Gateway.prototype.send = function(event, data, context) {
  if (!context) {
    context = data.$context;
  }

  var spark = context.spark;
  if (!spark) {
    spark = this.registry[context.sparkId];
  }

  if (!spark) {
    throw new Error('Spark not specified');
  }

  respond(spark, event, data);
}

Gateway.prototype.broadcast = function(event, data, context) {
  var self = this;

  if (!context) {
    context = data.$context;
  }

  var sparks = context.sparkIds || _.keys(this.registry);
  sparks.forEach(function(sparkId) {
    context.sparkId = sparkId;
    self.send(event, data, context)
  })
}


Gateway.prototype.close = function(callback) {
  this.primus.on('close', function() { callback() });
  this.primus.end();
}

util.inherits(Gateway, EventEmitter);

module.exports = Gateway;
