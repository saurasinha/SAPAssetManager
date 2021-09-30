"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CreateODataMediaActionDefinition_1 = require("../definitions/actions/CreateODataMediaActionDefinition");
var ODataAction_1 = require("./ODataAction");
var IDataService_1 = require("../data/IDataService");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ODataActionBuilder_1 = require("../builders/odata/ODataActionBuilder");
var SLUG_STRING = 'slug:';
var CreateODataMediaAction = (function (_super) {
    __extends(CreateODataMediaAction, _super);
    function CreateODataMediaAction(definition) {
        var _this = _super.call(this, definition) || this;
        _this.headerKeys = [];
        if (!(definition instanceof CreateODataMediaActionDefinition_1.CreateODataMediaActionDefinition)) {
            throw new Error('Cannot instantiate CreateODataMediaActionDefinition without CreateODataMediaActionDefinition');
        }
        return _this;
    }
    CreateODataMediaAction.prototype.execute = function () {
        var _this = this;
        var definition = this.definition;
        var builder = new ODataActionBuilder_1.ODataActionBuilder(this.context());
        builder.setMedia(definition.getMedia());
        return Promise.all([
            EvaluateTarget_1.asService(this.definition.data, this.context()),
            this._resolveValue(definition.getMedia())
        ]).then(function (result) {
            var service = result[0];
            _this._resolvedEntitySet = service.entitySet;
            var headers = service.headers;
            if (service.offlineEnabled && headers.slug) {
                headers['OfflineOData.HeaderFormat'] = SLUG_STRING + headers.slug;
                delete headers.slug;
            }
            return builder.build().then(function (params) {
                var media = params.media;
                return IDataService_1.IDataService.instance().createMedia(service, headers, media).then(function (mediaEntities) {
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
    CreateODataMediaAction.prototype.publishAfterSuccess = function () {
        return Promise.resolve(true);
    };
    return CreateODataMediaAction;
}(ODataAction_1.ODataAction));
exports.CreateODataMediaAction = CreateODataMediaAction;
;
