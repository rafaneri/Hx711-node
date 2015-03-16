/**
 * Created by rafaelneri on 06/03/15.
 */
var Hx711 = require('../sensors/hx711');

module.exports = function(app) {

    var scale = Hx711.init();

    function readScale() {
        var value = scale.getValue();
        app.io.broadcast('scaleData', {scale: value});
    };

    app.io.route('scale', readScale);
};
