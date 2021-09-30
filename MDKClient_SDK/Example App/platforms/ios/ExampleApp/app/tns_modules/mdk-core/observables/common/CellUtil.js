"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CellUtil = (function () {
    function CellUtil() {
    }
    CellUtil.parsePropertyName = function (dynamicTargetPath) {
        if (!dynamicTargetPath) {
            return null;
        }
        var formats = new Array(4);
        formats[0] = ['{#(Property:)((?![@{\\d]).)*[a-z_]+\\w*(\\/#(Property:)((?![@{\\d]).)*?[a-z_]+\\w*)*}', 1, -1, '#Property:', ''];
        formats[1] = ['{((?![@{\\d]).)*?[a-z_]+\\w*?}(?!})', 1, -1, '', ''];
        formats[2] = ['{{#(Property:)((?![@{\\d]).)*[a-z_]+\\w*(\\/#(Property:)((?![@{\\d]).)*?[a-z_]+\\w*)*}}', 2, -2, '#Property:', ''];
        formats[3] = ['^#(Property:)((?![@{\\d\\s]).)*[A-Za-z_]+\\w*(\\/#(Property:)((?![@{\\d\\s]).)*?[A-Za-z_]+\\w*)*$', 0, undefined, '#Property:', ''];
        for (var _i = 0, formats_1 = formats; _i < formats_1.length; _i++) {
            var format = formats_1[_i];
            var pattern = new RegExp(format[0], 'ig');
            var sPropsRaw = dynamicTargetPath.match(pattern);
            if (sPropsRaw) {
                var sProps = new Array(sPropsRaw.length);
                for (var j = 0; j < sPropsRaw.length; j++) {
                    sProps[j] = sPropsRaw[j].slice(format[1], format[2]);
                    if (format[3].length > 0) {
                        var replPat = new RegExp(format[3], 'ig');
                        sProps[j] = sProps[j].replace(replPat, format[4]);
                    }
                }
                return sProps;
            }
        }
        return null;
    };
    CellUtil.objectCellSearchKeys = [
        'Title', 'Subhead', 'Footnote', 'Description', 'StatusText', 'SubstatusText',
    ];
    return CellUtil;
}());
exports.CellUtil = CellUtil;
;
