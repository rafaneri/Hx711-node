/**
 * Created by rafaelneri on 07/03/15.
 */
var utils = require('./utils');
var hx711 = require('../build/Release/hx711');

var Hx711 = {

    default:{
        samples: 1,
        min: 9353611.62, //lower input read
        max: 9645293.81, //most read input
        minScale: 0, //less heavy object
        maxScale: 101.8 //most heavy object
    },

    init: function (config) {
        this.default = utils.extend({}, this.default, config);

        if (typeof(this.default.scale)==='undefined') {
            this.default.scale = new hx711.HX711(3, 2);
        };

        return this;
    },

    read: function () {
        return this.default.scale.getValue();
    },

    preciseReading: function (samples) {
        if (typeof(samples)==='undefined') samples = this.default.samples;

        var v = 0;
        for (var i=0; i<samples; i++)
        {
            v += this.read();
        }
        return v/samples;
    },

    getValue: function(samples) {
        if (typeof(samples)==='undefined') samples = this.default.samples;

        var t = this.preciseReading(samples);
        return this.executeScale(t);
    },

    executeScale: function(value)
    {
        var scaled = this.default.minScale + (value - this.default.min)/(this.default.max-this.default.min) * (this.default.maxScale - this.default.minScale);
        return scaled;
    }

};

module.exports = Hx711;
