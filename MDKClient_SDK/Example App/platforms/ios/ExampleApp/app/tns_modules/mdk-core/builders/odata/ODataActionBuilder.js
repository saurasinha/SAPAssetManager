"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../BaseDataBuilder");
var ODataActionBuilder = (function (_super) {
    __extends(ODataActionBuilder, _super);
    function ODataActionBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.doNotResolveKeys = {};
        return _this;
    }
    ODataActionBuilder.prototype.build = function () {
        return _super.prototype.build.call(this).then(function (data) {
            return data;
        });
    };
    ODataActionBuilder.prototype.setIsOnlineRequest = function (isOnlineRequest) {
        this.data.isOnlineRequest = isOnlineRequest;
        return this;
    };
    ODataActionBuilder.prototype.setForce = function (force) {
        this.data.force = force;
        return this;
    };
    ODataActionBuilder.prototype.setMedia = function (media) {
        this.data.media = media;
        return this;
    };
    ODataActionBuilder.prototype.setQueryOptions = function (queryOptions) {
        this.data.Target.queryOptions = queryOptions;
        return this;
    };
    ODataActionBuilder.prototype.setService = function (service) {
        this.data.service = service;
        return this;
    };
    ODataActionBuilder.prototype.setProperties = function (properties) {
        this.data.properties = Object.assign({}, properties || {});
        return this;
    };
    ODataActionBuilder.prototype.setProgressText = function (progressText) {
        this.data.progressText = progressText;
        return this;
    };
    ODataActionBuilder.prototype.setShowActivityIndicator = function (showActivityIndicator) {
        this.data.showActivityIndicator = showActivityIndicator;
        return this;
    };
    ODataActionBuilder.prototype.setActionResult = function (actionResult) {
        if (actionResult === undefined) {
            this.data.actionResult = undefined;
        }
        else {
            this.data.actionResult = Object.assign({}, actionResult);
        }
        return this;
    };
    ODataActionBuilder.prototype.setUploadCategories = function (uploadCategories) {
        this.data.uploadCategories = uploadCategories;
        return this;
    };
    return ODataActionBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.ODataActionBuilder = ODataActionBuilder;
