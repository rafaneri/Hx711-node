/**
 * Created by rafaelneri on 07/03/15.
 */
var mraa = require('mraa');
var utils = require('./utils');

var Hx711 = {
    dOut: null,
    sck: null,
    _gain: null,
    _scale: null,
    _offset: null,

    init: function (pinDOut, pinSck, gain) {
        this.dOut = new mraa.Gpio(pinDOut);
        this.sck = new mraa.Gpio(pinSck);

        this.dOut.dir(mraa.DIR_OUT);
        this.sck.dir(mraa.DIR_IN);

        if (typeof(gain)==='undefined') gain = 128;
        this.setGain(gain);
    },

    isReady: function () {
        var out = this.dOut.read();
        return out == 0;
    },

    setGain: function (gain) {
        if (typeof(gain)==='undefined') gain = 128;
        if(gain == 128) {
            _gain = 1;
        } else if (gain == 64){
            _gain = 3;
        } else if(gain == 32){
            _gain = 2;
        }

        this.sck.write(0);

        this.read();
    },

    read: function () {
        while(!this.isReady());

        var data = [];

        for(var j = 3; j>0; j--)
        {
            for(var i = 8; i>0; i--){
                this.sck.write(1);
                data[j] = utils.bitWrite(data[j], i, this.dOut.read());
                console.log('data[j]', data[j]);
                this.sck.write(0);
            }
        }

        for (var i = 0; i < _gain; i++) {
            this.sck.write(1);
            this.sck.write(0);
        }

        data[3] ^= 0x80;

        return (data[3] << 16) | (data[2] << 8) | data[1];
    },

    readAverage: function (times) {
        if (typeof(times)==='undefined') times = 10;
        var sum =0;
        for(var i= 0; i < times; i++)
        {
            sum += this.read();
        }
        return sum/times;
    },

    getValue: function (times) {
        if (typeof(times)==='undefined') times = 1;
        return this.readAverage(times) - this._offset;
    },

    getUnits: function (times) {
        //if (typeof(times)==='undefined') times = 1;
        return this.dOut.read();//this.getValue(times) / this._scale;
    },

    tare: function (times) {
        if (typeof(times)==='undefined') times = 10;
        var sum = this.readAverage(times);
        this.setOffset(sum);
    },

    setScale: function (scale) {
        if (typeof(scale)==='undefined') scale = 1;
        this._scale = scale;
    },

    setOffset: function (offset) {
        if (typeof(offset)==='undefined') offset = 0;
        this._offset = offset;
    },

    powerDown: function () {
        this.sck.write(0);
        this.sck.write(1);
    },

    powerUp: function () {
        this.sck.write(0);
    }

};

module.exports = Hx711;
