"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage = (function () {
    function ErrorMessage() {
    }
    ErrorMessage.format = function (str) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (str == null) {
            return '';
        }
        else if (args && args.length > 0) {
            return str.replace(/{(\d+)}/g, function (match, i) {
                if (i < args.length && args[i]) {
                    if (typeof args[i] === 'object') {
                        return args[i].toString();
                    }
                    else {
                        return args[i].toString();
                    }
                }
                else {
                    return args[i];
                }
            });
        }
        else {
            return str;
        }
    };
    ErrorMessage.WARN_LOG_FILE_NOT_CREATED = 'Logger is already initialized. Failed to another create Log file: {0}';
    ErrorMessage.ACTIVITY_INDICATOR_INSTANTIATION_FAILED = 'Error: ActivityIndicator instantiation failed. Use instance getter instead of new.';
    ErrorMessage.BANNER_INSTANTIATION_FAILED = 'Error: Banner instantiation failed. Use getInstance() instead of new.';
    ErrorMessage.ERROR_ACCESSING_SECURE_STOIRE = 'Error accessing the SecureStore: {0}';
    ErrorMessage.ERROR_CREATING_LOCAL_FILE = 'Error happened while creating local log file handler with the given name.';
    ErrorMessage.ERROR_WHILE_CREATING_LOG_UPLOAD = 'Error happened while creating log upload file handler';
    ErrorMessage.FORMCELL_CONTAINER_MANAGER_ADD_FORM_CELL_FAILED = 'FormCellContainerManager.ios.addFormCell() invalid parameters';
    ErrorMessage.FORMCELL_CONTAINER_MANAGER_POPULATE_INVALID_PARAMS = 'FormCellContainerManager.ios.populate() invalid parameters';
    ErrorMessage.FORMCELL_CONTAINER_MANAGER_UPDATE_CELLS_INVALID_PARAMS = 'FormCellContainerManager.ios.update() invalid parameters';
    ErrorMessage.LOGGER_MANAGER_NOT_INITIALIZED_YET = 'LoggerManager has not been initialized yet!';
    ErrorMessage.LOGGER_FAILED_TO_DELETE_LOG_FILE = 'Failed to delete log file';
    ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS = '{0} has null parameters';
    ErrorMessage.ODATA_SERVICE_URL_MISSING = 'ServiceUrl missing from the definition';
    ErrorMessage.ODATA_SERVICE_NAME_MISSING = 'ServiceName missing from the serviceUrl';
    ErrorMessage.ODATA_SERVICE_URL_NOT_A_STRING = 'ServiceUrl must be a string';
    ErrorMessage.ODATA_INIT_OFFLINE_DATA_PROVIDER_FAILED = 'OfflineODataProvider failed to be initialized';
    ErrorMessage.ODATA_UDB_FILE_NOT_FOUND = '{0} not found in bundle directory: {1}';
    ErrorMessage.ODATA_ENTITY_PROP_NOT_FOUND = 'Could not find entity set or properties';
    ErrorMessage.ODATA_SERVICE_PROVIDER_NOT_FOUND = 'Could not find the service provider';
    ErrorMessage.ODATA_SERVICE_PROVIDER_NOT_INITIALIZED = 'Could not find the service provider, ensure it is initialized';
    ErrorMessage.ODATA_INVALID_OP_TYPE = 'OnlineDataProvider used to do Offline OData {0}';
    ErrorMessage.ODATA_SERVICE_OP_PENDING_UPLOADS = 'Service {0} failed, pending uploads exist.';
    ErrorMessage.ODATA_SERVICE_OP_NOT_INITIALIZED = 'Offline OData Initialize needs to be called before {0}';
    ErrorMessage.ODATA_MALFORMED_PARAMS = '{0} {1}';
    ErrorMessage.ODATA_CREATE_RELATED_ENTITY_NOT_ALLOWED = 'Two links forced the usage of createRelatedEntity, which is not supported';
    ErrorMessage.ODATA_MALFORMED_PARAM_FOUND = '{0} could not find {1} value in linking instructions';
    ErrorMessage.ODATA_ZERO_TARGET_RETURNED = 'A query for link targets returned zero targets';
    ErrorMessage.ODATA_LINKING_2_PENDING_ENTITIES_NOT_ALLOWED = 'Cannot link between two pending entities, i.e. two entities that have not yet been added to the offline store.';
    ErrorMessage.ODATA_DELETE_REQUIRED_PROPERTY_NOT_ALLOWED = 'Cannot delete the required property';
    ErrorMessage.ODATA_CRUD_INIT_CHANGESETMANAGER_NOT_FOUND = 'Wrong parameter in BaseODataCruder.initialize. Expected parameter ChangeSetManager';
    ErrorMessage.ODATA_UPDATE_MANDATORY_PARENT_NOT_ALLOWED = 'There cannot be a mandatory parent in the context of an update';
    ErrorMessage.ODATA_ENTITY_NAME_NOT_FOUND = '{0} could not find {1} value in linking instructions';
    ErrorMessage.ODATA_ENTITY_READLINK_NOT_FOUND = 'Entity with readLink {0} was not found in changeSetManager';
    ErrorMessage.ODATA_MORE_THAN_1_ENTITY_RETURNED = 'The query should have returned only one entity. It returned {0}';
    ErrorMessage.ODATA_CHANGESET_ALREADY_EXISTS = 'ChangeSet set already exists';
    ErrorMessage.ODATA_COMMIT_EMPTY_CHANGESET_NOT_ALLOWED = 'Cannot commit empty changeSet';
    ErrorMessage.ODATA_DOWNLOADMEDIA_FAILED = 'Download media failed';
    ErrorMessage.ODATA_DOWNLOADSTREAM_FAILED = 'Download stream data failed';
    ErrorMessage.ODATA_UPLOADSTREAM_FAILED = 'Upload stream data failed';
    ErrorMessage.ODATA_DELETE_MEDIA_LOADENTITY_FAILURE = 'Delete Media failed to load entity';
    ErrorMessage.ODATA_UNDO_PENDING_CHANGES_LOADENTITY_FAILURE = 'Undo pending changes failed to load entity';
    ErrorMessage.ODATA_CREATE_OPERATION_EMPTY_PROPERTY_NOT_ALLOWED = '{0}. Properties cannot be empty for operation create.';
    ErrorMessage.ODATA_CREATE_MEDIA_ENTITY_FAILED = 'Create Media Entity failed: invalid params';
    ErrorMessage.ODATA_CREATE_RELATED_MEDIA_ENTITY_FAILED = 'Create Related Media Entity failed: invalid params';
    ErrorMessage.ODATA_CREATE_MEDIA_INVALID_MEDIA_CONTENT = 'Create Media Entity failed, media contents not valid';
    ErrorMessage.ODATA_UPLOAD_STREAM_INVALID_STREAM_DATA = 'UploadStream failed, invalid stream data';
    ErrorMessage.ODATA_CREATE_MEDIA_ERROR = '{0} of {1} Create Media Entity failed. Reasons {2}';
    ErrorMessage.ODATA_READLINK_MISSING = '{0} parameters require readLink. it is nil';
    ErrorMessage.ODATA_CONVERSION_NOT_IMPLEMENTED = 'Conversion of format {0} not implemented';
    ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED = 'Could not convert property {0} value to {1} type';
    ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED = 'Could not convert property {0} value: {1} to {2} type';
    ErrorMessage.ODATA_UNKNOWN_DATASERVICE_TYPE = 'Unknown dataService type was not online of offline service';
    ErrorMessage.ODATA_DOWNLOAD_NOT_INITIALIZED = 'Offline OData Initialize needs to be called before download';
    ErrorMessage.ODATA_UPLOAD_NOT_INITIALIZED = 'Offline OData Initialize needs to be called before upload';
    ErrorMessage.ODATA_INVALID_SERVICE_NAME = 'Invalid Service name';
    ErrorMessage.ODATA_CREATE_SERVICE_INCORRECT_PARAMETERS = 'ODataManager.createService() has incorrect parameters';
    ErrorMessage.ODATA_MISSING_FUNCTION_NAME_FOR_FUNCTION_IMPORT = 'Missing function name for Function Import';
    ErrorMessage.POPOVER_INSTANTIATION_FAILED = 'Error: Popover instantiation failed. Use getInstance() instead of new.';
    ErrorMessage.TOASTER_INSTANTIATION_FAILED = 'Error: Toaster instantiation failed. Use getInstance() instead of new.';
    ErrorMessage.TOASTER_NO_MESSAGE = 'Error: Toaster require message.';
    ErrorMessage.FORM_CELL_FACTORY_INSTANTIATION_FAILED = 'Error: Form Cell Factory instantiation failed. Use getInstance() instead of new.';
    ErrorMessage.FILE_SAVE_FAILED = 'Cannot save file with path: {0}';
    ErrorMessage.OPEN_SERVICE_NOT_INITIALIZED = 'Service open failed, DataService does not exist. Did you call create()?';
    ErrorMessage.MESSAGEDIALIOG_INSTANTIATION_FAILED = 'Error: MessageDialog instantiation failed. Use getInstance() instead of new.';
    ErrorMessage.ODATA_INVALID_DATAPROVIDER = 'Require online DataProvider.';
    ErrorMessage.ODATA_INVALID_STREAM_PARAMS = 'Invalid stream function parameters.';
    ErrorMessage.ODATA_BELOW_ARE_CSDL_OPTIONS = 'Below are the CSDL options:';
    ErrorMessage.ODATA_CSDL_OPTIONS_VALUE_AFTER_SET = 'CSDL options value after set: ';
    ErrorMessage.ODATA_UNSUPPORTED_CSDL_OPTIONS = 'Unsupported CSDL option, ';
    ErrorMessage.ODATA_INVALID_CHARS_IN_HTTP_HEADERS = 'Invalid character in HTTP header value';
    ErrorMessage.ODATA_UNSUPPORTED_SERVICE_OPTIONS = 'Unsupported service option {0}';
    ErrorMessage.ODATA_SET_SERVICE_OPTIONS = 'Set service option {0}';
    ErrorMessage.ODATA_STORENAME_NOT_DEFINED = 'If path suffix is defined, then store name must be the defined';
    ErrorMessage.PROPERTY_VALUE_REQUIRED = 'Cannot set non-nullable property {0} of type {1}, because the value is unexpectedly null';
    ErrorMessage.INVALID_GLOBAL_DATETIME_FORMAT = 'Invalid global datetime format';
    return ErrorMessage;
}());
exports.ErrorMessage = ErrorMessage;
