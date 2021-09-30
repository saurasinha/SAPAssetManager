"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReadParams_1 = require("./ReadParams");
var ChangeSetManager_1 = require("../ChangeSetManager");
var ReadLinkReadParams = (function (_super) {
    __extends(ReadLinkReadParams, _super);
    function ReadLinkReadParams(entitySetName, readLink) {
        var _this = _super.call(this, entitySetName) || this;
        _this.readLink = readLink;
        return _this;
    }
    ReadLinkReadParams.prototype.getReadLink = function () {
        return this.readLink;
    };
    ReadLinkReadParams.prototype.isTargetCreatedInSameChangeSet = function () {
        return this.readLink.startsWith(ChangeSetManager_1.ChangeSetManager.UNPROCESSEDPREFIX);
    };
    return ReadLinkReadParams;
}(ReadParams_1.ReadParams));
exports.ReadLinkReadParams = ReadLinkReadParams;
