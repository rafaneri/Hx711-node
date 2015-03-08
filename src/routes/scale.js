/**
 * Created by rafaelneri on 06/03/15.
 */
var Hx711 = require('../sensors/hx711');
//var utils = require('../sensors/utils');

module.exports = function(app) {

    function readScale(req, res, next) {
        var scale = Hx711.getUnits();
        console.log(scale);
        app.io.broadcast('scaleData', {scale: scale});
    };

    function initScale(req, res, next) {
        Hx711.init(1, 0);
        Hx711.setScale(2837.15715964054);
        Hx711.tare();
        setInterval(function() {
            readScale();
        }, 1000);
    };

    app.io.route('scale', initScale);
};
