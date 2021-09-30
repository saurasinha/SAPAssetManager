"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SearchBuilder_1 = require("../builders/ui/search/SearchBuilder");
var QueryOptions = (function () {
    function QueryOptions(queryString) {
        if (queryString === void 0) { queryString = ''; }
        this._queryOptions = {};
        this._searchKeys = {};
        for (var _i = 0, _a = queryString.split('&'); _i < _a.length; _i++) {
            var queryOption = _a[_i];
            if (queryOption.length) {
                var queryOptionNameAndValue = queryOption.split('=');
                var queryOptionName = queryOptionNameAndValue.shift();
                var queryOptionValue = queryOptionNameAndValue.join('=');
                if (queryOptionName && queryOptionValue) {
                    if (queryOptionName === QueryOptions.FILTER_OPTION_NAME) {
                        this._queryOptions[queryOptionName] = decodeURIComponent(queryOptionValue);
                    }
                    else {
                        this._queryOptions[queryOptionName] = queryOptionValue;
                    }
                }
            }
        }
    }
    QueryOptions.prototype.addFilter = function (filter) {
        if (!this.usesFilter()) {
            this._queryOptions[QueryOptions.FILTER_OPTION_NAME] = filter;
        }
        else {
            var currentFilter = this._queryOptions[QueryOptions.FILTER_OPTION_NAME];
            this._queryOptions[QueryOptions.FILTER_OPTION_NAME] = "((" + currentFilter + ") and " + filter + ")";
        }
    };
    QueryOptions.prototype.addOrderBy = function (orderBy) {
        if (!this.usesOrderBy()) {
            this._queryOptions[QueryOptions.ORDERBY_OPTION_NAME] = orderBy;
        }
        else {
            var currentOrderBy = this._queryOptions[QueryOptions.ORDERBY_OPTION_NAME];
            this._queryOptions[QueryOptions.ORDERBY_OPTION_NAME] = [currentOrderBy, orderBy].join(',');
        }
    };
    QueryOptions.prototype.setOrderBy = function (orderBy) {
        this._queryOptions[QueryOptions.ORDERBY_OPTION_NAME] = orderBy;
    };
    QueryOptions.prototype.addSearchQuery = function (searchKey, searchString) {
        if (searchKey && searchString) {
            var listOfSubstrings = [searchString];
            if (searchString.includes(' ')) {
                listOfSubstrings = [];
                var substrings = searchString.split(/\ +/);
                for (var _i = 0, substrings_1 = substrings; _i < substrings_1.length; _i++) {
                    var substring = substrings_1[_i];
                    if (substring) {
                        listOfSubstrings.push(substring);
                    }
                }
            }
            if (listOfSubstrings.length > 0) {
                this._searchKeys[searchKey] = listOfSubstrings;
            }
        }
    };
    QueryOptions.prototype.getQueryString = function (service) {
        var options = [];
        var sortedOptionNames = Object.keys(this._queryOptions).sort();
        for (var _i = 0, sortedOptionNames_1 = sortedOptionNames; _i < sortedOptionNames_1.length; _i++) {
            var optionName = sortedOptionNames_1[_i];
            if (optionName !== QueryOptions.FILTER_OPTION_NAME) {
                var optionValue = this._queryOptions[optionName];
                options.push([optionName, optionValue].join('='));
            }
        }
        var filterOption = this._createFilterOption(service);
        if (filterOption) {
            options.push(this._encodeQueryString(filterOption));
        }
        return options.join('&');
    };
    QueryOptions.prototype.getFilter = function () {
        return this._queryOptions[QueryOptions.FILTER_OPTION_NAME];
    };
    QueryOptions.prototype.getOrderBy = function () {
        var result = this._queryOptions[QueryOptions.ORDERBY_OPTION_NAME];
        if (result) {
            result = result.split(',')[0].trim().split(/[ \t]/)[0];
        }
        return result;
    };
    QueryOptions.prototype.getTop = function () {
        if (this.usesTop()) {
            return +this._queryOptions[QueryOptions.TOP_OPTION_NAME];
        }
        return undefined;
    };
    QueryOptions.prototype.getSkip = function () {
        if (this.usesSkip()) {
            return +this._queryOptions[QueryOptions.SKIP_OPTION_NAME];
        }
        return undefined;
    };
    QueryOptions.prototype.setFilter = function (filter) {
        this._queryOptions[QueryOptions.FILTER_OPTION_NAME] = filter;
    };
    QueryOptions.prototype.setSkip = function (skip) {
        if (typeof skip === 'number') {
            this._queryOptions[QueryOptions.SKIP_OPTION_NAME] = skip;
        }
    };
    QueryOptions.prototype.setTop = function (top) {
        if (typeof top === 'number') {
            this._queryOptions[QueryOptions.TOP_OPTION_NAME] = top;
        }
    };
    QueryOptions.prototype.usesFilter = function () {
        return this._queryOptions[QueryOptions.FILTER_OPTION_NAME] !== undefined;
    };
    QueryOptions.prototype.usesOrderBy = function () {
        return this._queryOptions[QueryOptions.ORDERBY_OPTION_NAME] !== undefined;
    };
    QueryOptions.prototype.usesTop = function () {
        return this._queryOptions[QueryOptions.TOP_OPTION_NAME] !== undefined;
    };
    QueryOptions.prototype.usesSkip = function () {
        return this._queryOptions[QueryOptions.SKIP_OPTION_NAME] !== undefined;
    };
    QueryOptions.prototype._createFilterOption = function (service) {
        if (!this._usesSearch()) {
            if (this.usesFilter()) {
                return [QueryOptions.FILTER_OPTION_NAME, this._queryOptions[QueryOptions.FILTER_OPTION_NAME]].join('=');
            }
            else {
                return '';
            }
        }
        else {
            var searchBuilder = SearchBuilder_1.builderFactory(service, this._searchKeys);
            if (!this.usesFilter()) {
                return [QueryOptions.FILTER_OPTION_NAME, searchBuilder.build()].join('=');
            }
            else {
                var filterOptionValue = "(" + this._queryOptions[QueryOptions.FILTER_OPTION_NAME] + ")";
                var filterAndSearchOption = "(" + [filterOptionValue, searchBuilder.build()].join(' and ') + ")";
                return [QueryOptions.FILTER_OPTION_NAME, filterAndSearchOption].join('=');
            }
        }
    };
    QueryOptions.prototype._usesSearch = function () {
        return Object.keys(this._searchKeys).length > 0;
    };
    QueryOptions.prototype._encodeQueryString = function (filterOption) {
        var substrings = filterOption.split(/('(?:\\'|[^'])*')/);
        var encodedQuery = '';
        for (var i = 0; i < substrings.length; i++) {
            if (i % 2 === 0) {
                encodedQuery = encodedQuery + encodeURI(substrings[i]);
            }
            else {
                encodedQuery = encodedQuery + encodeURIComponent(substrings[i]);
            }
        }
        return encodedQuery;
    };
    QueryOptions.FILTER_OPTION_NAME = '$filter';
    QueryOptions.ORDERBY_OPTION_NAME = '$orderby';
    QueryOptions.SKIP_OPTION_NAME = '$skip';
    QueryOptions.TOP_OPTION_NAME = '$top';
    return QueryOptions;
}());
exports.QueryOptions = QueryOptions;
