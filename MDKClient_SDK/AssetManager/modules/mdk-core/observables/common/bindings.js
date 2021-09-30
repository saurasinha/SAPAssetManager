"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValueResolver_1 = require("../../utils/ValueResolver");
var SearchBindings = (function () {
    function SearchBindings() {
    }
    SearchBindings.SEARCH_KEY = 'Search';
    SearchBindings.ENABLED_KEY = 'Enabled';
    SearchBindings.BARCODE_ENABLED_KEY = 'BarcodeScanner';
    SearchBindings.MODE_KEY = 'Mode';
    return SearchBindings;
}());
exports.SearchBindings = SearchBindings;
function asSearch(definition, context) {
    var searchObject = {};
    var promises = [];
    var search = definition.search || {};
    return Promise.all(Object.keys(search).map(function (key) {
        context.clientAPIProps.bindingProperty = key;
        return ValueResolver_1.ValueResolver.resolveValue(search[key], context).then(function (value) {
            searchObject[key] = value;
        });
    })).then(function () {
        return searchObject;
    });
}
exports.asSearch = asSearch;
