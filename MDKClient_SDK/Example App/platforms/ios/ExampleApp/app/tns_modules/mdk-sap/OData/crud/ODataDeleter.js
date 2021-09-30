"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseODataCruder_1 = require("./BaseODataCruder");
var ReadService_1 = require("./ReadService");
var ReadParamsFactory_1 = require("./ReadParamsFactory");
var ODataHelper_1 = require("../ODataHelper");
var ODataDeleter = (function (_super) {
    __extends(ODataDeleter, _super);
    function ODataDeleter(params) {
        var _this = _super.call(this, params) || this;
        _this.setTargetReadParams();
        return _this;
    }
    ODataDeleter.prototype.execute = function (dataService, changeSetManager) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.setChangeSetManager(changeSetManager);
            var entityToDelete = ReadService_1.ReadService.entityFromParams(_this.targetReadParams, dataService, _this.changeSetManager);
            var options = ODataHelper_1.ODataHelper.getRequestOptions(_this.requestOptionsParm, dataService);
            _this.changeSetManager.deleteEntity(entityToDelete, _this.headers, options).then(function () {
                resolve(ODataHelper_1.ODataHelper.entityValueToJson(entityToDelete, _this.getDataContext(dataService)));
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    ODataDeleter.prototype.setTargetReadParams = function () {
        this.targetReadParams = ReadParamsFactory_1.ReadParamsFactory.createReadParams(this.service);
    };
    return ODataDeleter;
}(BaseODataCruder_1.BaseODataCruder));
exports.ODataDeleter = ODataDeleter;
