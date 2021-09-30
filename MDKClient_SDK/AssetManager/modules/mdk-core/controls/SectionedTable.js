"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mdk_sap_1 = require("mdk-sap");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var BaseSectionDefinition_1 = require("../definitions/sections/BaseSectionDefinition");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var SectionedTableObservable_1 = require("../observables/SectionedTableObservable");
var ButtonSection_1 = require("../sections/ButtonSection");
var ContactCellSection_1 = require("../sections/ContactCellSection");
var ExtensionSection_1 = require("../sections/ExtensionSection");
var GridTableSection_1 = require("../sections/GridTableSection");
var ImageCollectionSection_1 = require("../sections/ImageCollectionSection");
var KeyValueSection_1 = require("../sections/KeyValueSection");
var ObjectCollectionSection_1 = require("../sections/ObjectCollectionSection");
var ObjectHeaderSection_1 = require("../sections/ObjectHeaderSection");
var ProfileHeaderSection_1 = require("../sections/ProfileHeaderSection");
var AnalyticCardCollectionSection_1 = require("../sections/AnalyticCardCollectionSection");
var ChartContentSection_1 = require("../sections/ChartContentSection");
var ObjectTableSection_1 = require("../sections/ObjectTableSection");
var SimplePropertyCollectionSection_1 = require("../sections/SimplePropertyCollectionSection");
var Logger_1 = require("../utils/Logger");
var BaseContainer_1 = require("./BaseContainer");
var IFilterable_1 = require("./IFilterable");
var KPIHeaderSection_1 = require("../sections/KPIHeaderSection");
var KPISection_1 = require("../sections/KPISection");
var FormCellSection_1 = require("../sections/FormCellSection");
var CommonUtil_1 = require("../utils/CommonUtil");
var app = require("tns-core-modules/application");
var EventHandler_1 = require("../EventHandler");
var FlexibleColumnFrame_1 = require("../pages/FlexibleColumnFrame");
var SectionedTable = (function (_super) {
    __extends(SectionedTable, _super);
    function SectionedTable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._sections = [];
        _this._filterCriteria = [];
        _this._filterResult = undefined;
        _this.RENDER_DELAY_IN_MS = 100;
        return _this;
    }
    SectionedTable.prototype.bind = function () {
        var _this = this;
        var sectionPromises = [];
        this.observable().resolveLoadingIndicator().then(function (value) {
            if (value != null) {
                _this._setLoadingIndicatorData(value);
            }
        });
        for (var _i = 0, _a = this.sections; _i < _a.length; _i++) {
            var section_1 = _a[_i];
            sectionPromises.push(section_1.initialize());
        }
        return Promise.all(sectionPromises).then(function (sections) {
            _this.view().create(sections);
        }).finally(function () {
            _this._dismissLoadingIndicator();
        });
    };
    SectionedTable.prototype.initialize = function (controlData) {
        _super.prototype.initialize.call(this, controlData);
        var page = this.page();
        var sectionedTableBridge = new mdk_sap_1.SectionedTableBridge(page, this);
        var inEmbeddedFrame = false;
        if ((page.targetFrameId && page.targetFrameId.indexOf(FlexibleColumnFrame_1.FlexibleColumnFrame.COLUMN_TAG) !== -1) ||
            (page.isTabsTabPage && page.actionBarHidden)) {
            inEmbeddedFrame = true;
        }
        sectionedTableBridge.setInEmbeddedFrame(inEmbeddedFrame);
        this.setView(sectionedTableBridge);
        this.observable();
        this._createSection();
    };
    SectionedTable.prototype.onDataChanged = function (action, result) {
        var _this = this;
        if (this.context.readLink && result && typeof (result) === 'string') {
            var parsedResult_1 = JSON.parse(result);
            var resultObjReadLink = EvaluateTarget_1.asReadLink(parsedResult_1);
            if (action.type === 'Action.Type.ODataService.UpdateEntity' && this.context.binding) {
                var resultKeys_1 = Object.keys(parsedResult_1);
                var bindingKeys = Object.keys(this.context.binding);
                if (this.context.readLink && this.context.readLink === resultObjReadLink) {
                    bindingKeys.forEach(function (sKey) {
                        if (resultKeys_1.indexOf(sKey) < 0) {
                            parsedResult_1[sKey] = _this.context.binding[sKey];
                        }
                    });
                }
                else {
                    var navPropertyToUpdate_1;
                    for (var _i = 0, bindingKeys_1 = bindingKeys; _i < bindingKeys_1.length; _i++) {
                        var bindingKeyEach = bindingKeys_1[_i];
                        if (this.context.binding[bindingKeyEach] &&
                            typeof this.context.binding[bindingKeyEach] === 'object' && !(this.context.binding[bindingKeyEach] instanceof Array)) {
                            navPropertyToUpdate_1 = this.context.binding[bindingKeyEach];
                            if (EvaluateTarget_1.asReadLink(navPropertyToUpdate_1) === resultObjReadLink) {
                                var navPropBindingKeys = Object.keys(navPropertyToUpdate_1);
                                navPropBindingKeys.forEach(function (navSKey) {
                                    if (resultKeys_1.indexOf(navSKey) < 0) {
                                        parsedResult_1[navSKey] = navPropertyToUpdate_1[navSKey];
                                    }
                                });
                                this.context.binding[bindingKeyEach] = parsedResult_1;
                                break;
                            }
                        }
                    }
                }
            }
            if (this.context.readLink === resultObjReadLink) {
                this.context.binding = parsedResult_1;
            }
        }
        var sectionPromises = [];
        for (var _a = 0, _b = this._sections; _a < _b.length; _a++) {
            var section_2 = _b[_a];
            sectionPromises.push(section_2.observable().onDataChanged(action, result));
        }
        Promise.all(sectionPromises).then(function () {
            _this._runOnRenderedEvent();
        });
    };
    SectionedTable.prototype.redraw = function () {
        var _this = this;
        this._showLoadingIndicator();
        var sectionPromises = [];
        for (var _i = 0, _a = this.sections; _i < _a.length; _i++) {
            var section_3 = _a[_i];
            section_3.resetFlag();
            sectionPromises.push(section_3.observable().redraw());
        }
        return Promise.all(sectionPromises).then(function () {
            _this.redrawView();
        }).finally(function () {
            _this._dismissLoadingIndicator();
        });
    };
    SectionedTable.prototype.redrawView = function () {
        this.view().redraw();
        this.page().updateSearchIconVisibility();
        this._runOnRenderedEvent();
    };
    Object.defineProperty(SectionedTable.prototype, "sections", {
        get: function () {
            return this._sections;
        },
        enumerable: true,
        configurable: true
    });
    SectionedTable.prototype.setStyle = function () {
    };
    SectionedTable.prototype.viewIsNative = function () {
        return true;
    };
    SectionedTable.prototype.getFilterCriteria = function (name, values, isArrayFilterProperty) {
        var objectTableSection = null;
        for (var _i = 0, _a = this._sections; _i < _a.length; _i++) {
            var section_4 = _a[_i];
            if (section_4 instanceof ObjectTableSection_1.ObjectTableSection) {
                if (objectTableSection === null) {
                    objectTableSection = section_4;
                    break;
                }
            }
        }
        if (objectTableSection === null) {
            throw new Error(ErrorMessage_1.ErrorMessage.FILTER_SUPPORT_ONLY_TBL_SECTIONS);
        }
        var obs = objectTableSection.observable();
        if (this._filterResult === undefined) {
            var filterCriteria = void 0;
            if (values === null) {
                var itemValues = [];
                this.updateItemsForFilterCriteria(name, obs, itemValues);
                filterCriteria = new IFilterable_1.FilterCriteria(IFilterable_1.FilterType.Filter, name, name, itemValues);
            }
            else if (isArrayFilterProperty === true) {
                filterCriteria = new IFilterable_1.FilterCriteria(IFilterable_1.FilterType.Filter, undefined, undefined, values, isArrayFilterProperty);
            }
            else {
                filterCriteria = new IFilterable_1.FilterCriteria(IFilterable_1.FilterType.Filter, name, name, values);
            }
            this._filterCriteria.push(filterCriteria);
            return filterCriteria;
        }
        else {
            for (var _b = 0, _c = this._filterCriteria; _b < _c.length; _b++) {
                var filterCriteria = _c[_b];
                if (filterCriteria.name && filterCriteria.name === name) {
                    if (values === null) {
                        this.updateItemsForFilterCriteria(name, obs, filterCriteria.filterItems);
                    }
                    return filterCriteria;
                }
                else if (filterCriteria.isArrayFilterProperty === true) {
                    if (JSON.stringify(values) === JSON.stringify(filterCriteria.filterItems)) {
                        return filterCriteria;
                    }
                }
            }
        }
        throw new Error(ErrorMessage_1.ErrorMessage.NO_FILTER_CRITERIA);
    };
    SectionedTable.prototype.getSorterCriteria = function (name) {
        var objectTableSection = null;
        for (var _i = 0, _a = this._sections; _i < _a.length; _i++) {
            var section_5 = _a[_i];
            if (section_5 instanceof ObjectTableSection_1.ObjectTableSection) {
                if (objectTableSection === null) {
                    objectTableSection = section_5;
                    break;
                }
            }
        }
        if (objectTableSection === null) {
            Logger_1.Logger.instance.core.error(ErrorMessage_1.ErrorMessage.SORTER_SUPPORT_ONLY_TBL_SECTIONS);
            return null;
        }
        var items = [];
        items.push(objectTableSection.getOrderBy());
        return new IFilterable_1.FilterCriteria(IFilterable_1.FilterType.Sorter, name, null, items);
    };
    SectionedTable.prototype.parseFilterActionResult = function (filter) {
        var newFilter = '';
        var newOrderBy = '';
        for (var _i = 0, filter_1 = filter; _i < filter_1.length; _i++) {
            var filterCriteria = filter_1[_i];
            if (filterCriteria.isSorter()) {
                if (filterCriteria.filterItems.length > 0) {
                    var first = true;
                    for (var _a = 0, _b = filterCriteria.filterItems; _a < _b.length; _a++) {
                        var item = _b[_a];
                        if (first) {
                            first = false;
                        }
                        else {
                            newOrderBy = newOrderBy + ',';
                        }
                        if (typeof item === 'string') {
                            newOrderBy = item;
                        }
                    }
                }
            }
            else if (filterCriteria.isFilter()) {
                if (filterCriteria.filterItems.length > 0) {
                    if (newFilter !== '') {
                        newFilter = newFilter + ' and ';
                    }
                    var first = true;
                    for (var _c = 0, _d = filterCriteria.filterItems; _c < _d.length; _c++) {
                        var item = _d[_c];
                        if (first) {
                            newFilter = newFilter + '(';
                            first = false;
                        }
                        else {
                            newFilter = newFilter + ' or ';
                        }
                        if (filterCriteria.isArrayFilterProperty === true) {
                            if (typeof item === 'string') {
                                var queryStr = item;
                                newFilter = newFilter + CommonUtil_1.CommonUtil.refineFilterQueryString(queryStr);
                            }
                        }
                        else {
                            newFilter = newFilter + filterCriteria.name + ' eq \'' + item + '\'';
                        }
                    }
                    if (!first) {
                        newFilter = newFilter + ')';
                    }
                }
            }
            else {
                throw new Error(ErrorMessage_1.ErrorMessage.INVALID_FILTERTYPE);
            }
        }
        return new IFilterable_1.FilterActionResult(newFilter, newOrderBy);
    };
    SectionedTable.prototype.setFilterResult = function (result) {
        this._filterResult = result;
        var filterQuery = this.parseFilterActionResult(result);
        for (var _i = 0, _a = this._sections; _i < _a.length; _i++) {
            var section_6 = _a[_i];
            if (section_6 instanceof ObjectTableSection_1.ObjectTableSection) {
                var objectTableSection = section_6;
                objectTableSection.filterUpdated(filterQuery);
            }
        }
        return filterQuery;
    };
    SectionedTable.prototype.getSelectedValues = function () {
        return this._filterResult;
    };
    SectionedTable.prototype.onDisplayingModal = function (isFullPage) {
        _super.prototype.onDisplayingModal.call(this, isFullPage);
        for (var _i = 0, _a = this._sections; _i < _a.length; _i++) {
            var section_7 = _a[_i];
            section_7.onDisplayingModal(isFullPage);
        }
    };
    SectionedTable.prototype.onDismissingModal = function () {
        _super.prototype.onDismissingModal.call(this);
        for (var _i = 0, _a = this._sections; _i < _a.length; _i++) {
            var section_8 = _a[_i];
            section_8.onDismissingModal();
        }
    };
    SectionedTable.prototype.onNavigatedTo = function (initialLoading) {
        _super.prototype.onNavigatedTo.call(this, initialLoading);
        for (var _i = 0, _a = this._sections; _i < _a.length; _i++) {
            var section_9 = _a[_i];
            section_9.onNavigatedTo(initialLoading);
        }
    };
    SectionedTable.prototype.onNavigatingTo = function (initialLoading) {
        _super.prototype.onNavigatingTo.call(this, initialLoading);
        for (var _i = 0, _a = this._sections; _i < _a.length; _i++) {
            var section_10 = _a[_i];
            section_10.onNavigatingTo(initialLoading);
        }
    };
    SectionedTable.prototype.onNavigatingFrom = function (pageExists) {
        _super.prototype.onNavigatingFrom.call(this, pageExists);
        for (var _i = 0, _a = this._sections; _i < _a.length; _i++) {
            var section_11 = _a[_i];
            section_11.onNavigatingFrom(pageExists);
        }
    };
    SectionedTable.prototype.onPageUnloaded = function (pageExists) {
        _super.prototype.onPageUnloaded.call(this, pageExists);
        for (var _i = 0, _a = this._sections; _i < _a.length; _i++) {
            var section_12 = _a[_i];
            section_12.onPageUnloaded(pageExists);
        }
    };
    SectionedTable.prototype.onPageLoaded = function (initialLoading) {
        _super.prototype.onPageLoaded.call(this, initialLoading);
        for (var _i = 0, _a = this._sections; _i < _a.length; _i++) {
            var section_13 = _a[_i];
            section_13.onPageLoaded(initialLoading);
        }
    };
    SectionedTable.prototype.onLoaded = function () {
        this.page().runOnLoadedEvent();
        this._runOnRenderedEvent();
    };
    SectionedTable.prototype.setSearchText = function (search) {
        if (app.ios) {
            return this.view().setSearchString(search);
        }
        else {
            return this.page().setSearchString(search);
        }
    };
    SectionedTable.prototype.isHeaderOnly = function () {
        if (this.sections.length === 1) {
            var definition = this.sections[0].definition;
            if (definition.type === BaseSectionDefinition_1.BaseSectionDefinition.type.ObjectHeader
                || definition.type === BaseSectionDefinition_1.BaseSectionDefinition.type.ProfileHeader
                || definition.type === BaseSectionDefinition_1.BaseSectionDefinition.type.KPIHeader) {
                return true;
            }
            return false;
        }
        return false;
    };
    SectionedTable.prototype.createObservable = function () {
        return new SectionedTableObservable_1.SectionedTableObservable(this, this.definition(), this.page());
    };
    SectionedTable.prototype._createSection = function () {
        for (var _i = 0, _a = this._props.definition.getSections(); _i < _a.length; _i++) {
            var sectionDefinition = _a[_i];
            switch (sectionDefinition.type) {
                case BaseSectionDefinition_1.BaseSectionDefinition.type.Extension:
                    this._sections.push(new ExtensionSection_1.ExtensionSection(this._createSectionProps(sectionDefinition)));
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.KeyValue:
                    this._sections.push(new KeyValueSection_1.KeyValueSection(this._createSectionProps(sectionDefinition)));
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ObjectTable:
                    this._sections.push(new ObjectTableSection_1.ObjectTableSection(this._createSectionProps(sectionDefinition)));
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ObjectHeader:
                    this._sections.push(new ObjectHeaderSection_1.ObjectHeaderSection(this._createSectionProps(sectionDefinition)));
                    this.page().headerSection = true;
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ObjectCollection:
                    this._sections.push(new ObjectCollectionSection_1.ObjectCollectionSection(this._createSectionProps(sectionDefinition)));
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ContactCell:
                    this._sections.push(new ContactCellSection_1.ContactCellSection(this._createSectionProps(sectionDefinition)));
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ProfileHeader:
                    this._sections.push(new ProfileHeaderSection_1.ProfileHeaderSection(this._createSectionProps(sectionDefinition)));
                    this.page().headerSection = true;
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.SimplePropertyCollection:
                    this._sections.push(new SimplePropertyCollectionSection_1.SimplePropertyCollectionSection(this._createSectionProps(sectionDefinition)));
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ButtonSection:
                    this._sections.push(new ButtonSection_1.ButtonSection(this._createSectionProps(sectionDefinition)));
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.GridTable:
                    this._sections.push(new GridTableSection_1.GridTableSection(this._createSectionProps(sectionDefinition)));
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ImageCollection:
                    this._sections.push(new ImageCollectionSection_1.ImageCollectionSection(this._createSectionProps(sectionDefinition)));
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.KPIHeader:
                    this._sections.push(new KPIHeaderSection_1.KPIHeaderSection(this._createSectionProps(sectionDefinition)));
                    this.page().headerSection = true;
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.KPISection:
                    this._sections.push(new KPISection_1.KPISection(this._createSectionProps(sectionDefinition)));
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.AnalyticCardCollection:
                    if (app.ios || app.android) {
                        this._sections.push(new AnalyticCardCollectionSection_1.AnalyticCardCollectionSection(this._createSectionProps(sectionDefinition)));
                    }
                    else {
                        console.log("WebClient unsupported feature: AnalyticCardCollection section");
                    }
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ChartContent:
                    if (app.ios || app.android) {
                        this._sections.push(new ChartContentSection_1.ChartContentSection(this._createSectionProps(sectionDefinition)));
                    }
                    else {
                        console.log("WebClient unsupported feature: ChartContent section");
                    }
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.FormCellSection:
                    this._sections.push(new FormCellSection_1.FormCellSection(this._createSectionProps(sectionDefinition)));
                    break;
                default:
                    Logger_1.Logger.instance.ui.log("SectionedTable loadSections unsupported type encountered " + sectionDefinition.type);
                    break;
            }
        }
    };
    SectionedTable.prototype._createSectionProps = function (definition) {
        return {
            definition: definition,
            container: this,
        };
    };
    SectionedTable.prototype.updateItemsForFilterCriteria = function (name, obs, resultList) {
        var row = 0;
        var item = undefined;
        do {
            item = obs.getItem(row++);
            if (item && item[name]) {
                if (resultList.indexOf(item[name]) < 0) {
                    resultList.push(item[name]);
                }
            }
        } while (item !== undefined);
    };
    SectionedTable.prototype._runOnRenderedEvent = function () {
        var _this = this;
        var onRenderedEvent = undefined;
        if (this.definition instanceof Function) {
            onRenderedEvent = this.definition().getOnRenderedEvent();
        }
        var context = this.context;
        if (onRenderedEvent) {
            var handler_1 = new EventHandler_1.EventHandler();
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    handler_1.executeActionOrRule(onRenderedEvent, context)
                        .then(function (r) {
                        resolve(r);
                    })
                        .catch(function (e) {
                        reject(e);
                    });
                }, _this.RENDER_DELAY_IN_MS);
            });
        }
        return Promise.resolve();
    };
    return SectionedTable;
}(BaseContainer_1.BaseContainer));
exports.SectionedTable = SectionedTable;
;
