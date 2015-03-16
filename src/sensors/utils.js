/**
 * Created by rafaelneri on 07/03/15.
 */

var utils = {
// Returns the lower 8 bits of  value
    lowByte: function (value) {
        return ( value & 0x0ff);
    },

// Returns the value shifted right by 8 bits
    highByte: function (value) {
        return ( this.lowByte(value >>8));
    },

// Returns the value of the bit number specified (return:0 or 1)
    bitRead: function (value, bitnum) {
        return ((value>>bitnum)&0x01);
    },

// Returns value with bit changed to specified data
    bitWrite: function (value, bitnum, bitdata) {
        value = value & ~(0x01<<bitnum);
        bitdata = (bitdata & 0x01) << bitnum;
        return (value | bitdata);
    },

// Returns value with specified bit set
    bitSet: function (value, bitnum) {
        return(value | (0x01 << bitnum));
    },

// Returns value with specified bit clear
    bitClear: function (value, bitnum) {
        return(value & (~(0x01 << bitnum)));
    },

//Returns a value with one specified bit number set
    bit: function (bitnum) {
        return(0x01<<bitnum);
    },

// Returns the sine of an angle (in radians).
    sin: function (radians) {
        return (Math.sin(radians));
    },

// Returns the cos of an angle (in radians).
    cos: function (radians) {
        return (Math.cos(radians));
    },

// Returns the tan of an angle (in radians).
    tan: function (radians) {
        return (Math.tan(radians));
    },

// Returns the the minimum of x or y
    min: function (x,y) {
        return (Math.min(x,y));
    },

// Returns the the maximum of x or y
    max: function (x,y) {
        return (Math.max(x,y));
    },

// Returns the the absolute value of x
    abs: function (x) {
        return (Math.abs(x));
    },

// Returns a value constrained within the range of a to b
// Returns: x if x is between a and b
//          a if x is less than a
//          b if x is greater than b
    constrain: function (x,a,b) {
        if (x>b) x=b;
        else if (x<a) x=a;
        return (x);
    },

// Returns a value re-mapped from one range to another
    map: function (value, fromLow, fromHigh, toLow, toHigh) {
        return( toLow + (((value-fromLow)*(toHigh-toLow))/(fromHigh-fromLow)));
    },

// Returns x raised to y power
    pow: function (x,y) {
        return (Math.pow(x,y));
    },

// Returns the aquare root of x
    sqrt: function (x) {
        return (Math.sqrt(x));
    },

    delay: function (milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    },

    extend: function (target) {
        var sources = [].slice.call(arguments, 1);
        sources.forEach(function (source) {
            for (var prop in source) {
                target[prop] = source[prop];
            }
        });
        return target;
    }
};

module.exports = utils;