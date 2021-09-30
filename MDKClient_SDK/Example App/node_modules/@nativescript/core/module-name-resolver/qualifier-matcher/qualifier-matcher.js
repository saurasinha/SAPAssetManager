Object.defineProperty(exports, "__esModule", { value: true });
var MIN_WH = "minWH";
var MIN_W = "minW";
var MIN_H = "minH";
var PRIORITY_STEP = 10000;
var minWidthHeightQualifier = {
    isMatch: function (path) {
        return (new RegExp("." + MIN_WH + "\\d+").test(path));
    },
    getMatchOccurences: function (path) {
        return path.match(new RegExp("." + MIN_WH + "\\d+", "g"));
    },
    getMatchValue: function (value, context) {
        var numVal = parseInt(value.substr(MIN_WH.length + 1));
        if (isNaN(numVal)) {
            return -1;
        }
        var actualLength = Math.min(context.width, context.height);
        if (actualLength < numVal) {
            return -1;
        }
        return PRIORITY_STEP - (actualLength - numVal);
    }
};
var minWidthQualifier = {
    isMatch: function (path) {
        return (new RegExp("." + MIN_W + "\\d+").test(path)) && !(new RegExp("." + MIN_WH + "\\d+").test(path));
    },
    getMatchOccurences: function (path) {
        return path.match(new RegExp("." + MIN_W + "\\d+", "g"));
    },
    getMatchValue: function (value, context) {
        var numVal = parseInt(value.substr(MIN_W.length + 1));
        if (isNaN(numVal)) {
            return -1;
        }
        var actualWidth = context.width;
        if (actualWidth < numVal) {
            return -1;
        }
        return PRIORITY_STEP - (actualWidth - numVal);
    }
};
var minHeightQualifier = {
    isMatch: function (path) {
        return (new RegExp("." + MIN_H + "\\d+").test(path)) && !(new RegExp("." + MIN_WH + "\\d+").test(path));
    },
    getMatchOccurences: function (path) {
        return path.match(new RegExp("." + MIN_H + "\\d+", "g"));
    },
    getMatchValue: function (value, context) {
        var numVal = parseInt(value.substr(MIN_H.length + 1));
        if (isNaN(numVal)) {
            return -1;
        }
        var actualHeight = context.height;
        if (actualHeight < numVal) {
            return -1;
        }
        return PRIORITY_STEP - (actualHeight - numVal);
    }
};
var platformQualifier = {
    isMatch: function (path) {
        return path.includes(".android") || path.includes(".ios");
    },
    getMatchOccurences: function (path) {
        return path.match(new RegExp("\\.android|\\.ios", "g"));
    },
    getMatchValue: function (value, context) {
        var val = value.substr(1);
        return val === context.os.toLowerCase() ? 1 : -1;
    }
};
var orientationQualifier = {
    isMatch: function (path) {
        return path.includes(".land") || path.includes(".port");
    },
    getMatchOccurences: function (path) {
        return path.match(new RegExp("\\.land|\\.port", "g"));
    },
    getMatchValue: function (value, context) {
        var val = value.substr(1);
        var isLandscape = (context.width > context.height) ? 1 : -1;
        return (val === "land") ? isLandscape : -isLandscape;
    }
};
var supportedQualifiers = [
    minWidthHeightQualifier,
    minWidthQualifier,
    minHeightQualifier,
    orientationQualifier,
    platformQualifier
];
function checkQualifiers(path, context) {
    var result = 0;
    for (var i = 0; i < supportedQualifiers.length; i++) {
        var qualifier = supportedQualifiers[i];
        if (qualifier.isMatch(path)) {
            var occurences = qualifier.getMatchOccurences(path);
            result = qualifier.getMatchValue(occurences[occurences.length - 1], context);
            if (result < 0) {
                return -1;
            }
            result += (supportedQualifiers.length - i) * PRIORITY_STEP;
            return result;
        }
    }
    return result;
}
function stripQualifiers(path) {
    for (var i = 0; i < supportedQualifiers.length; i++) {
        var qualifier = supportedQualifiers[i];
        if (qualifier.isMatch(path)) {
            var occurences = qualifier.getMatchOccurences(path);
            for (var j = 0; j < occurences.length; j++) {
                path = path.replace(occurences[j], "");
            }
        }
    }
    return path;
}
exports.stripQualifiers = stripQualifiers;
function findMatch(path, ext, candidates, context) {
    var fullPath = ext ? (path + ext) : path;
    var bestValue = -1;
    var result = null;
    for (var i = 0; i < candidates.length; i++) {
        var filePath = candidates[i];
        var cleanFilePath = stripQualifiers(filePath);
        if (cleanFilePath !== fullPath) {
            continue;
        }
        var value = checkQualifiers(filePath, context);
        if (value >= 0 && value > bestValue) {
            bestValue = value;
            result = candidates[i];
        }
    }
    return result;
}
exports.findMatch = findMatch;
//# sourceMappingURL=qualifier-matcher.js.map