var exec = require('cordova/exec');
var nearby = {
subscribe: function (successCallback, errorCallback) {
        exec(successCallback, errorCallback, "CDVNearbyPlugin", "subscribe");
    },

unsubscribe: function (successCallback, errorCallback) {
        exec(successCallback, errorCallback, "CDVNearbyPlugin", "unsubscribe");
    },
    
publish: function(message, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "CDVNearbyPlugin", "publish", [message]);
    }
}

module.exports = nearby;


