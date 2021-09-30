"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReadParams_1 = require("./ReadParams");
var QueryOptionsReadParams = (function (_super) {
    __extends(QueryOptionsReadParams, _super);
    function QueryOptionsReadParams(entitySetName, queryOptions) {
        var _this = _super.call(this, entitySetName) || this;
        _this.queryOptions = queryOptions;
        return _this;
    }
    QueryOptionsReadParams.prototype.getQueryOptions = function () {
        return this.queryOptions;
    };
    return QueryOptionsReadParams;
}(ReadParams_1.ReadParams));
exports.QueryOptionsReadParams = QueryOptionsReadParams;
