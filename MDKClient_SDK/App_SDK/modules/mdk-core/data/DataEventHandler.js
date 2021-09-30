"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EvaluateTarget_1 = require("./EvaluateTarget");
var Logger_1 = require("../utils/Logger");
var app = require("tns-core-modules/application");
var DataEventHandler = (function () {
    function DataEventHandler() {
        this._changeSetActive = false;
        this._resultQueue = [];
        this._listeners = {};
    }
    DataEventHandler.getInstance = function () {
        if (!DataEventHandler.instance) {
            DataEventHandler.instance = new DataEventHandler();
        }
        return DataEventHandler.instance;
    };
    DataEventHandler.prototype.publish = function (action, result, notificationRegistry) {
        if (notificationRegistry === void 0) { notificationRegistry = new Set(); }
        if (this._changeSetActive) {
            this._resultQueue.push({ action: action, result: result });
            return;
        }
        if (action.type === 'Action.Type.OfflineOData.Initialize' ||
            action.type === 'Action.Type.OfflineOData.Upload' ||
            action.type === 'Action.Type.OfflineOData.CancelUpload' ||
            action.type === 'Action.Type.OfflineOData.Download' ||
            action.type === 'Action.Type.OfflineOData.CancelDownload' ||
            action.type === 'Action.Type.ODataService.Initialize' ||
            action.type === 'Action.Type.ODataService.Open' ||
            action.type === 'Action.Type.ODataService.CallFunction' ||
            action.type === 'Action.Type.RestService.SendRequest') {
            if (this._listeners[action.getService()]) {
                for (var _i = 0, _a = this._listeners[action.getService()]; _i < _a.length; _i++) {
                    var listener = _a[_i];
                    this.notifyListenerHelper(listener, action, result, notificationRegistry);
                }
            }
        }
        else {
            if (action.type.indexOf('Action.Type.RestService') !== -1) {
                return;
            }
            var actionEntitySet = action.getResolvedEntitySet();
            if (actionEntitySet) {
                if (this._listeners[actionEntitySet]) {
                    for (var _b = 0, _c = this._listeners[actionEntitySet]; _b < _c.length; _b++) {
                        var listener = _c[_b];
                        this.notifyListenerHelper(listener, action, result, notificationRegistry);
                    }
                }
            }
            if (app.ios && result instanceof NSArray) {
                for (var i = 0; i < result.count; i++) {
                    this.publishListenerForReadLink(action, result.objectAtIndex(i), notificationRegistry);
                }
            }
            else {
                this.publishListenerForReadLink(action, result, notificationRegistry);
            }
        }
    };
    DataEventHandler.prototype.subscribe = function (key, listener) {
        if (this._listeners[key]) {
            this._listeners[key].push(listener);
        }
        else {
            this._listeners[key] = [listener];
        }
    };
    DataEventHandler.prototype.unsubscribe = function (key, listener) {
        if (this._listeners[key]) {
            var index_1 = this._listeners[key].indexOf(listener);
            if (index_1 > -1) {
                this._listeners[key].splice(index_1, 1);
            }
        }
    };
    DataEventHandler.prototype.activateChangesetQueue = function () {
        this._changeSetActive = true;
    };
    DataEventHandler.prototype.resetChangesetQueue = function () {
        this._changeSetActive = false;
        this._resultQueue = [];
    };
    DataEventHandler.prototype.publishChangesetResults = function () {
        this._changeSetActive = false;
        var notificationRegistry = new Set();
        for (var _i = 0, _a = this._resultQueue; _i < _a.length; _i++) {
            var queuedResult = _a[_i];
            this.publish(queuedResult.action, queuedResult.result, notificationRegistry);
        }
        this._resultQueue = [];
    };
    DataEventHandler.prototype.notifyListenerHelper = function (listener, action, result, notificationRegistry) {
        if (!notificationRegistry.has(listener)) {
            listener.onDataChanged(action, result);
            notificationRegistry.add(listener);
        }
    };
    DataEventHandler.prototype.publishListenerForReadLink = function (action, result, notifiedListeners) {
        var readLink = EvaluateTarget_1.asReadLink(result);
        if (readLink) {
            var entitySet = readLink.substr(0, readLink.indexOf('('));
            if (this._listeners[readLink]) {
                for (var _i = 0, _a = this._listeners[readLink]; _i < _a.length; _i++) {
                    var listener = _a[_i];
                    this.notifyListenerHelper(listener, action, result, notifiedListeners);
                }
            }
            if (this._listeners[entitySet]) {
                for (var _b = 0, _c = this._listeners[entitySet]; _b < _c.length; _b++) {
                    var listener = _c[_b];
                    this.notifyListenerHelper(listener, action, result, notifiedListeners);
                }
            }
        }
    };
    DataEventHandler.prototype._debugDump = function () {
        var _this = this;
        var dump = "\nDataEventHandler Dump:";
        dump += "\n  _changeSetActive: " + this._changeSetActive;
        dump += "\n  _listeners: [";
        Object.keys(this._listeners).forEach(function (key) {
            dump += "\n    " + key + ": [";
            _this._listeners[key].forEach(function (listener) {
                dump += "\n      " + listener.constructor.name + " - " + listener.debugString;
            });
            dump += "\n    ]";
        });
        dump += "\n  ]";
        Logger_1.Logger.instance.odata.log(dump);
    };
    return DataEventHandler;
}());
exports.DataEventHandler = DataEventHandler;
