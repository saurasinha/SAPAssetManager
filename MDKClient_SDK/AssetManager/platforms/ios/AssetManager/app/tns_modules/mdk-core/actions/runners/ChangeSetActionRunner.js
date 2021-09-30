"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionRunner_1 = require("./ActionRunner");
var ActionResultBuilder_1 = require("../../builders/actions/ActionResultBuilder");
var EventHandler_1 = require("../../EventHandler");
var IDataService_1 = require("../../data/IDataService");
var DataEventHandler_1 = require("../../data/DataEventHandler");
var EvaluateTarget_1 = require("../../data/EvaluateTarget");
var ChangeSetActionRunner = (function (_super) {
    __extends(ChangeSetActionRunner, _super);
    function ChangeSetActionRunner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangeSetActionRunner.prototype.run = function (action) {
        var _this = this;
        this._source = action.source;
        return this._showIndicator(action).then(function () {
            var definition = action.definition;
            _this._servicePromise = EvaluateTarget_1.asService(definition.data, action.context());
            var changeSetCancelled = false;
            DataEventHandler_1.DataEventHandler.getInstance().activateChangesetQueue();
            var returnResult;
            return _this._beginChangeSet().then(function () {
                returnResult = _this._processChangeSets(definition.actions);
                return returnResult;
            }).then(function () {
                returnResult = _this._commitChangeSet(action);
                return returnResult;
            }).catch(function (error) {
                changeSetCancelled = true;
                returnResult = _this._cancelChangeSet(action, error);
                return returnResult;
            })
                .then(function (result) {
                _this._dismissIndicator(action);
                if (!changeSetCancelled) {
                    DataEventHandler_1.DataEventHandler.getInstance().publishChangesetResults();
                }
                return returnResult;
            });
        });
    };
    ChangeSetActionRunner.prototype._processChangeSets = function (changeSets) {
        var _this = this;
        var index = 0;
        var nextChangeSet = function () {
            if (index < changeSets.length) {
                var changeSetAction = changeSets[index++];
                return _this._processChangeSet(changeSetAction).then(function (result) {
                    return nextChangeSet();
                });
            }
            return Promise.resolve();
        };
        return nextChangeSet();
    };
    ChangeSetActionRunner.prototype._processChangeSet = function (action) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    var eventHandler = new EventHandler_1.EventHandler();
                    eventHandler.setEventSource(_this._source);
                    return resolve(eventHandler.executeAction(action));
                }
                catch (error) {
                    return reject(error);
                }
            }, 100);
        });
    };
    ChangeSetActionRunner.prototype._beginChangeSet = function () {
        return this._servicePromise.then(function (service) {
            return IDataService_1.IDataService.instance().beginChangeSet(service).then(function () {
                return new ActionResultBuilder_1.ActionResultBuilder().build();
            });
        });
    };
    ChangeSetActionRunner.prototype._cancelChangeSet = function (action, error) {
        var _this = this;
        return this._servicePromise.then(function (service) {
            return IDataService_1.IDataService.instance().cancelChangeSet(service).then(function (result) {
                DataEventHandler_1.DataEventHandler.getInstance().resetChangesetQueue();
                return _this._runFailure(action);
            });
        });
    };
    ChangeSetActionRunner.prototype._commitChangeSet = function (action) {
        var _this = this;
        return this._servicePromise.then(function (service) {
            return IDataService_1.IDataService.instance().commitChangeSet(service).then(function (result) {
                return _this._runSuccess(action);
            });
        });
    };
    return ChangeSetActionRunner;
}(ActionRunner_1.ActionRunner));
exports.ChangeSetActionRunner = ChangeSetActionRunner;
