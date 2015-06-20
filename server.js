'use strict';

let app = require('koa')(),
  router = require('koa-router')(),
  json = require('koa-json')(),
  gpio = require('rpi-gpio'),
  thunkify = require('thunkify');

gpio.setMode(gpio.MODE_BCM);
gpio.setup(5, gpio.DIR_IN, function() {
  console.log('GPIO 5 ready');
});
gpio.setup(22, gpio.DIR_IN, function() {
    console.log('GPIO 22 ready');
});

var read = thunkify(gpio.read);

app.use(json);

router.get('/', function *(next) {
  var lightOn = yield read(5);
  var soundOn = yield read(22);
  this.body = { lightOn: !lightOn, sound: !soundOn };
  yield next;
});

app.
  use(router.routes()).
  use(router.allowedMethods());
app.listen(3002);
console.log('[Light/Sound] Server now running at port 3002');
