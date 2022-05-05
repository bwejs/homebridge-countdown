var inherits = require('util').inherits;
var Service, Characteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    inherits(countdown.CountdownValue, Characteristic);
    inherits(countdown.CountdownService, Service);
    homebridge.registerAccessory("homebridge-countdown", "Countdown", countdown);
}

function countdown(log, config) {
    this.log = log;
    this.name = config['name'];
    this.timer;
    this.value = 0;
}

countdown.CountdownService = function(name) {
  Service.call(this, name, 'E7E97EBD-AA9D-4E73-A84E-118B6FB46433', null);
  // Optional Characteristics
  this.UUID = 'E7E97EBD-AA9D-4E73-A84E-118B6FB46433';
};

countdown.CountdownValue = function() {
  Characteristic.call(this, 'CountdownValue', '1EAED9FE-B3C6-45E4-9899-7C71EAA15122');
  this.setProps({
    format: Characteristic.Formats.UINT16,
    perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY, Characteristic.Perms.WRITE]
  });
  this.value = 0;
};

countdown.prototype.getServices = function () {
    var informationService = new Service.AccessoryInformation();

    informationService
        .setCharacteristic(Characteristic.Manufacturer, "bwejs")
        .setCharacteristic(Characteristic.Model, "Countdown")
        .setCharacteristic(Characteristic.SerialNumber, this.name);

        this.service = new countdown.CountdownService(this.name);
        this.contdownCharacteristic = this.service.addCharacteristic(countdown.CountdownValue)
        .on('get', this.getValue.bind(this))
        .on('set', this.setValue.bind(this));

    return [informationService, this.service];
}

countdown.prototype.setTimer = function () {
  clearTimeout(this.timer);
  if (this.value == 0) {
    return;
  }
  this.timer = setTimeout(function() {
    this.value--;
      if (this.value < 15) {
          this.log(this.name + ' Counting down. ' + this.value);
      } else if ((this.value % 15) == 0) {
          this.log(this.name + ' Counting down. ' + this.value);
      }
    this.contdownCharacteristic.updateValue(this.value);
    this.setTimer()
  }.bind(this), 1000);
}

countdown.prototype.setValue = function (newValue, callback) {
    this.value = Math.round(newValue);
    this.log(this.name + ' Writing Value to ' + this.value);
    this.setTimer()
    callback();
}

countdown.prototype.getValue = function (callback) {
    callback(null, this.value);
}
