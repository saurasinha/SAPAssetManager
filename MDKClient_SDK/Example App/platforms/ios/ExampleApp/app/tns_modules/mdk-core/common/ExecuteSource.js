"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExecuteSourceType;
(function (ExecuteSourceType) {
    ExecuteSourceType[ExecuteSourceType["ParentPage"] = 1] = "ParentPage";
    ExecuteSourceType[ExecuteSourceType["ModalPage"] = 2] = "ModalPage";
    ExecuteSourceType[ExecuteSourceType["TabPage"] = 3] = "TabPage";
    ExecuteSourceType[ExecuteSourceType["TabPageParent"] = 4] = "TabPageParent";
    ExecuteSourceType[ExecuteSourceType["TabPageChild"] = 5] = "TabPageChild";
})(ExecuteSourceType = exports.ExecuteSourceType || (exports.ExecuteSourceType = {}));
var ExecuteSource = (function () {
    function ExecuteSource(id) {
        this._frameId = id;
    }
    Object.defineProperty(ExecuteSource.prototype, "frameId", {
        get: function () {
            return this._frameId;
        },
        set: function (id) {
            this._frameId = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExecuteSource.prototype, "sourceType", {
        get: function () {
            return this._sourceType;
        },
        set: function (type) {
            this._sourceType = type;
        },
        enumerable: true,
        configurable: true
    });
    ExecuteSource.isExecuteSourceParent = function (source) {
        return source.sourceType === ExecuteSourceType.ParentPage;
    };
    ExecuteSource.isExecuteSourceModal = function (source) {
        return source.sourceType === ExecuteSourceType.ModalPage;
    };
    ExecuteSource.isExecuteSourceTab = function (source) {
        return source.sourceType === ExecuteSourceType.TabPage;
    };
    ExecuteSource.isExecuteSourceTabParent = function (source) {
        return source.sourceType === ExecuteSourceType.TabPageParent;
    };
    ExecuteSource.isExecuteSourceTabChild = function (source) {
        return source.sourceType === ExecuteSourceType.TabPageChild;
    };
    return ExecuteSource;
}());
exports.ExecuteSource = ExecuteSource;
