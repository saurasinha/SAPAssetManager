Object.defineProperty(exports, "__esModule", { value: true });
var connectionType;
(function (connectionType) {
    connectionType[connectionType["none"] = 0] = "none";
    connectionType[connectionType["wifi"] = 1] = "wifi";
    connectionType[connectionType["mobile"] = 2] = "mobile";
    connectionType[connectionType["ethernet"] = 3] = "ethernet";
    connectionType[connectionType["bluetooth"] = 4] = "bluetooth";
    connectionType[connectionType["vpn"] = 5] = "vpn";
})(connectionType = exports.connectionType || (exports.connectionType = {}));
function _createReachability(host) {
    if (host) {
        return SCNetworkReachabilityCreateWithName(null, host);
    }
    else {
        var zeroAddress = new interop.Reference(sockaddr, {
            sa_len: 16,
            sa_family: 2
        });
        return SCNetworkReachabilityCreateWithAddress(null, zeroAddress);
    }
}
function _getReachabilityFlags(host) {
    var reachability = _createReachability(host);
    var flagsRef = new interop.Reference();
    var gotFlags = SCNetworkReachabilityGetFlags(reachability, flagsRef);
    if (!gotFlags) {
        return null;
    }
    return flagsRef.value;
}
function _getConnectionType(host) {
    var flags = _getReachabilityFlags(host);
    return _getConnectionTypeFromFlags(flags);
}
function _getConnectionTypeFromFlags(flags) {
    if (!flags) {
        return connectionType.none;
    }
    var isReachable = flags & 2;
    var connectionRequired = flags & 4;
    if (!isReachable || connectionRequired) {
        return connectionType.none;
    }
    var isWWAN = flags & 262144;
    if (isWWAN) {
        return connectionType.mobile;
    }
    var cfDict = CFNetworkCopySystemProxySettings();
    var nsDict = cfDict.takeUnretainedValue();
    var keys = nsDict.objectForKey("__SCOPED__");
    if (isVPNConnected(keys)) {
        return connectionType.vpn;
    }
    if (isBluetoothConnected(keys)) {
        return connectionType.bluetooth;
    }
    return connectionType.wifi;
}
function isBluetoothConnected(keys) {
    if (!keys) {
        return false;
    }
    var allKeys = keys.allKeys;
    var size = allKeys.count;
    var isBlueTooth = false;
    for (var i = 0; i < size; i++) {
        var key = allKeys.objectAtIndex(i);
        if (key === "en4") {
            isBlueTooth = true;
            break;
        }
    }
    return isBlueTooth;
}
function isVPNConnected(keys) {
    if (!keys) {
        return false;
    }
    var allKeys = keys.allKeys;
    var size = allKeys.count;
    var isVPN = false;
    for (var i = 0; i < size; i++) {
        var key = allKeys.objectAtIndex(i);
        if (key === "tap" ||
            key === "tun" ||
            key === "ppp" ||
            key === "ipsec" ||
            key === "ipsec0" ||
            key === "utun1") {
            isVPN = true;
            break;
        }
    }
    return isVPN;
}
function getConnectionType() {
    return _getConnectionType();
}
exports.getConnectionType = getConnectionType;
function _reachabilityCallback(target, flags, info) {
    if (_connectionTypeChangedCallback) {
        var newConnectionType = _getConnectionTypeFromFlags(flags);
        _connectionTypeChangedCallback(newConnectionType);
    }
}
var _reachabilityCallbackFunctionRef = new interop.FunctionReference(_reachabilityCallback);
var _monitorReachabilityRef;
var _connectionTypeChangedCallback;
function startMonitoring(connectionTypeChangedCallback) {
    if (!_monitorReachabilityRef) {
        _monitorReachabilityRef = _createReachability();
        _connectionTypeChangedCallback = zonedCallback(connectionTypeChangedCallback);
        SCNetworkReachabilitySetCallback(_monitorReachabilityRef, _reachabilityCallbackFunctionRef, null);
        SCNetworkReachabilityScheduleWithRunLoop(_monitorReachabilityRef, CFRunLoopGetCurrent(), kCFRunLoopDefaultMode);
        _connectionTypeChangedCallback(_getConnectionType());
    }
}
exports.startMonitoring = startMonitoring;
function stopMonitoring() {
    if (_monitorReachabilityRef) {
        SCNetworkReachabilityUnscheduleFromRunLoop(_monitorReachabilityRef, CFRunLoopGetCurrent(), kCFRunLoopDefaultMode);
        _monitorReachabilityRef = undefined;
        _connectionTypeChangedCallback = undefined;
    }
}
exports.stopMonitoring = stopMonitoring;
//# sourceMappingURL=connectivity.ios.js.map