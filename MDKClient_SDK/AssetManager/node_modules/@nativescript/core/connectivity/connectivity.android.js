Object.defineProperty(exports, "__esModule", { value: true });
var application_1 = require("../application");
var connectionType;
(function (connectionType) {
    connectionType[connectionType["none"] = 0] = "none";
    connectionType[connectionType["wifi"] = 1] = "wifi";
    connectionType[connectionType["mobile"] = 2] = "mobile";
    connectionType[connectionType["ethernet"] = 3] = "ethernet";
    connectionType[connectionType["bluetooth"] = 4] = "bluetooth";
    connectionType[connectionType["vpn"] = 5] = "vpn";
})(connectionType = exports.connectionType || (exports.connectionType = {}));
var wifi = "wifi";
var mobile = "mobile";
var ethernet = "ethernet";
var bluetooth = "bluetooth";
var vpn = "vpn";
function getConnectivityManager() {
    return application_1.getNativeApplication().getApplicationContext().getSystemService(android.content.Context.CONNECTIVITY_SERVICE);
}
function getActiveNetworkInfo() {
    var connectivityManager = getConnectivityManager();
    if (!connectivityManager) {
        return null;
    }
    return connectivityManager.getActiveNetworkInfo();
}
function getNetworkCapabilities() {
    var connectivityManager = getConnectivityManager();
    var network = connectivityManager.getActiveNetwork();
    var capabilities = connectivityManager.getNetworkCapabilities(network);
    if (capabilities == null) {
        return connectionType.none;
    }
    var NetworkCapabilities = android.net.NetworkCapabilities;
    if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
        return connectionType.wifi;
    }
    if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) {
        return connectionType.mobile;
    }
    if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)) {
        return connectionType.ethernet;
    }
    if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_BLUETOOTH)) {
        return connectionType.bluetooth;
    }
    if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_VPN)) {
        return connectionType.vpn;
    }
    return connectionType.none;
}
function getConnectionType() {
    if (android.os.Build.VERSION.SDK_INT >= 28) {
        return getNetworkCapabilities();
    }
    else {
        var activeNetworkInfo = getActiveNetworkInfo();
        if (!activeNetworkInfo || !activeNetworkInfo.isConnected()) {
            return connectionType.none;
        }
        var type = activeNetworkInfo.getTypeName().toLowerCase();
        if (type.indexOf(wifi) !== -1) {
            return connectionType.wifi;
        }
        if (type.indexOf(mobile) !== -1) {
            return connectionType.mobile;
        }
        if (type.indexOf(ethernet) !== -1) {
            return connectionType.ethernet;
        }
        if (type.indexOf(bluetooth) !== -1) {
            return connectionType.bluetooth;
        }
        if (type.indexOf(vpn) !== -1) {
            return connectionType.vpn;
        }
    }
    return connectionType.none;
}
exports.getConnectionType = getConnectionType;
function startMonitoringLegacy(connectionTypeChangedCallback) {
    var onReceiveCallback = function onReceiveCallback(context, intent) {
        var newConnectionType = getConnectionType();
        connectionTypeChangedCallback(newConnectionType);
    };
    var zoneCallback = zonedCallback(onReceiveCallback);
    application_1.android.registerBroadcastReceiver(android.net.ConnectivityManager.CONNECTIVITY_ACTION, zoneCallback);
}
var callback;
var networkCallback;
var notifyCallback;
function startMonitoring(connectionTypeChangedCallback) {
    if (android.os.Build.VERSION.SDK_INT >= 28) {
        var manager = getConnectivityManager();
        if (manager) {
            notifyCallback = function () {
                var newConnectionType = getConnectionType();
                var zoneCallback = zonedCallback(connectionTypeChangedCallback);
                zoneCallback(newConnectionType);
            };
            var ConnectivityManager = android.net.ConnectivityManager;
            if (!networkCallback) {
                networkCallback = ConnectivityManager.NetworkCallback.extend({
                    onAvailable: function (network) {
                        notifyCallback();
                    },
                    onCapabilitiesChanged: function (network, networkCapabilities) {
                        notifyCallback();
                    },
                    onLost: function (network) {
                        notifyCallback();
                    },
                    onUnavailable: function () {
                        notifyCallback();
                    }
                });
            }
            callback = new networkCallback();
            manager.registerDefaultNetworkCallback(callback);
        }
    }
    else {
        startMonitoringLegacy(connectionTypeChangedCallback);
    }
}
exports.startMonitoring = startMonitoring;
function stopMonitoring() {
    if (android.os.Build.VERSION.SDK_INT >= 28) {
        var manager = getConnectivityManager();
        if (manager && callback) {
            manager.unregisterNetworkCallback(callback);
            notifyCallback = null;
            callback = null;
        }
    }
    else {
        application_1.android.unregisterBroadcastReceiver(android.net.ConnectivityManager.CONNECTIVITY_ACTION);
    }
}
exports.stopMonitoring = stopMonitoring;
//# sourceMappingURL=connectivity.android.js.map