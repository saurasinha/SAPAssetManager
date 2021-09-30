"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../BaseDataBuilder");
var SearchBuilder_1 = require("../../builders/ui/search/SearchBuilder");
var SortOrder;
(function (SortOrder) {
    SortOrder["Ascending"] = "asc";
    SortOrder["Descending"] = "desc";
})(SortOrder = exports.SortOrder || (exports.SortOrder = {}));
;
;
var FilterBuilder = (function (_super) {
    __extends(FilterBuilder, _super);
    function FilterBuilder(context) {
        var terms = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            terms[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, context) || this;
        if (terms.length > 0) {
            _this.addTerm.apply(_this, __spreadArrays([FilterBuilder._filterTerm, undefined, undefined], terms));
        }
        return _this;
    }
    Object.defineProperty(FilterBuilder.prototype, "terms", {
        get: function () {
            return this._terms ? Array.from(this._terms.values()) : [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilterBuilder.prototype, "debugString", {
        get: function () {
            return this.composeFilterString(this, true);
        },
        enumerable: true,
        configurable: true
    });
    FilterBuilder.prototype.and = function () {
        var terms = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            terms[_i] = arguments[_i];
        }
        this.addTerm.apply(this, __spreadArrays(['and', undefined, undefined], terms));
        return this;
    };
    FilterBuilder.prototype.equal = function (property, rhs) {
        return this.addTerm('eq', property, rhs);
    };
    FilterBuilder.prototype.greaterThan = function (property, rhs) {
        return this.addTerm('gt', property, rhs);
    };
    FilterBuilder.prototype.lessThan = function (property, rhs) {
        return this.addTerm('lt', property, rhs);
    };
    FilterBuilder.prototype.lessThanOrEqual = function (property, rhs) {
        return this.addTerm('le', property, rhs);
    };
    FilterBuilder.prototype.not = function () {
        var terms = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            terms[_i] = arguments[_i];
        }
        return this.addTerm.apply(this, __spreadArrays(['not', undefined, undefined], terms));
    };
    FilterBuilder.prototype.notEqual = function (property, rhs) {
        return this.addTerm('ne', property, rhs);
    };
    FilterBuilder.prototype.or = function () {
        var terms = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            terms[_i] = arguments[_i];
        }
        return this.addTerm.apply(this, __spreadArrays(['or', undefined, undefined], terms));
    };
    FilterBuilder.prototype.build = function () {
        var _this = this;
        this.ensureTerms();
        this.data.terms = Object.assign([], this.terms);
        return _super.prototype.build.call(this).then(function (builtData) {
            return _this.composeFilterString(builtData);
        });
    };
    FilterBuilder.prototype.createFilterTerm = function (term) {
        var termProperty = term.property ? term.property + ' ' : '';
        var termOperator = (term.op && term.op !== FilterBuilder._filterTerm) ? term.op + ' ' : '';
        var termRHS = term.rhs || '';
        return "" + termProperty + termOperator + termRHS;
    };
    FilterBuilder.prototype.beginGroupTerm = function (term, filter) {
        if (term.group.length > 1) {
            filter += '(';
        }
        return filter;
    };
    FilterBuilder.prototype.endGroupTerm = function (term, filter) {
        if (term.group.length > 1) {
            filter += ')';
        }
        return filter;
    };
    FilterBuilder.prototype.addTerm = function (op, property, rhs) {
        if (property === void 0) { property = undefined; }
        if (rhs === void 0) { rhs = undefined; }
        var terms = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            terms[_i - 3] = arguments[_i];
        }
        this._terms = this._terms || new Set();
        var term = this.createTerm.apply(this, __spreadArrays([op, property, rhs], terms));
        this._terms.add(term);
        return this;
    };
    FilterBuilder.prototype.createTerm = function (op, property, rhs) {
        var terms = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            terms[_i - 3] = arguments[_i];
        }
        var term = {
            group: [],
            op: op,
            property: property,
            rhs: rhs,
        };
        terms.forEach(function (groupTerm) {
            term.group.push(groupTerm);
        });
        return term;
    };
    FilterBuilder.prototype.ensureTerms = function () {
        this.data.terms = this.data.terms || [];
    };
    FilterBuilder.prototype.composeFilterString = function (sourceData, forDebugging) {
        var _this = this;
        if (forDebugging === void 0) { forDebugging = false; }
        var filterString = '';
        if (sourceData.terms && sourceData.terms.length > 0) {
            sourceData.terms.forEach(function (term) {
                if (term.group.length > 0) {
                    filterString = _this.beginGroupTerm(term, filterString);
                    term.group.forEach(function (groupTerm, index) {
                        if (filterString.length === 0 && term.op !== FilterBuilder._filterTerm) {
                            filterString += term.op + " ";
                        }
                        else if (filterString.length !== 0 && (term.group.length === 1 || index > 0)) {
                            filterString += " " + term.op + " ";
                        }
                        if (forDebugging) {
                            filterString += groupTerm instanceof FilterBuilder ? groupTerm.debugString : groupTerm;
                        }
                        else {
                            filterString += groupTerm;
                        }
                        filterString += _this.createFilterTerm(groupTerm);
                    });
                    filterString = _this.endGroupTerm(term, filterString);
                }
                else {
                    if (filterString.length > 0 && !filterString.endsWith(' ')) {
                        filterString += ' ';
                    }
                    filterString += _this.createFilterTerm(term);
                }
            });
        }
        return filterString;
    };
    FilterBuilder._filterTerm = 'filter';
    return FilterBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.FilterBuilder = FilterBuilder;
var MDKSearchBuilder = (function (_super) {
    __extends(MDKSearchBuilder, _super);
    function MDKSearchBuilder(context, terms, searchString) {
        var _this = _super.apply(this, __spreadArrays([context], terms)) || this;
        _this._searchKeys = {};
        _this._searchString = searchString;
        _this._subStrings = [_this._searchString];
        if (_this._searchString.includes(' ')) {
            _this._subStrings = [];
            var substrings = _this._searchString.split(/\ +/);
            for (var _i = 0, substrings_1 = substrings; _i < substrings_1.length; _i++) {
                var substring = substrings_1[_i];
                if (substring) {
                    _this._subStrings.push(substring);
                }
            }
        }
        return _this;
    }
    Object.defineProperty(MDKSearchBuilder.prototype, "debugString", {
        get: function () {
            return "MDKSearch(\"" + this._searchString + "\")";
        },
        enumerable: true,
        configurable: true
    });
    MDKSearchBuilder.prototype.build = function () {
        var _this = this;
        var searchKeys = this.searchContext.searchKeys || [];
        searchKeys.forEach(function (searchKey) {
            if (_this._subStrings.length > 0) {
                _this._searchKeys[searchKey] = _this._subStrings;
            }
        });
        var searchBuilder = SearchBuilder_1.builderFactory(this.searchContext.service, this._searchKeys, this.searchContext.serviceName);
        return Promise.resolve(searchBuilder.build());
    };
    Object.defineProperty(MDKSearchBuilder.prototype, "searchContext", {
        get: function () {
            return this._context.searchContext || {};
        },
        enumerable: true,
        configurable: true
    });
    return MDKSearchBuilder;
}(FilterBuilder));
exports.MDKSearchBuilder = MDKSearchBuilder;
var DataQueryBuilder = (function (_super) {
    __extends(DataQueryBuilder, _super);
    function DataQueryBuilder(context, queryOptions) {
        if (queryOptions === void 0) { queryOptions = ''; }
        var _this = _super.call(this, context) || this;
        if (queryOptions.length > 0) {
            _this._parseQueryOptions(queryOptions);
        }
        return _this;
    }
    Object.defineProperty(DataQueryBuilder.prototype, "expandOption", {
        get: function () {
            return this._expandOption ? Array.from(this._expandOption.values()) : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "filterOption", {
        get: function () {
            return this._filterOption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "orderByOption", {
        get: function () {
            return this._orderByOption ? Array.from(this._orderByOption.values()) : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "originalQueryOptions", {
        get: function () {
            return this._originalQueryOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "selectOption", {
        get: function () {
            return this._selectOption ? Array.from(this._selectOption.values()) : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "skipOption", {
        get: function () {
            return this._skipOption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "skipTokenOption", {
        get: function () {
            return this._skipTokenOption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "topOption", {
        get: function () {
            return this._topOption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "userFilter", {
        get: function () {
            return this.searchContext.filter || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "userOrderBy", {
        get: function () {
            return this.searchContext.orderBy || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "hasExpand", {
        get: function () {
            return this._expandOption !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "hasFilter", {
        get: function () {
            return this._filterOption !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "hasMDKSearch", {
        get: function () {
            return this._mdkSearch !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "hasOrderBy", {
        get: function () {
            return this._orderByOption !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "hasSelect", {
        get: function () {
            return this._selectOption !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "hasSkip", {
        get: function () {
            return this._skipOption !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "hasSkipToken", {
        get: function () {
            return this._skipTokenOption !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "hasTop", {
        get: function () {
            return this._topOption !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataQueryBuilder.prototype, "debugString", {
        get: function () {
            var debugComponents = ['\n'];
            debugComponents.push("- EXPAND:  " + (this.hasExpand ? this.expandOption.join(', ') : '-'));
            debugComponents.push("- ORDERBY: " + (this.hasOrderBy ? this.orderByOption.join(', ') : '-'));
            debugComponents.push("- SELECT:  " + (this.hasSelect ? this.selectOption.join(', ') : '-'));
            debugComponents.push("- TOP:     " + (this.hasTop ? this.topOption : '-'));
            debugComponents.push("- SKIP:    " + (this.hasSkip ? this.skipOption : '-'));
            debugComponents.push("- FILTER:  " + (this.hasFilter ? this.filterOption.debugString : '-'));
            debugComponents.push("- SKIPTOKEN: " + (this.hasSkipToken ? this.skipTokenOption : '-'));
            return debugComponents.join('\n');
        },
        enumerable: true,
        configurable: true
    });
    DataQueryBuilder.prototype.build = function () {
        var _this = this;
        this.data.expandItems = this.expandOption;
        this.data.filter = this.filterOption;
        if (this.orderByOption) {
            this.data.orderBy = this.orderByOption.map(function (orderByOption) {
                var sortOrder = undefined;
                var orderBySegments = orderByOption.split(' ');
                if (orderBySegments.length === 2) {
                    sortOrder = orderBySegments[1];
                }
                return ({ property: orderBySegments[0], sortOrder: sortOrder });
            });
        }
        this.data.selectItems = this.selectOption;
        this.data.skip = this.skipOption;
        this.data.top = this.topOption;
        this.data.skipToken = this.skipTokenOption;
        return _super.prototype.build.call(this).then(function (builtData) {
            if (builtData.query) {
                return builtData.query;
            }
            else {
                var query = '';
                if (builtData.selectItems && builtData.selectItems.length > 0) {
                    query += "$" + DataQueryBuilder.systemQueryOptions.Select + "=";
                    query += builtData.selectItems.join(',');
                    query += '&';
                }
                if (builtData.expandItems && builtData.expandItems.length > 0) {
                    query += "$" + DataQueryBuilder.systemQueryOptions.Expand + "=";
                    query += builtData.expandItems.join(',');
                    query += '&';
                }
                if (builtData.orderBy && builtData.orderBy.length > 0) {
                    query += "$" + DataQueryBuilder.systemQueryOptions.OrderBy + "=";
                    var orderByTerms = builtData.orderBy.map(function (orderByTerm) {
                        if (orderByTerm.sortOrder) {
                            return orderByTerm.property + " " + orderByTerm.sortOrder;
                        }
                        else {
                            return "" + orderByTerm.property;
                        }
                    });
                    query += orderByTerms.join(',');
                    query += '&';
                }
                if (builtData.skip) {
                    query += "$" + DataQueryBuilder.systemQueryOptions.Skip + "=" + builtData.skip;
                    query += '&';
                }
                else if (builtData.skipToken) {
                    query += "$" + builtData.skipToken;
                    query += '&';
                }
                if (builtData.top) {
                    query += "$" + DataQueryBuilder.systemQueryOptions.Top + "=" + builtData.top;
                    query += '&';
                }
                if (builtData.filter) {
                    query += _this.encodeQueryString("$" + DataQueryBuilder.systemQueryOptions.Filter + "=" + builtData.filter);
                }
                if (query.endsWith('&')) {
                    return query.slice(0, -1);
                }
                return query;
            }
        });
    };
    DataQueryBuilder.prototype.expand = function () {
        var _this = this;
        var expandOptions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            expandOptions[_i] = arguments[_i];
        }
        this._expandOption = this._expandOption || new Set();
        expandOptions.forEach(function (expandOption) {
            _this._expandOption.add(expandOption);
        });
        return this;
    };
    DataQueryBuilder.prototype.filter = function () {
        var _a;
        var terms = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            terms[_i] = arguments[_i];
        }
        if (this._filterOption && this._filterOption.terms && this._filterOption.terms.length > 0 &&
            terms && terms.length > 0) {
            this._filterOption = (_a = this._filterOption).and.apply(_a, terms);
        }
        else {
            this._filterOption = this._filterOption || new (FilterBuilder.bind.apply(FilterBuilder, __spreadArrays([void 0, this._context], terms)))();
        }
        return this._filterOption;
    };
    DataQueryBuilder.prototype.filterTerm = function () {
        var terms = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            terms[_i] = arguments[_i];
        }
        return new (FilterBuilder.bind.apply(FilterBuilder, __spreadArrays([void 0, this._context], terms)))();
    };
    DataQueryBuilder.prototype.mdkSearch = function (searchString) {
        this._mdkSearch = this._mdkSearch || new MDKSearchBuilder(this._context, [], searchString);
        return this._mdkSearch;
    };
    DataQueryBuilder.prototype.orderBy = function () {
        var _this = this;
        var orderByOptions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            orderByOptions[_i] = arguments[_i];
        }
        this._orderByOption = new Set();
        orderByOptions.forEach(function (orderByOption) {
            var orderBySegments = orderByOption.split(' ');
            if (orderBySegments.length === 1) {
                if (!_this._orderByOption.has(orderByOption + " asc") && !_this._orderByOption.has(orderByOption + " desc")) {
                    _this._orderByOption.add(orderByOption);
                }
            }
            else {
                _this._orderByOption.add(orderByOption);
            }
        });
        return this;
    };
    DataQueryBuilder.prototype.select = function () {
        var _this = this;
        var selectOptions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            selectOptions[_i] = arguments[_i];
        }
        this._selectOption = this._selectOption || new Set();
        selectOptions.forEach(function (selectOption) {
            _this._selectOption.add(selectOption);
        });
        return this;
    };
    DataQueryBuilder.prototype.skip = function (skip) {
        this._skipOption = skip;
        return this;
    };
    DataQueryBuilder.prototype.skipToken = function (skipToken) {
        var index = skipToken.indexOf('skiptoken');
        if (index !== 0) {
            skipToken = skipToken.substring(index);
        }
        this._skipTokenOption = skipToken;
        return this;
    };
    DataQueryBuilder.prototype.top = function (top) {
        this._topOption = top;
        return this;
    };
    DataQueryBuilder.prototype.updateQueryOptionsForUniqueRecord = function () {
        this._filterOption = undefined;
        this._topOption = undefined;
        this._skipOption = undefined;
        this._orderByOption = undefined;
        return this;
    };
    DataQueryBuilder.prototype.encodeQueryString = function (filterOption) {
        var substrings = filterOption.split(/('(?:\\'|[^'])*')/);
        var encodedQuery = '';
        for (var i = 0; i < substrings.length; i++) {
            if (i % 2 === 0) {
                encodedQuery = encodedQuery + encodeURI(substrings[i]);
            }
            else {
                var substring = substrings[i];
                if (substring.charAt(0) === '\'' && substring.charAt(substring.length - 1) === '\'') {
                    var s = substring.substring(1, substring.length - 1);
                    encodedQuery = encodedQuery + '\'' + encodeURIComponent(s.replace('\\\'', '\'')).replace(/'/g, '\'\'') + '\'';
                }
                else {
                    encodedQuery = encodedQuery + encodeURIComponent(substring);
                }
            }
        }
        return encodedQuery;
    };
    Object.defineProperty(DataQueryBuilder.prototype, "searchContext", {
        get: function () {
            return this._context.searchContext || {};
        },
        enumerable: true,
        configurable: true
    });
    DataQueryBuilder.prototype._parseQueryOptions = function (query) {
        var _this = this;
        this._originalQueryOptions = {};
        for (var _i = 0, _a = query.split('&'); _i < _a.length; _i++) {
            var queryOption = _a[_i];
            if (queryOption.length) {
                var queryOptionNameAndValue = queryOption.split('=');
                var queryOptionName = queryOptionNameAndValue.shift().slice(1);
                var queryOptionValue = queryOptionNameAndValue.join('=');
                if (queryOptionName && queryOptionValue) {
                    if (queryOptionName === DataQueryBuilder.systemQueryOptions.Filter) {
                        this._originalQueryOptions[queryOptionName] = decodeURIComponent(queryOptionValue);
                    }
                    else {
                        this._originalQueryOptions[queryOptionName] = queryOptionValue;
                    }
                }
            }
        }
        Object.keys(this._originalQueryOptions).forEach(function (key) {
            switch (key) {
                case DataQueryBuilder.systemQueryOptions.Expand:
                    _this.expand.apply(_this, _this._originalQueryOptions[key].split(','));
                    break;
                case DataQueryBuilder.systemQueryOptions.Filter:
                    _this.filter(_this._originalQueryOptions[key]);
                    break;
                case DataQueryBuilder.systemQueryOptions.OrderBy:
                    _this.orderBy.apply(_this, _this._originalQueryOptions[key].split(','));
                    break;
                case DataQueryBuilder.systemQueryOptions.Select:
                    _this.select.apply(_this, _this._originalQueryOptions[key].split(','));
                    break;
                case DataQueryBuilder.systemQueryOptions.Skip:
                    _this.skip(_this._originalQueryOptions[key]);
                    break;
                case DataQueryBuilder.systemQueryOptions.Top:
                    _this.top(_this._originalQueryOptions[key]);
                    break;
                default:
            }
        });
    };
    DataQueryBuilder.systemQueryOptions = {
        Expand: 'expand',
        Filter: 'filter',
        OrderBy: 'orderby',
        Select: 'select',
        Skip: 'skip',
        Top: 'top',
    };
    return DataQueryBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.DataQueryBuilder = DataQueryBuilder;
