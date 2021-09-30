"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("../../../utils/Logger");
var IDataService_1 = require("../../../data/IDataService");
var ODATA_V4 = 400;
var BaseSearchBuilder = (function () {
    function BaseSearchBuilder(searchKeys, serviceName) {
        this._searchKeys = searchKeys;
        this._serviceName = serviceName;
    }
    BaseSearchBuilder.prototype.build = function () {
        var _this = this;
        if (!this._searchKeys) {
            Logger_1.Logger.instance.ui.log("Unable to process searchKeys " + this._searchKeys);
            return '';
        }
        var sortedSearchKeys = Object.keys(this._searchKeys).sort();
        var searches = sortedSearchKeys.map(function (searchKey) {
            var searchStrings = _this._searchKeys[searchKey];
            var searchTerms = searchStrings.map(function (substring) {
                return _this.buildSearchSubString(substring, searchKey);
            });
            return searchTerms.join(' and ');
        });
        return this.buildSearchString(searches);
    };
    BaseSearchBuilder.prototype.escapeSingleQuoteString = function (str) {
        return str ? str.replace('\'', '\\\'') : str;
    };
    return BaseSearchBuilder;
}());
var OfflineSearchBuilder = (function (_super) {
    __extends(OfflineSearchBuilder, _super);
    function OfflineSearchBuilder(searchKeys, serviceName) {
        return _super.call(this, searchKeys, serviceName) || this;
    }
    OfflineSearchBuilder.prototype.buildSearchString = function (searches) {
        var searchString = searches.join(' or ');
        if (searches.length > 1) {
            searchString = "(" + searchString + ")";
        }
        return searchString;
    };
    OfflineSearchBuilder.prototype.buildSearchSubString = function (searchString, searchKey) {
        return "substringof(tolower('" + this.escapeSingleQuoteString(searchString) + "'), tolower(" + searchKey + "))";
    };
    return OfflineSearchBuilder;
}(BaseSearchBuilder));
exports.OfflineSearchBuilder = OfflineSearchBuilder;
var OnlineSearchBuilder = (function (_super) {
    __extends(OnlineSearchBuilder, _super);
    function OnlineSearchBuilder(searchKeys, serviceName) {
        return _super.call(this, searchKeys, serviceName) || this;
    }
    OnlineSearchBuilder.prototype.buildSearchString = function (searches) {
        var searchString = searches.join(' or ');
        if (searches.length > 1) {
            searchString = "(" + searchString + ")";
        }
        return searchString;
    };
    OnlineSearchBuilder.prototype.buildSearchSubString = function (searchString, searchKey) {
        if (this._serviceName && IDataService_1.IDataService.instance().getVersion(this._serviceName) >= ODATA_V4) {
            return "contains(" + searchKey + ",'" + this.escapeSingleQuoteString(searchString) + "')";
        }
        else {
            return "substringof('" + this.escapeSingleQuoteString(searchString) + "', " + searchKey + ")";
        }
    };
    return OnlineSearchBuilder;
}(BaseSearchBuilder));
exports.OnlineSearchBuilder = OnlineSearchBuilder;
function builderFactory(service, searchKeys, serviceName) {
    return service.offlineEnabled ? new OfflineSearchBuilder(searchKeys, serviceName) : new OnlineSearchBuilder(searchKeys, serviceName);
}
exports.builderFactory = builderFactory;
