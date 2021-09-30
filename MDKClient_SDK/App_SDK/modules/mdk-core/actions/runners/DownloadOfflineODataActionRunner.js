"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionRunner_1 = require("./ActionRunner");
var ActionResultBuilder_1 = require("../../builders/actions/ActionResultBuilder");
var ClientEnums_1 = require("../../ClientEnums");
var AppSettingsManager_1 = require("../../utils/AppSettingsManager");
var DownloadOfflineODataActionRunner = (function () {
    function DownloadOfflineODataActionRunner() {
        this._downloadResults = [];
        this._pendingDownloads = [];
        this._processingDownloads = false;
        if (DownloadOfflineODataActionRunner._instance) {
            throw new Error('Error: Instantiation failed. Use getInstance() instead of new.');
        }
        DownloadOfflineODataActionRunner._instance = this;
    }
    DownloadOfflineODataActionRunner.getInstance = function () {
        return DownloadOfflineODataActionRunner._instance;
    };
    DownloadOfflineODataActionRunner.prototype.run = function (action) {
        this._pendingDownloads.push(action);
        return this._processDownloads();
    };
    DownloadOfflineODataActionRunner.prototype._processDownloads = function () {
        var _this = this;
        var nextDownload = function () {
            var downloadAction = _this._pendingDownloads.shift();
            if (downloadAction) {
                _this._processingDownloads = true;
                return _this._runAction(downloadAction).then(function (result) {
                    _this._downloadResults.push(result);
                    return nextDownload();
                });
            }
            return Promise.resolve();
        };
        return nextDownload().then(function () {
            _this._processingDownloads = false;
            var aResult = new ActionResultBuilder_1.ActionResultBuilder().build();
            if (_this._downloadResults && _this._downloadResults.length > 0) {
                aResult = _this._downloadResults[0];
            }
            _this._downloadResults = [];
            if (aResult && aResult.status && aResult.status === ClientEnums_1.ActionExecutionStatus.Failed) {
                return Promise.reject(aResult.data);
            }
            return aResult;
        });
    };
    DownloadOfflineODataActionRunner.prototype._runAction = function (action) {
        var aRunner = new ActionRunner_1.ActionRunner();
        var downloadAction = action;
        return aRunner.run(downloadAction).then(function (result) {
            if (downloadAction.pendingReadLink()) {
                AppSettingsManager_1.AppSettingsManager.instance().removePendingAction(downloadAction.pendingReadLink());
            }
            return result;
        }).catch(function (error) {
            if (downloadAction.pendingReadLink()) {
                AppSettingsManager_1.AppSettingsManager.instance().removePendingAction(downloadAction.pendingReadLink());
            }
            return new ActionResultBuilder_1.ActionResultBuilder().failed().data(error.message).build();
        });
    };
    DownloadOfflineODataActionRunner._instance = new DownloadOfflineODataActionRunner();
    return DownloadOfflineODataActionRunner;
}());
exports.DownloadOfflineODataActionRunner = DownloadOfflineODataActionRunner;
