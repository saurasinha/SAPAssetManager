"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValueResolver_1 = require("../utils/ValueResolver");
var TypeConverter_1 = require("../utils/TypeConverter");
var HttpHeadersUtil_1 = require("../utils/HttpHeadersUtil");
var TargetServiceBuilder_1 = require("../builders/odata/service/TargetServiceBuilder");
var UniqueIdType_1 = require("../common/UniqueIdType");
function asService(data, context) {
    var resolved = {};
    var serviceSpecifier = TargetServiceBuilder_1.TargetServiceBuilder.fromDefinition(data);
    resolved.offlineEnabled = serviceSpecifier.offlineEnabled;
    resolved.serviceUrl = serviceSpecifier.serviceUrl;
    resolved.statefulService = serviceSpecifier.statefulService;
    resolved.uniqueIdType = serviceSpecifier.uniqueIdType;
    if (serviceSpecifier.serverSidePaging) {
        resolved.serverSidePaging = serviceSpecifier.serverSidePaging;
    }
    if (serviceSpecifier.function) {
        resolved.function = Object.create(serviceSpecifier.function);
    }
    var pathPromise = null;
    if (serviceSpecifier.path) {
        pathPromise = ValueResolver_1.ValueResolver.resolveValue(serviceSpecifier.path, context).
            then(function (path) {
            resolved.path = path;
            return Promise.resolve();
        });
    }
    var outputPathPromise = null;
    if (serviceSpecifier.outputPath) {
        outputPathPromise = ValueResolver_1.ValueResolver.resolveValue(serviceSpecifier.outputPath, context).
            then(function (outpathPath) {
            resolved.outputPath = outpathPath;
            return Promise.resolve();
        });
    }
    var input = {};
    Object.keys(serviceSpecifier).forEach(function (paramKey) {
        if (paramKey === 'queryOptions' || paramKey === 'entitySet' ||
            paramKey === 'readLink' || paramKey === 'editLink') {
            input[paramKey] = serviceSpecifier[paramKey];
        }
    });
    var entitySetAndQueryOptionsPromise = resolveITargetSpecifier(input, resolved, context);
    var keyPropertiesPromise = null;
    if (!serviceSpecifier.keyProperties) {
        resolved.keyProperties = [];
    }
    else if (Array.isArray(serviceSpecifier.keyProperties)) {
        resolved.keyProperties = serviceSpecifier.keyProperties;
    }
    else {
        keyPropertiesPromise = ValueResolver_1.ValueResolver.resolveKeyValues(serviceSpecifier.keyProperties, context).
            then(function (resolvedKeyValues) {
            resolved.keyProperties = resolvedKeyValues;
            return Promise.resolve();
        });
    }
    var parametersPromise = null;
    if (serviceSpecifier.function && serviceSpecifier.function.Name && serviceSpecifier.function.Parameters) {
        parametersPromise = ValueResolver_1.ValueResolver.resolveKeyValues(serviceSpecifier.function.Parameters, context).
            then(function (resolvedKeyValues) {
            resolved.function.Parameters = resolvedKeyValues;
            return Promise.resolve();
        });
    }
    var propertiesPromise = null;
    if (!serviceSpecifier.properties) {
        resolved.properties = [];
    }
    else if (Array.isArray(serviceSpecifier.properties)) {
        resolved.properties = serviceSpecifier.properties;
    }
    else {
        propertiesPromise = ValueResolver_1.ValueResolver.resolveKeyValues(serviceSpecifier.properties, context).
            then(function (resolvedKeyValues) {
            resolved.properties = resolvedKeyValues;
            return Promise.resolve();
        });
    }
    var requestOptionsPromise = null;
    if (serviceSpecifier.requestOptions) {
        requestOptionsPromise = ValueResolver_1.ValueResolver.resolveKeyValues(serviceSpecifier.requestOptions, context).
            then(function (resolvedKeyValues) {
            resolved.requestOptions = resolvedKeyValues;
            return Promise.resolve();
        });
    }
    var headersPromise = asHeaders(serviceSpecifier.headers, context).then(function (resolvedHeaders) {
        resolved.headers = resolvedHeaders;
        return Promise.resolve();
    });
    var serviceHeadersPromise = asHeaders(serviceSpecifier.serviceHeaders, context).then(function (resolvedHeaders) {
        resolved.serviceHeaders = resolvedHeaders;
        return Promise.resolve();
    });
    var requestPropertiesPromise = null;
    if (serviceSpecifier.requestProperties) {
        resolved.requestProperties = Object.create(serviceSpecifier.requestProperties);
        requestPropertiesPromise = ValueResolver_1.ValueResolver.resolveValue(serviceSpecifier.requestProperties, context).
            then(function (resolvedValue) {
            resolved.requestProperties = resolvedValue;
            return Promise.resolve();
        });
    }
    return Promise.all([entitySetAndQueryOptionsPromise, keyPropertiesPromise, propertiesPromise,
        parametersPromise, requestOptionsPromise, headersPromise, serviceHeadersPromise,
        pathPromise, outputPathPromise, requestPropertiesPromise])
        .then(function () {
        return resolved;
    });
}
exports.asService = asService;
function asLinks(links, context) {
    var linksMetadata = links;
    if (!linksMetadata) {
        return Promise.resolve([]);
    }
    return ValueResolver_1.ValueResolver.resolveValue(linksMetadata, context).then(function (value) {
        var unresolvedLinks = TypeConverter_1.TypeConverter.toArray(value).map(linkFromMetadata);
        return ValueResolver_1.ValueResolver.resolveArrayOfKeyValues(unresolvedLinks, context).then(function (resolvedLinks) {
            var resolvedTargetLinks = [];
            var resolvedTargetLink;
            var queryBuilderKey = 'queryBuilder';
            resolvedLinks.forEach(function (resolvedLink) {
                resolvedTargetLink = {};
                Object.keys(resolvedLink).forEach(function (paramKey) {
                    if (paramKey === 'queryOptions') {
                        var queryOptions = resolvedLink[paramKey];
                        if (queryOptions && typeof queryOptions === 'string') {
                            resolvedTargetLink[paramKey] = encodeURI(queryOptions);
                        }
                        else if (queryOptions instanceof Object) {
                            resolvedTargetLink[queryBuilderKey] = queryOptions;
                        }
                        else {
                            resolvedTargetLink[paramKey] = '';
                        }
                    }
                    else {
                        resolvedTargetLink[paramKey] = resolvedLink[paramKey] ? resolvedLink[paramKey] : '';
                    }
                });
                resolvedTargetLinks.push(resolvedTargetLink);
            });
            return resolvedTargetLinks;
        });
    });
}
exports.asLinks = asLinks;
function linkFromMetadata(data) {
    return {
        entitySet: data.Target.EntitySet,
        property: data.Property,
        queryOptions: data.Target.QueryOptions,
        readLink: data.Target.ReadLink,
        uniqueIdType: data.Target.uniqueIdType || UniqueIdType_1.UniqueIdType.String,
    };
}
function resolveITargetSpecifier(input, output, context, excludeFailedDynamicQueryOptions) {
    var resolvableTargetSpecifier = {};
    Object.keys(input).forEach(function (paramKey) {
        if (paramKey === 'queryOptions' || paramKey === 'entitySet' ||
            paramKey === 'readLink' || paramKey === 'editLink') {
            resolvableTargetSpecifier[paramKey] = input[paramKey];
        }
    });
    return ValueResolver_1.ValueResolver.resolveKeyValues(resolvableTargetSpecifier, context).then(function (resolvedKeyValues) {
        Object.keys(resolvedKeyValues).forEach(function (paramKey) {
            if (paramKey === 'queryOptions') {
                var queryOptions = resolvedKeyValues[paramKey];
                if (queryOptions && typeof queryOptions === 'string') {
                    output.queryOptions = encodeQueryString(queryOptions);
                }
                else if (queryOptions instanceof Object) {
                    output.queryBuilder = queryOptions;
                }
                else {
                    output.queryOptions = '';
                }
            }
            else if (paramKey === 'entitySet' || paramKey === 'readLink' || paramKey === 'editLink') {
                output[paramKey] = resolvedKeyValues[paramKey] ? resolvedKeyValues[paramKey] : '';
            }
        });
        return Promise.resolve();
    });
}
function encodeQueryString(filterOption) {
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
}
function asHeaders(headers, context) {
    if (!headers) {
        return Promise.resolve({});
    }
    return ValueResolver_1.ValueResolver.resolveKeyValues(headers, context).then(function (resolvedKeyValues) {
        return HttpHeadersUtil_1.HttpHeadersUtil.convertHeaders(resolvedKeyValues);
    });
}
exports.asHeaders = asHeaders;
function asParent(data, context) {
    var parent = data.ParentLink;
    if (!parent) {
        return Promise.resolve({});
    }
    var input = {
        entitySet: parent.Target.EntitySet,
        property: parent.Property,
        queryOptions: parent.Target.QueryOptions,
        readLink: parent.Target.ReadLink,
    };
    var resolved = {};
    return ValueResolver_1.ValueResolver.resolveKeyValues(input, context).then(function (resolvedKeyValues) {
        Object.keys(resolvedKeyValues).forEach(function (paramKey) {
            if (paramKey === 'queryOptions') {
                var queryOptions = resolvedKeyValues[paramKey];
                if (queryOptions && typeof queryOptions === 'string') {
                    resolved.queryOptions = encodeURI(queryOptions);
                }
                else {
                    resolved.queryOptions = '';
                }
            }
            else if (paramKey === 'entitySet' || paramKey === 'readLink' || paramKey === 'property') {
                resolved[paramKey] = resolvedKeyValues[paramKey] ? resolvedKeyValues[paramKey] : '';
            }
        });
        if (!resolved.readLink) {
            delete resolved.readLink;
        }
        if (!resolved.queryOptions) {
            delete resolved.queryOptions;
        }
        return resolved;
    });
}
exports.asParent = asParent;
function asDefiningRequests(data, context) {
    return ValueResolver_1.ValueResolver.resolveArrayOfKeyValues(data.DefiningRequests, context);
}
exports.asDefiningRequests = asDefiningRequests;
function asReadLink(data) {
    if (!data) {
        return undefined;
    }
    if (typeof data === 'object') {
        return data['@odata.readLink'];
    }
    else if (typeof data === 'string') {
        try {
            return asReadLink(JSON.parse(data));
        }
        catch (e) {
            return undefined;
        }
    }
}
exports.asReadLink = asReadLink;
