"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionResultsSegment_1 = require("./ActionResultsSegment");
var PageSegment_1 = require("./PageSegment");
var ClientDataSegment_1 = require("./ClientDataSegment");
var ControlSegment_1 = require("./ControlSegment");
var PropertySegment_1 = require("./PropertySegment");
var FirstSegment_1 = require("./FirstSegment");
var ValueSegment_1 = require("./ValueSegment");
var SelectedValueSegment_1 = require("./SelectedValueSegment");
var SelectedTargetSegment_1 = require("./SelectedTargetSegment");
var SelectedRowSegment_1 = require("./SelectedRowSegment");
var LastSegment_1 = require("./LastSegment");
var CountSegment_1 = require("./CountSegment");
var IndexSegment_1 = require("./IndexSegment");
var ApplicationSegment_1 = require("./ApplicationSegment");
var ISegmentFactory_1 = require("./ISegmentFactory");
var Segments_1 = require("../../common/Segments");
var FilterValueSegment_1 = require("./FilterValueSegment");
var SegmentFactory = (function () {
    function SegmentFactory() {
    }
    SegmentFactory.build = function (segment, context) {
        if (!segment || segment.length === 0) {
            return undefined;
        }
        var selectors = segment.split(':');
        var segmentType = selectors[0].toLowerCase().trim();
        var specifier = selectors[1] !== undefined ? selectors[1].trim() : undefined;
        if (segmentType === Segments_1.Segments.Page) {
            return new PageSegment_1.PageSegment(specifier, context);
        }
        else if (segmentType === Segments_1.Segments.ClientData) {
            return new ClientDataSegment_1.ClientDataSegment(specifier, context);
        }
        else if (segmentType === Segments_1.Segments.Control) {
            return new ControlSegment_1.ControlSegment(specifier, context);
        }
        else if (segmentType === Segments_1.Segments.Property) {
            return new PropertySegment_1.PropertySegment(specifier, context);
        }
        else if (segmentType === Segments_1.Segments.First) {
            return new FirstSegment_1.FirstSegment(specifier, context);
        }
        else if (segmentType === Segments_1.Segments.Value) {
            return new ValueSegment_1.ValueSegment(specifier, context);
        }
        else if (segmentType === Segments_1.Segments.SelectedValue) {
            return new SelectedValueSegment_1.SelectedValueSegment(specifier, context);
        }
        else if (segmentType === Segments_1.Segments.SelectedTarget) {
            return new SelectedTargetSegment_1.SelectedTargetSegment(specifier, context);
        }
        else if (segmentType === Segments_1.Segments.SelectedRow) {
            return new SelectedRowSegment_1.SelectedRowSegment(specifier, context);
        }
        else if (segmentType === Segments_1.Segments.Last) {
            return new LastSegment_1.LastSegment(specifier, context);
        }
        else if (segmentType === Segments_1.Segments.Count) {
            return new CountSegment_1.CountSegment(specifier, context);
        }
        else if (segmentType === Segments_1.Segments.Index) {
            return new IndexSegment_1.IndexSegment(specifier, context);
        }
        else if (segmentType === Segments_1.Segments.ActionResults) {
            return new ActionResultsSegment_1.ActionResultsSegment(specifier, context);
        }
        else if (segmentType === Segments_1.Segments.Application) {
            return new ApplicationSegment_1.ApplicationSegment(specifier, context);
        }
        else if (segmentType === Segments_1.Segments.FilterValue) {
            return new FilterValueSegment_1.FilterValueSegment(specifier, context);
        }
        else {
            if (typeof selectors[0] === 'number' && Number.isInteger(selectors[0]) && selectors[0] >= 0) {
                return new IndexSegment_1.IndexSegment(selectors[0], context);
            }
            else if (typeof selectors[0] === 'string' && selectors[0].match(/^[\w&.\-]+$/)) {
                return new PropertySegment_1.PropertySegment(selectors[0], context);
            }
            else {
                return undefined;
            }
        }
    };
    return SegmentFactory;
}());
exports.SegmentFactory = SegmentFactory;
ISegmentFactory_1.ISegmentFactory.setBuildFunction(SegmentFactory.build);
