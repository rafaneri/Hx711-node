/**
 * Created by rafaelneri on 07/03/15.
 */
var Galileo = require("galileo-io");
var board = new Galileo();
var utils = require('./utils');

var Hx711 = {
    dOut: null,
    sck: null,
    _gain: null,
    _scale: null,
    _offset: null,

    init: function (pinDOut, pinSck, gain) {
        dOut = new mraa.Aio(pinDOut);
        sck = new mraa.Aio(pinSck);
        
        //dOut.dir(mraa.DIR_OUT);
        //sck.dir(mraa.DIR_IN);

        if (typeof(gain)==='undefined') gain = 128;
        this.setGain(gain);
    },

    isReady: function () {
        return dOut.read() == 0;
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

        sck.write(0);

        this.read();
    },

    read: function () {
        while(!this.isReady());

        var data = [];

        for(var j = 3; j>0; j--)
        {
            for(var i = 8; i>0; i--){
                sck.write(1);
                data[j] = utils.bitWrite(data[j], i, dOut.read());
                sck.write(0);
            }
        }

        for (var i = 0; i < _gain; i++) {
            sck.write(1);
            sck.write(0);
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
        return this.readAverage(times) - _offset;
    },

    getUnits: function (times) {
        if (typeof(times)==='undefined') times = 1;
        return this.getValue(times) / _scale;
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
        sck.write(0);
        sck.write(1);
    },

    powerUp: function () {
        sck.write(0);
    }

};

module.exports = Hx711;
