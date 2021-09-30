"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CreateODataRelatedMediaActionDefinition_1 = require("../definitions/actions/CreateODataRelatedMediaActionDefinition");
var ODataAction_1 = require("./ODataAction");
var IDataService_1 = require("../data/IDataService");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ODataActionBuilder_1 = require("../builders/odata/ODataActionBuilder");
var SLUG_STRING = 'slug:';
var CreateODataRelatedMediaAction = (function (_super) {
    __extends(CreateODataRelatedMediaAction, _super);
    function CreateODataRelatedMediaAction(definition) {
        var _this = _super.call(this, definition) || this;
        _this.headerKeys = [];
        if (!(definition instanceof CreateODataRelatedMediaActionDefinition_1.CreateODataRelatedMediaActionDefinition)) {
            throw new Error('Cannot instantiate CreateODataRelatedMediaActionDefinition without CreateODataRelatedMediaActionDefinition');
        }
        return _this;
    }
    CreateODataRelatedMediaAction.prototype.execute = function () {
        var _this = this;
        var definition = this.definition;
        var builder = new ODataActionBuilder_1.ODataActionBuilder(this.context());
        builder.setMedia(definition.getMedia());
        return Promise.all([
            EvaluateTarget_1.asService(this.definition.data, this.context()),
            EvaluateTarget_1.asParent(this.definition.data, this.context()),
            this._resolveValue(definition.getMedia())
        ]).then(function (result) {
            var service = result[0];
            _this.setEmptyProperties(service);
            _this._resolvedEntitySet = service.entitySet;
            var parent = result[1];
            var headers = service.headers;
            if (service.offlineEnabled && headers.slug) {
                headers['OfflineOData.HeaderFormat'] = SLUG_STRING + headers.slug;
                delete headers.slug;
            }
            return builder.build().then(function (params) {
                var media = params.media;
                return IDataService_1.IDataService.instance().createRelatedMedia(service, parent, headers, media).then(function (mediaEntities) {
                    var mediaReadLinks = [];
                    var mediaReadLinksKey = 'mediaReadLinks';
                    for (var _i = 0, mediaEntities_1 = mediaEntities; _i < mediaEntities_1.length; _i++) {
                        var entity = mediaEntities_1[_i];
                        mediaReadLinks.push(EvaluateTarget_1.asReadLink(entity));
                    }
                    _this.context().clientData[mediaReadLinksKey] = mediaReadLinks;
                    return new ActionResultBuilder_1.ActionResultBuilder().data(mediaReadLinks).build();
                });
            });
        });
    };
    CreateODataRelatedMediaAction.prototype.publishAfterSuccess = function () {
        return Promise.resolve(true);
    };
    return CreateODataRelatedMediaAction;
}(ODataAction_1.ODataAction));
exports.CreateODataRelatedMediaAction = CreateODataRelatedMediaAction;
;
