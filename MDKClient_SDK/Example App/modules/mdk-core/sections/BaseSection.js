"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mdk_sap_1 = require("mdk-sap");
var BaseSectionDefinition_1 = require("../definitions/sections/BaseSectionDefinition");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var EventHandler_1 = require("../EventHandler");
var BaseSection = (function () {
    function BaseSection(props) {
        this._extensions = [];
        this._oldVisible = null;
        this._props = props;
        this._sectionBridge = new mdk_sap_1.SectionBridge();
    }
    Object.defineProperty(BaseSection.prototype, "binding", {
        get: function () {
            return this.observable().binding;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSection.prototype, "context", {
        get: function () {
            if (this.page.context && this.page.context.clientAPIProps &&
                this.page.context.clientAPIProps.actionBinding &&
                this._props.container.context) {
                this._props.container.context.clientAPIProps.actionBinding = this.page.context.clientAPIProps.actionBinding;
            }
            return this._props.container.context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSection.prototype, "definition", {
        get: function () {
            return this._props.definition;
        },
        enumerable: true,
        configurable: true
    });
    BaseSection.prototype.disposeNativeSection = function () {
        if (this._sectionBridge) {
            this._sectionBridge.destroy();
        }
        this._sectionBridge = undefined;
        this._nativeSection = null;
    };
    Object.defineProperty(BaseSection.prototype, "nativeSection", {
        get: function () {
            return this._nativeSection;
        },
        set: function (nativeSection) {
            this._nativeSection = nativeSection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSection.prototype, "staticSection", {
        get: function () {
            return this.observable().staticSection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSection.prototype, "visible", {
        get: function () {
            return this.observable().visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSection.prototype, "dynamicVisible", {
        set: function (visible) {
            this.observable().dynamicVisible = visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSection.prototype, "sectionDataSubscriptions", {
        get: function () {
            return this.observable().sectionDataSubscriptions;
        },
        set: function (dataSub) {
            this.observable().sectionDataSubscriptions = dataSub;
        },
        enumerable: true,
        configurable: true
    });
    BaseSection.prototype.getTargetSpecifier = function () {
        return this.observable().getTargetSpecifier();
    };
    BaseSection.prototype.setTargetSpecifier = function (targetSpecifier, redraw) {
        this.observable().setTargetSpecifier(targetSpecifier, redraw);
        if (redraw) {
            return this.redraw(undefined);
        }
        else {
            return Promise.resolve();
        }
    };
    BaseSection.prototype.initialize = function () {
        var _this = this;
        return this.observable().bind().then(function (params) {
            switch (_this.definition.type) {
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ButtonSection:
                    _this.nativeSection = _this._sectionBridge.createButtonSection(params, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ContactCell:
                    _this.nativeSection = _this._sectionBridge.createContactTableSection(params, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ProfileHeader:
                    _this.nativeSection = _this._sectionBridge.createProfileHeaderSection(params, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.Extension:
                    _this.nativeSection = _this._sectionBridge.createExtensionSection(params, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.GridTable:
                    _this.nativeSection = _this._sectionBridge.createGridTableSection(params, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.KeyValue:
                    _this.nativeSection = _this._sectionBridge.createKeyValueSection(params, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ObjectCollection:
                    _this.nativeSection = _this._sectionBridge.createObjectCollectionSection(params, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ObjectHeader:
                    _this.nativeSection = _this._sectionBridge.createObjectHeaderSection(params, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.KPIHeader:
                    _this.nativeSection = _this._sectionBridge.createKPIHeaderSection(params, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.KPISection:
                    _this.nativeSection = _this._sectionBridge.createKPISection(params, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ObjectTable:
                    _this.nativeSection = _this._sectionBridge.createObjectTableSection(params, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.SimplePropertyCollection:
                    _this.nativeSection = _this._sectionBridge.createSimplePropertySection(params, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ImageCollection:
                    _this.nativeSection = _this._sectionBridge.createImageCollectionSection(params, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.AnalyticCardCollection:
                    _this.nativeSection = _this._sectionBridge.createAnalyticCardCollectionSection(params, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ChartContent:
                    _this.nativeSection = _this._sectionBridge.createChartContentSection(params, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.FormCellSection:
                    _this.nativeSection = _this._sectionBridge.createFormCellSection(params, _this);
                    break;
                default:
                    _this.nativeSection = _this._sectionBridge.create(params, _this);
            }
            return _this;
        });
    };
    BaseSection.prototype.destroy = function () {
        if (this._sectionBridge) {
            this._sectionBridge.destroy();
        }
    };
    Object.defineProperty(BaseSection.prototype, "page", {
        get: function () {
            return this._props.container.page();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSection.prototype, "table", {
        get: function () {
            return this._props.container;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSection.prototype, "extensions", {
        get: function () {
            return this._extensions;
        },
        enumerable: true,
        configurable: true
    });
    BaseSection.prototype.observable = function () {
        this._observable = this._observable || this._createObservable();
        return this._observable;
    };
    BaseSection.prototype.footerTapped = function () {
        return this._handleEvent(this.definition.onFooterPress);
    };
    BaseSection.prototype.getItem = function (row) {
        throw new Error(ErrorMessage_1.ErrorMessage.BASESECTION_INVALID_CALL_GETITEM);
    };
    BaseSection.prototype.getBoundData = function (row) {
        throw new Error(ErrorMessage_1.ErrorMessage.BASESECTION_INVALID_CALL_GETBOUNDDATA);
    };
    BaseSection.prototype.getView = function (row) {
        throw new Error(ErrorMessage_1.ErrorMessage.BASESECTION_INVALID_CALL_GETVIEW);
    };
    BaseSection.prototype.onPress = function (cell, viewFacade) {
        throw new Error(ErrorMessage_1.ErrorMessage.BASESECTION_INVALID_CALL_ONPRESS);
    };
    BaseSection.prototype.onAccessoryButtonPress = function (cell, viewFacade) {
        throw new Error(ErrorMessage_1.ErrorMessage.BASESECTION_INVALID_CALL_ONACCESSORYBUTTONPRESS);
    };
    BaseSection.prototype.onItemPress = function (item) {
        throw new Error(ErrorMessage_1.ErrorMessage.BASESECTION_INVALID_CALL_ONITEMPRESS);
    };
    BaseSection.prototype.searchUpdated = function (searchText) {
        throw new Error(ErrorMessage_1.ErrorMessage.BASESECTION_INVALID_CALL_SEARCHUPDATED);
    };
    BaseSection.prototype.updateActionBarElevation = function (on) {
        mdk_sap_1.NavigationBarBridge.updateActionBarElevation(this.page, on);
    };
    BaseSection.prototype.viewDidAppear = function () {
        throw new Error(ErrorMessage_1.ErrorMessage.BASESECTION_INVALID_CALL_VIEWDIDAPPEAR);
    };
    BaseSection.prototype.resetFlag = function () {
        this._oldVisible = null;
    };
    BaseSection.prototype.redraw = function (data) {
        this._extensions = [];
        if (data != null) {
            if ((data.visible !== null) && (data.visible !== undefined) && (this._oldVisible !== data.visible)) {
                var tableRedrawFlag = false;
                if (this._oldVisible !== null || this.observable().dynamicVisible !== undefined) {
                    tableRedrawFlag = true;
                }
                this._oldVisible = data.visible;
                if (tableRedrawFlag) {
                    this.table.redrawView();
                }
                else {
                    this._sectionBridge.redraw(data);
                    this.observable().resetDataChangedFlag();
                }
            }
            else {
                this._sectionBridge.redraw(data);
                this.observable().resetDataChangedFlag();
            }
        }
        else {
            return this.observable().redraw();
        }
        return Promise.resolve(data);
    };
    BaseSection.prototype.reloadData = function (itemCount) {
        this._sectionBridge.reloadData(itemCount);
    };
    BaseSection.prototype.reloadRow = function (index) {
        this._sectionBridge.reloadRow(index);
    };
    BaseSection.prototype.updateRow = function (index, data) {
        this._sectionBridge.updateRow(index, data);
    };
    Object.defineProperty(BaseSection.prototype, "isSection", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSection.prototype, "isBindable", {
        get: function () {
            if (this.definition.type === BaseSectionDefinition_1.BaseSectionDefinition.type.ButtonSection ||
                this.definition.type === BaseSectionDefinition_1.BaseSectionDefinition.type.FormCellSection ||
                this.definition.type === BaseSectionDefinition_1.BaseSectionDefinition.type.KPIHeader) {
                return false;
            }
            else {
                return true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSection.prototype, "isSelectable", {
        get: function () {
            if (this.definition.type === BaseSectionDefinition_1.BaseSectionDefinition.type.ObjectTable) {
                return true;
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSection.prototype, "value", {
        get: function () {
            return this.observable().value;
        },
        enumerable: true,
        configurable: true
    });
    BaseSection.prototype.onDisplayingModal = function (isFullPage) {
        this._extensions.forEach(function (extension) {
            if (extension) {
                extension.onDisplayingModal(isFullPage);
            }
        });
    };
    BaseSection.prototype.onDismissingModal = function () {
        this._extensions.forEach(function (extension) {
            if (extension) {
                extension.onDismissingModal();
            }
        });
    };
    BaseSection.prototype.onNavigatedFrom = function (pageExists) {
        this._extensions.forEach(function (extension) {
            if (extension) {
                extension.onNavigatedFrom(pageExists);
            }
        });
    };
    BaseSection.prototype.onNavigatedTo = function (initialLoading) {
        this._extensions.forEach(function (extension) {
            if (extension) {
                extension.onNavigatedTo(initialLoading);
            }
        });
    };
    BaseSection.prototype.onNavigatingFrom = function (pageExists) {
        this._extensions.forEach(function (extension) {
            if (extension) {
                extension.onNavigatingFrom(pageExists);
            }
        });
    };
    BaseSection.prototype.onNavigatingTo = function (initialLoading) {
        this._extensions.forEach(function (extension) {
            if (extension) {
                extension.onNavigatingTo(initialLoading);
            }
        });
    };
    BaseSection.prototype.onPageUnloaded = function (pageExists) {
        this.observable().onPageUnloaded(pageExists);
        this._extensions.forEach(function (extension) {
            if (extension) {
                extension.onPageUnloaded(pageExists);
            }
        });
    };
    BaseSection.prototype.onPageLoaded = function (initialLoading) {
        this._extensions.forEach(function (extension) {
            if (extension) {
                extension.onPageLoaded(initialLoading);
            }
        });
    };
    BaseSection.prototype._handleEvent = function (sHandler) {
        var promise = Promise.resolve();
        if (sHandler) {
            promise = new EventHandler_1.EventHandler().executeActionOrRule(sHandler, this.context);
        }
        return promise;
    };
    return BaseSection;
}());
exports.BaseSection = BaseSection;
;
function isSection(element) {
    return element && element.isSection;
}
exports.isSection = isSection;
function isBindableSection(element) {
    if (element.definition.type === BaseSectionDefinition_1.BaseSectionDefinition.type.ButtonSection ||
        element.definition.type === BaseSectionDefinition_1.BaseSectionDefinition.type.FormCellSection ||
        element.definition.type === BaseSectionDefinition_1.BaseSectionDefinition.type.KPIHeader) {
        return false;
    }
    else {
        return true;
    }
}
exports.isBindableSection = isBindableSection;
function isSelectableSection(element) {
    if (element.definition.type === BaseSectionDefinition_1.BaseSectionDefinition.type.ObjectTable) {
        return true;
    }
    else {
        return false;
    }
}
exports.isSelectableSection = isSelectableSection;
