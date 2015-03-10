/**
 * Created by rafaelneri on 07/03/15.
 */
var mraa = require('mraa');

var Hx711 = {
    data: null,
    clock: null,
    min: 4449.90, //lower input read
    max: 291658.10, //most read input
    minScale: 1.56, //less heavy object
    maxScale: 101.8, //most heavy object
    calibration: 0,
    samples: 0,
    samplesLog2: 0,


    init: function (pinData, pinClock) {
        if (typeof(pinData)==='undefined') pinData = 3;
        if (typeof(pinClock)==='undefined') pinClock = 2;

        this.data = new mraa.Gpio(pinData);
        this.clock = new mraa.Gpio(pinClock);

        this.data.dir(mraa.DIR_IN);
        this.clock.dir(mraa.DIR_OUT);

        this.samplesLog2 = 8;
        this.samples = 16;
    },

    read: function () {
        var v = 0;

        while (this.data.read() == 1);

        for (var i=0; i<24; i++)
        {
            this.clock.write(1);
            v <<= 1;
            v |= (this.data.read() == 1) ? 1 : 0;

            this.clock.write(0);
        }

        this.clock.write(1);
        this.clock.write(0);

        v |= (v & 0x00800000) ? 0xff000000 : 0x00000000;

        return v;
    },

    preciseReading: function () {
        var v = 0;
        for (var i=0; i<this.samples; i++)
        {
            v += this.read();
        }
        return (v >> this.samplesLog2);
    },

    getValue: function() {
        return this.executeScale(this.preciseReading() - this.calibration);
    },

    executeScale: function(value)
    {
        var scaled = this.minScale + (value - this.min)/(this.max-this.min) * (this.maxScale - this.minScale);
        return scaled;
    }

};

module.exports = Hx711;
