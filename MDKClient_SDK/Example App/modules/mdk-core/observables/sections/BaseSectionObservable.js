"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Context_1 = require("../../context/Context");
var DataEventHandler_1 = require("../../data/DataEventHandler");
var BaseSectionDefinition_1 = require("../../definitions/sections/BaseSectionDefinition");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var PropertyTypeChecker_1 = require("../../utils/PropertyTypeChecker");
var ValueResolver_1 = require("../../utils/ValueResolver");
var Logger_1 = require("../../utils/Logger");
var DataHelper_1 = require("../../utils/DataHelper");
var EventHandler_1 = require("../../EventHandler");
var ExecuteSource_1 = require("../../common/ExecuteSource");
var CommonUtil_1 = require("../../utils/CommonUtil");
var app = require("tns-core-modules/application");
var BaseSectionObservable = (function () {
    function BaseSectionObservable(section) {
        this._sectionParameters = {};
        this._staticCells = false;
        this._visibleRows = [];
        this._visibleKey = 'visible';
        this._maxItemCountParamKey = 'maxItemCount';
        this._dynamicVisible = undefined;
        this._staticSection = false;
        this._emptySectionCaptionParamKey = 'emptySectionCaption';
        this._emptySectionStyleParamKey = 'emptySectionStyle';
        this._footerAccessoryTypeParamKey = 'footerAccessoryType';
        this._footerAttributeLabelParamKey = 'footerAttributeLabel';
        this._footerStyleKey = 'footerStyle';
        this._footerTitleParamKey = 'footerTitle';
        this._usesFooterParamKey = 'usesFooter';
        this._usesHeaderParamKey = 'usesHeader';
        this._headerTitleParamKey = 'headerTitle';
        this._useHeaderTopPaddingKey = 'useHeaderTopPadding';
        this._useFooterBottomPaddingKey = 'useFooterBottomPadding';
        this._emptySectionHidesFooterParamKey = 'emptySectionHidesFooter';
        this._emptySectionFooterVisibleParamKey = 'emptySectionFooterVisible';
        this._footerVisibleParamKey = 'footerVisible';
        this._contextMenuKey = 'contextMenu';
        this._selectedRowsKey = 'selectedRows';
        this._dataSubscriptions = [];
        this._sectionDataSubscriptions = [];
        this._typeKey = 'type';
        this._redrawIsRunning = false;
        if (!section) {
            throw new Error(ErrorMessage_1.ErrorMessage.BASESECTIONOBSERVABLE_CTOR_CALL_MISSING_IN_SECTION);
        }
        if (!section.definition) {
            throw new Error(ErrorMessage_1.ErrorMessage.BASESECTIONOBSERVABLE_CTOR_CALL_MISSING_IN_SECTION_DEFINITION);
        }
        this._section = section;
        this._registerDataListeners();
    }
    Object.defineProperty(BaseSectionObservable.prototype, "visible", {
        get: function () {
            return this._sectionParameters[this._visibleKey];
        },
        set: function (visible) {
            this._sectionParameters[this._visibleKey] = visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionObservable.prototype, "dynamicVisible", {
        get: function () {
            return this._dynamicVisible;
        },
        set: function (visible) {
            this._dynamicVisible = visible;
            this._sectionParameters[this._visibleKey] = visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionObservable.prototype, "sectionDataSubscriptions", {
        get: function () {
            return this._sectionDataSubscriptions.slice();
        },
        set: function (subscriptions) {
            var _this = this;
            if (this._sectionDataSubscriptions.length > 0) {
                this._unregisterDataListeners(this._sectionDataSubscriptions);
                this._sectionDataSubscriptions = [];
            }
            if (subscriptions.length > 0) {
                this._sectionDataSubscriptions = subscriptions.slice();
                this._sectionDataSubscriptions.forEach(function (dataSub) {
                    DataEventHandler_1.DataEventHandler.getInstance().subscribe(dataSub, _this);
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    BaseSectionObservable.prototype.getTargetSpecifier = function () {
        var targetSpecifier;
        if (this._targetSpecifier && this._targetSpecifier.Target) {
            targetSpecifier = this._targetSpecifier;
        }
        else {
            targetSpecifier = { 'Target': undefined };
            if (this.section.definition.data.Target) {
                targetSpecifier.Target = Object.assign({}, this.section.definition.data.Target);
            }
        }
        return targetSpecifier;
    };
    BaseSectionObservable.prototype.setTargetSpecifier = function (targetSpecifier, redraw) {
        this._targetSpecifier = targetSpecifier;
        if (redraw) {
            return this.redraw();
        }
        else {
            return Promise.resolve();
        }
    };
    BaseSectionObservable.prototype.getRuntimeSpecifier = function (targetSpecifierDefinition) {
        var specifier = targetSpecifierDefinition;
        if (this._targetSpecifier && this._targetSpecifier.Target) {
            specifier = this._targetSpecifier;
        }
        return specifier;
    };
    BaseSectionObservable.prototype.unregisterDataListeners = function () {
        this._unregisterDataListeners(this._dataSubscriptions);
        this._dataSubscriptions = [];
    };
    BaseSectionObservable.prototype.redraw = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            (function waitUntilPrevRedrawDone(obsObj) {
                if (!obsObj._redrawIsRunning) {
                    return resolve();
                }
                setTimeout(waitUntilPrevRedrawDone.bind(null, obsObj), 500);
            })(_this);
        }).then(function () {
            return _this._performRedraw();
        });
    };
    BaseSectionObservable.prototype.reloadRow = function (index) {
        this.section.reloadRow(index);
    };
    BaseSectionObservable.prototype.onDataChanged = function (action, result) {
        if (this.isPageVisible) {
            return this.redraw();
        }
        else {
            return Promise.resolve(this.section.page.staleDataListeners.add(this));
        }
    };
    Object.defineProperty(BaseSectionObservable.prototype, "isPageVisible", {
        get: function () {
            return this.section.page.isCurrentPage;
        },
        enumerable: true,
        configurable: true
    });
    BaseSectionObservable.prototype.onPageUnloaded = function (pageExists) {
        if (!pageExists) {
            this.unregisterDataListeners();
        }
    };
    BaseSectionObservable.prototype.bind = function () {
        var _this = this;
        return this._bindValues(this.binding, this.section.definition).then(function (sectionParameters) {
            _this._sectionParameters = sectionParameters;
            return _this._sectionParameters;
        });
    };
    Object.defineProperty(BaseSectionObservable.prototype, "binding", {
        get: function () {
            return this._binding || this.section.context.binding;
        },
        set: function (binding) {
            this._binding = binding;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionObservable.prototype, "debugString", {
        get: function () {
            var pageDebugString = this.section.page.debugString;
            var sectionName = this.section.definition.getName() ? this.section.definition.getName() : 'NO-NAME';
            return "Section: " + sectionName + " - " + pageDebugString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionObservable.prototype, "value", {
        get: function () {
            return this._sectionParameters;
        },
        enumerable: true,
        configurable: true
    });
    BaseSectionObservable.prototype.isSectionEmpty = function () {
        return false;
    };
    BaseSectionObservable.prototype._performRedraw = function () {
        var _this = this;
        this._redrawIsRunning = true;
        return this.bind().then(function () {
            return _this.section.redraw(_this._sectionParameters);
        }).then(function () {
            _this._redrawIsRunning = false;
        }).catch(function (error) {
            Logger_1.Logger.instance.action.error(error);
            _this._redrawIsRunning = false;
            throw error;
        });
    };
    Object.defineProperty(BaseSectionObservable.prototype, "_maxItemCount", {
        get: function () {
            return this._sectionParameters[this._maxItemCountParamKey];
        },
        set: function (maxItemCount) {
            this._sectionParameters[this._maxItemCountParamKey] = maxItemCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionObservable.prototype, "footerAttributeLabel", {
        set: function (footerAttributeLabel) {
            this._sectionParameters[this._footerAttributeLabelParamKey] = footerAttributeLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionObservable.prototype, "footerStyle", {
        set: function (footerStyle) {
            this._sectionParameters[this._footerStyleKey] = footerStyle;
        },
        enumerable: true,
        configurable: true
    });
    BaseSectionObservable.prototype._bindValue = function (bindingObject, bindingProperty, bindingValue, style) {
        this._staticSection = (bindingObject instanceof BaseSectionDefinition_1.BaseSectionDefinition);
        var bindingContext = new Context_1.Context(bindingObject, this._section);
        bindingContext.clientAPIProps.bindingProperty = bindingProperty;
        return ValueResolver_1.ValueResolver.resolveValue(bindingValue, bindingContext, true, null, style);
    };
    BaseSectionObservable.prototype._bindStyles = function (cell, bindingObject) {
        if (cell && cell.hasOwnProperty(BaseSectionObservable._stylesKey)) {
            return this._bindStylesValue(cell[BaseSectionObservable._stylesKey], bindingObject);
        }
        return Promise.resolve(null);
    };
    BaseSectionObservable.prototype._bindStylesValue = function (styles, bindingObject) {
        var _this = this;
        var targetObj = {};
        var oContext = new Context_1.Context(bindingObject, this.section.table);
        return ValueResolver_1.ValueResolver.resolveValue(styles, oContext).then(function (resolvedStyles) {
            var stylePromises = [];
            Object.keys(resolvedStyles).map(function (target, id) {
                stylePromises.push(_this._bindValue(bindingObject, target + 'Style', resolvedStyles[target]).then(function (newStyle) {
                    targetObj[target] = newStyle;
                }));
            });
            return Promise.all(stylePromises).then(function () {
                return targetObj;
            });
        });
    };
    Object.defineProperty(BaseSectionObservable.prototype, "sectionParameters", {
        get: function () {
            return this._sectionParameters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionObservable.prototype, "staticSection", {
        get: function () {
            return this._staticSection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionObservable.prototype, "section", {
        get: function () {
            return this._section;
        },
        enumerable: true,
        configurable: true
    });
    BaseSectionObservable.prototype._bindValues = function (bindingObject, definition) {
        var _this = this;
        var promises = [];
        var sectionParameters = {};
        sectionParameters[this._usesHeaderParamKey] = false;
        if (definition.usesHeader) {
            sectionParameters[this._usesHeaderParamKey] = true;
            promises.push(this._bindValue(this.binding, 'HeaderCaption', definition.headerCaption)
                .then(function (value) {
                sectionParameters[_this._headerTitleParamKey] = value;
            }));
        }
        promises.push(this._bindValue(this.binding, 'UseHeaderTopPadding', definition.useHeaderTopPadding)
            .then(function (value) {
            if (typeof value === 'boolean') {
                sectionParameters[_this._useHeaderTopPaddingKey] = value;
            }
            else {
                sectionParameters[_this._useHeaderTopPaddingKey] = true;
            }
        }));
        return this._resolveFooterParams(definition, sectionParameters).then(function () {
            if (sectionParameters[_this._usesFooterParamKey]) {
                promises.push(_this._bindValue(_this.binding, 'FooterAccessoryType', definition.footerAccessoryType)
                    .then(function (value) {
                    sectionParameters[_this._footerAccessoryTypeParamKey] = value;
                }));
                promises.push(_this._bindValue(_this.binding, 'FooterAttributeLabel', definition.footerAttributeLabel)
                    .then(function (value) {
                    sectionParameters[_this._footerAttributeLabelParamKey] = value;
                }));
                promises.push(_this._bindValue(_this.binding, 'FooterCaption', definition.footerCaption)
                    .then(function (value) {
                    sectionParameters[_this._footerTitleParamKey] = value;
                }));
                promises.push(_this._bindValue(_this.binding, 'FooterStyle', definition.footerStyle)
                    .then(function (value) {
                    sectionParameters[_this._footerStyleKey] = value;
                }));
            }
            promises.push(_this._bindValue(_this.binding, 'UseFooterBottomPadding', definition.useFooterBottomPadding)
                .then(function (value) {
                if (typeof value === 'boolean') {
                    sectionParameters[_this._useFooterBottomPaddingKey] = value;
                }
                else {
                    sectionParameters[_this._useFooterBottomPaddingKey] = true;
                }
            }));
            if (_this.isSectionEmpty()) {
                promises.push(_this._bindValue(_this.binding, 'EmptySectionCaption', definition.emptySectionCaption)
                    .then(function (value) {
                    sectionParameters[_this._emptySectionCaptionParamKey] = value;
                }));
                promises.push(_this._bindValue(_this.binding, 'EmptySectionStyle', definition.emptySectionStyle)
                    .then(function (value) {
                    sectionParameters[_this._emptySectionStyleParamKey] = value;
                }));
            }
            var visible = definition.visible;
            if (_this._dynamicVisible !== undefined) {
                visible = _this._dynamicVisible;
            }
            promises.push(_this._bindValue(_this.binding, 'Visible', visible).then(function (value) {
                sectionParameters[_this._visibleKey] = value;
            }));
            promises.push(_this._bindValue(_this.binding, 'MaxItemCount', definition.maxItemCount).then(function (value) {
                sectionParameters[_this._maxItemCountParamKey] = value;
            }));
            if (app.android && definition.contextMenu) {
                var originalContextMenu_1 = definition.contextMenu;
                var contextMenus = CommonUtil_1.CommonUtil.deepCopyWithoutKey(originalContextMenu_1, 'OnSwipe');
                promises.push(_this._bindValue(_this.binding, 'ContextMenu', contextMenus).then(function (value) {
                    CommonUtil_1.CommonUtil.addKeyToObjectFromObject(originalContextMenu_1.Items, value.Items, '_Name', 'OnSwipe');
                    sectionParameters[_this._contextMenuKey] = value;
                }));
            }
            sectionParameters[_this._typeKey] = definition.type;
            return Promise.all(promises).then(function () {
                return sectionParameters;
            });
        });
    };
    BaseSectionObservable.prototype._getValidBindObject = function (binding) {
        return this._isValidBinding(binding) ? binding : this.section.context.binding;
    };
    BaseSectionObservable.prototype._setDisableSelectionStyle = function (cell, item) {
        if (!cell || !item) {
            return;
        }
        var onPressCellKey = BaseSectionObservable._onPressDefinitionCellKey;
        var disableSelectionItemKey = BaseSectionObservable._disableSelectionStyleItemKey;
        item[disableSelectionItemKey] =
            cell[onPressCellKey] === undefined || cell[onPressCellKey] === '';
    };
    BaseSectionObservable.prototype._filterCells = function (items) {
        return items;
    };
    BaseSectionObservable.prototype._filterVisibleCells = function (items) {
        var _this = this;
        if (!this._staticCells) {
            return items;
        }
        this.clearVisibleRowMapping();
        var filteredItems = [];
        items.forEach(function (item, index) {
            if (item.visible === undefined || item.visible) {
                filteredItems.push(item);
                _this._visibleRows.push(index);
            }
        });
        return filteredItems;
    };
    BaseSectionObservable.prototype.clearVisibleRowMapping = function () {
        this._visibleRows = [];
    };
    BaseSectionObservable.prototype.adjustForHiddenRows = function (row) {
        if (this._staticCells) {
            row = this._visibleRows[row];
        }
        return row;
    };
    BaseSectionObservable.prototype.buildBaseSectionEventHandler = function () {
        var handler = new EventHandler_1.EventHandler();
        var source = this.getExecuteSource();
        handler.setEventSource(source, this.section.context);
        this.section.page.context.clientAPIProps.eventSource = source;
        return handler;
    };
    BaseSectionObservable.prototype.getExecuteSource = function () {
        return new ExecuteSource_1.ExecuteSource(this.section.page.frame.id);
    };
    BaseSectionObservable.prototype._isValidBinding = function (binding) {
        return binding !== undefined && Object.keys(binding).length > 0 && binding.constructor === Object;
    };
    BaseSectionObservable.prototype._unregisterDataListeners = function (dataSubscriptions) {
        var _this = this;
        dataSubscriptions.forEach(function (dataSub) {
            DataEventHandler_1.DataEventHandler.getInstance().unsubscribe(dataSub, _this);
        });
    };
    BaseSectionObservable.prototype._registerDataListeners = function () {
        var _this = this;
        var promises = [];
        if (this.section.definition.target && this.section.definition.target.Service) {
            this._dataSubscriptions.push(this.section.definition.target.Service);
            if (this.section.definition.target.EntitySet) {
                promises.push(ValueResolver_1.ValueResolver.resolveValue(this.section.definition.target.EntitySet, this.section.context)
                    .then(function (result) {
                    _this._dataSubscriptions.push(result);
                }));
            }
        }
        var dataSubs = this.section.definition.dataSubscriptions;
        if (PropertyTypeChecker_1.PropertyTypeChecker.isRule(dataSubs)) {
            promises.push(ValueResolver_1.ValueResolver.resolveValue(dataSubs, this.section.context).then(function (result) {
                _this._dataSubscriptions = _this._dataSubscriptions.concat(result);
            }));
        }
        else {
            dataSubs.forEach(function (dataSub) {
                promises.push(ValueResolver_1.ValueResolver.resolveValue(dataSub, _this.section.context).then(function (result) {
                    _this._dataSubscriptions.push(result);
                }));
            });
        }
        return Promise.all(promises).then(function () {
            _this._dataSubscriptions.forEach(function (dataSub) {
                DataEventHandler_1.DataEventHandler.getInstance().subscribe(dataSub, _this);
            });
        });
    };
    BaseSectionObservable.prototype._resolveFooterParams = function (definition, sectionParameters) {
        var _this = this;
        var footerPromise = [];
        footerPromise.push(this._bindValue(this.binding, 'FooterVisible', definition.footerVisible)
            .then(function (value) {
            sectionParameters[_this._footerVisibleParamKey] = value;
        }));
        footerPromise.push(this._bindValue(this.binding, 'EmptySectionHidesFooter', definition.emptySectionHidesFooter.Visible).then(function (value) {
            sectionParameters[_this._emptySectionHidesFooterParamKey] = value;
        }));
        footerPromise.push(this._bindValue(this.binding, 'EmptySectionFooterVisible', definition.emptySectionFooterVisible.Visible).then(function (value) {
            sectionParameters[_this._emptySectionFooterVisibleParamKey] = value;
        }));
        return Promise.all(footerPromise).then(function () {
            var emptySectionFooterVisible = false;
            if (definition.emptySectionFooterVisible.IsPropertyDefined) {
                emptySectionFooterVisible = sectionParameters[_this._emptySectionFooterVisibleParamKey];
            }
            else if (definition.emptySectionHidesFooter.IsPropertyDefined) {
                emptySectionFooterVisible = !sectionParameters[_this._emptySectionHidesFooterParamKey];
            }
            sectionParameters[_this._usesFooterParamKey] = _this._isFooterShown(definition, sectionParameters[_this._footerVisibleParamKey], emptySectionFooterVisible);
        });
    };
    BaseSectionObservable.prototype._isFooterShown = function (definition, footerVisible, emptySectionFooterVisible) {
        var usesFooterFlag = false;
        if (!this.isSectionEmpty()) {
            usesFooterFlag = true;
        }
        else {
            if (emptySectionFooterVisible) {
                usesFooterFlag = true;
            }
            else {
                return false;
            }
        }
        if (usesFooterFlag) {
            if (this.userFooter(definition, footerVisible)) {
                return true;
            }
            else {
                return false;
            }
        }
    };
    BaseSectionObservable.prototype.userFooter = function (definition, footerVisible) {
        if (definition.data.Footer === undefined) {
            return false;
        }
        if (Object.keys(definition.data.Footer).length === 0) {
            return false;
        }
        if (Object.keys(definition.data.Footer).length === 1 && definition.data.Footer.hasOwnProperty('UseBottomPadding')) {
            return false;
        }
        if (footerVisible === false) {
            return false;
        }
        return true;
    };
    BaseSectionObservable.prototype._readFromService = function (service) {
        return DataHelper_1.DataHelper.readFromService(service);
    };
    BaseSectionObservable.prototype.resetDataChangedFlag = function () {
    };
    BaseSectionObservable._minimumInteritemSpacing = 'minimumInteritemSpacing';
    BaseSectionObservable._numberOfColumns = 'numberOfColumns';
    BaseSectionObservable._minimumLineSpacing = 'minimumLineSpacing';
    BaseSectionObservable._imageHeight = 'imageHeight';
    BaseSectionObservable._imageWidth = 'imageWidth';
    BaseSectionObservable._layoutType = 'layoutType';
    BaseSectionObservable._stylesKey = 'Styles';
    BaseSectionObservable._onPressDefinitionCellKey = 'OnPress';
    BaseSectionObservable._disableSelectionStyleItemKey = 'disableSelectionStyle';
    return BaseSectionObservable;
}());
exports.BaseSectionObservable = BaseSectionObservable;
