"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_array_1 = require("tns-core-modules/data/observable-array");
var Tracer_1 = require("../utils/Tracer");
var Logger_1 = require("../utils/Logger");
var DataHelper_1 = require("../utils/DataHelper");
var DataQueryBuilder_1 = require("../builders/odata/DataQueryBuilder");
var IDataService_1 = require("../data/IDataService");
var app = require("tns-core-modules/application");
var ServiceDataLoader = (function () {
    function ServiceDataLoader(service, _pageSize, numOfSections, sectionIndex) {
        this._pageSize = _pageSize;
        this._data = new observable_array_1.ObservableArray();
        this._readPages = [];
        this._allDataIsRead = false;
        this._skipToken = null;
        this._numOfSections = undefined;
        this._sectionIndex = undefined;
        this._service = Object.assign({}, service);
        this._numOfSections = numOfSections;
        this._sectionIndex = sectionIndex;
    }
    Object.defineProperty(ServiceDataLoader.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServiceDataLoader.prototype, "service", {
        get: function () {
            return this._service;
        },
        enumerable: true,
        configurable: true
    });
    ServiceDataLoader.prototype.isAllDataRead = function () {
        return this._allDataIsRead;
    };
    ServiceDataLoader.prototype.loadMoreItems = function (context) {
        if (this._allDataIsRead) {
            return Promise.resolve(new observable_array_1.ObservableArray());
        }
        var nextPageUp = this._getPageForItem(this._data.length);
        return this._readPage(nextPageUp, context);
    };
    ServiceDataLoader.prototype._getPageForItem = function (index) {
        return Math.floor(index / this._pageSize);
    };
    ServiceDataLoader.prototype._readPage = function (page, context) {
        var _this = this;
        if (!this._readPages[page]) {
            return this._newServiceWithPagingQueryOptionsForPage(page, context).then(function (pagingService) {
                if (_this._allDataIsRead) {
                    return new observable_array_1.ObservableArray();
                }
                if (!pagingService.serverSidePaging) {
                    return DataHelper_1.DataHelper.readFromService(pagingService).then(function (data) {
                        if (_this._allDataIsRead) {
                            return Promise.resolve(new observable_array_1.ObservableArray());
                        }
                        if (!data || data.length < _this._pageSize || DataHelper_1.DataHelper.isRestServiceTarget(_this._service)) {
                            _this._allDataIsRead = true;
                        }
                        return _this.updateData(data, page);
                    });
                }
                else {
                    return DataHelper_1.DataHelper.readWithPageSize(pagingService, _this._pageSize).then(function (data) {
                        if (_this._allDataIsRead) {
                            return Promise.resolve(new observable_array_1.ObservableArray());
                        }
                        if (data.nextLink === null) {
                            _this._allDataIsRead = true;
                        }
                        _this._skipToken = data.nextLink;
                        return _this.updateData(data.Value, page);
                    });
                }
            }).catch(function (error) {
                Logger_1.Logger.instance.core.error(Logger_1.Logger.ERROR, error, error.stack);
                return undefined;
            });
        }
    };
    ServiceDataLoader.prototype._newServiceWithPagingQueryOptionsForPage = function (page, context) {
        var _this = this;
        var pagingService = Object.assign({}, this._service);
        var queryBuilder = new DataQueryBuilder_1.DataQueryBuilder(context, pagingService.queryOptions);
        var alreadyReadItems = this._pageSize * page;
        var itemsToRead = this._pageSize;
        if (queryBuilder.hasTop) {
            if (this._disablePagination()) {
                itemsToRead = queryBuilder.topOption;
            }
            else {
                itemsToRead = Math.min(this._pageSize, queryBuilder.topOption - alreadyReadItems);
            }
        }
        else {
            if (this._disablePagination() && !(DataHelper_1.DataHelper.isCallFunctionTarget(pagingService) || DataHelper_1.DataHelper.isRestServiceTarget(pagingService))) {
                return IDataService_1.IDataService.instance().count(pagingService, context).then(function (numberOfRowsInEntitySet) {
                    return _this._designQueryForPagingService(page, numberOfRowsInEntitySet, pagingService, queryBuilder);
                });
            }
        }
        return this._designQueryForPagingService(page, itemsToRead, pagingService, queryBuilder);
    };
    ServiceDataLoader.prototype._designQueryForPagingService = function (page, itemsToRead, pagingService, queryBuilder) {
        var alreadyReadItems = this._pageSize * page;
        if (!this._service.serverSidePaging) {
            if (!DataHelper_1.DataHelper.isRestServiceTarget(this._service)) {
                if (itemsToRead <= 0) {
                    this._allDataIsRead = true;
                    return Promise.resolve(pagingService);
                }
                queryBuilder.top(itemsToRead);
                if (page !== 0) {
                    queryBuilder.skip(alreadyReadItems);
                }
            }
        }
        else {
            if (this._skipToken && this._skipToken.length > 0) {
                queryBuilder.skipToken(this._skipToken);
            }
        }
        return queryBuilder.build().then(function (builtQuery) {
            pagingService.queryOptions = builtQuery;
            return pagingService;
        });
    };
    ServiceDataLoader.prototype._disablePagination = function () {
        return app.android && this._numOfSections && this._numOfSections > 1 && this._sectionIndex < this._numOfSections;
    };
    ServiceDataLoader.prototype.updateData = function (data, page) {
        var _a, _b;
        if (data) {
            var tid = Tracer_1.Tracer.startTrace();
            var firstReadItemIndex = page * this._pageSize;
            if (firstReadItemIndex > this._data.length) {
                var missingItemsCount = firstReadItemIndex - this._data.length;
                var emptyData = new Array(missingItemsCount).fill(null);
                (_a = this._data).push.apply(_a, emptyData);
            }
            (_b = this._data).splice.apply(_b, __spreadArrays([firstReadItemIndex, data.length], data.slice(0)));
            Tracer_1.Tracer.commitTrace(tid, "Read page " + page + " (" + data.length + " items)", 'DataLoader');
        }
        return data;
    };
    return ServiceDataLoader;
}());
exports.ServiceDataLoader = ServiceDataLoader;
