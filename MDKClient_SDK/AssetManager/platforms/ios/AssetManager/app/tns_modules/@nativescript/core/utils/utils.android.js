function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var native_helper_1 = require("./native-helper");
exports.ad = native_helper_1.ad;
var platform_1 = require("../platform");
var file_system_access_1 = require("../file-system/file-system-access");
var trace_1 = require("../trace");
__export(require("./utils-common"));
var MIN_URI_SHARE_RESTRICTED_APK_VERSION = 24;
function GC() {
    gc();
}
exports.GC = GC;
function releaseNativeObject(object) {
    __releaseNativeCounterpart(object);
}
exports.releaseNativeObject = releaseNativeObject;
function openUrl(location) {
    var context = native_helper_1.ad.getApplicationContext();
    try {
        var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(location.trim()));
        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }
    catch (e) {
        trace_1.write("Error in OpenURL", trace_1.categories.Error, trace_1.messageType.error);
        return false;
    }
    return true;
}
exports.openUrl = openUrl;
function isExternalStorageReadOnly() {
    var extStorageState = android.os.Environment.getExternalStorageState();
    if (android.os.Environment.MEDIA_MOUNTED_READ_ONLY === extStorageState) {
        return true;
    }
    return false;
}
function isExternalStorageAvailable() {
    var extStorageState = android.os.Environment.getExternalStorageState();
    if (android.os.Environment.MEDIA_MOUNTED === extStorageState) {
        return true;
    }
    return false;
}
function getMimeTypeNameFromExtension(filePath) {
    var mimeTypeMap = android.webkit.MimeTypeMap.getSingleton();
    var extension = new file_system_access_1.FileSystemAccess()
        .getFileExtension(filePath)
        .replace(".", "")
        .toLowerCase();
    return mimeTypeMap.getMimeTypeFromExtension(extension);
}
function openFile(filePath) {
    var context = native_helper_1.ad.getApplicationContext();
    try {
        if (!isExternalStorageAvailable()) {
            trace_1.write("\nExternal storage is unavailable (please check app permissions).\nApplications cannot access internal storage of other application on Android (see: https://developer.android.com/guide/topics/data/data-storage).\n", trace_1.categories.Error, trace_1.messageType.error);
            return false;
        }
        if (isExternalStorageReadOnly()) {
            trace_1.write("External storage is read only", trace_1.categories.Error, trace_1.messageType.error);
            return false;
        }
        var mimeType = getMimeTypeNameFromExtension(filePath);
        var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW);
        var chooserIntent = android.content.Intent.createChooser(intent, "Open File...");
        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        chooserIntent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        var sdkVersion = parseInt(platform_1.device.sdkVersion, 10);
        if (sdkVersion && sdkVersion < MIN_URI_SHARE_RESTRICTED_APK_VERSION) {
            trace_1.write("detected sdk version " + sdkVersion + " (< " + MIN_URI_SHARE_RESTRICTED_APK_VERSION + "), using simple openFile", trace_1.categories.Debug);
            intent.setDataAndType(android.net.Uri.fromFile(new java.io.File(filePath)), mimeType);
            context.startActivity(chooserIntent);
            return true;
        }
        trace_1.write("detected sdk version " + sdkVersion + " (>= " + MIN_URI_SHARE_RESTRICTED_APK_VERSION + "), using URI openFile", trace_1.categories.Debug);
        var providerName = context.getPackageName() + ".provider";
        trace_1.write("fully-qualified provider name [" + providerName + "]", trace_1.categories.Debug);
        var apkURI = androidx.core.content.FileProvider.getUriForFile(context, providerName, new java.io.File(filePath));
        intent.addFlags(android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION);
        chooserIntent.addFlags(android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.setDataAndType(apkURI, mimeType);
        context.startActivity(chooserIntent);
        return true;
    }
    catch (err) {
        var msg_1 = err.message ? ": " + err.message : "";
        trace_1.write("Error in openFile" + msg_1, trace_1.categories.Error, trace_1.messageType.error);
        if (msg_1 &&
            msg_1.includes("Attempt to invoke virtual method") &&
            msg_1.includes("android.content.pm.ProviderInfo.loadXmlMetaData") &&
            msg_1.includes("on a null object reference")) {
            trace_1.write("\nPlease ensure you have your manifest correctly configured with the FileProvider.\n(see: https://developer.android.com/reference/android/support/v4/content/FileProvider#ProviderDefinition)\n", trace_1.categories.Error);
        }
        return false;
    }
}
exports.openFile = openFile;
function isRealDevice() {
    return native_helper_1.ad.isRealDevice();
}
exports.isRealDevice = isRealDevice;
//# sourceMappingURL=utils.android.js.map