import { CommonUtil } from './CommonUtil';

export class ErrorMessage {
  public static WARN_LOG_FILE_NOT_CREATED = 'Logger is already initialized. Failed to another create Log file: {0}';
  public static ACTIVITY_INDICATOR_INSTANTIATION_FAILED = 
    'Error: ActivityIndicator instantiation failed. Use instance getter instead of new.';
  public static BANNER_INSTANTIATION_FAILED = 
    'Error: Banner instantiation failed. Use getInstance() instead of new.';       
  public static ERROR_ACCESSING_SECURE_STOIRE = 'Error accessing the SecureStore: {0}';
  public static ERROR_CREATING_LOCAL_FILE = 
    'Error happened while creating local log file handler with the given name.';
  public static ERROR_WHILE_CREATING_LOG_UPLOAD = 'Error happened while creating log upload file handler';
  public static FORMCELL_CONTAINER_MANAGER_ADD_FORM_CELL_FAILED =
    'FormCellContainerManager.ios.addFormCell() invalid parameters';
  public static FORMCELL_CONTAINER_MANAGER_POPULATE_INVALID_PARAMS = 
    'FormCellContainerManager.ios.populate() invalid parameters';
  public static FORMCELL_CONTAINER_MANAGER_UPDATE_CELLS_INVALID_PARAMS = 
    'FormCellContainerManager.ios.update() invalid parameters';
  public static LOGGER_MANAGER_NOT_INITIALIZED_YET = 'LoggerManager has not been initialized yet!';
  public static LOGGER_FAILED_TO_DELETE_LOG_FILE = 'Failed to delete log file';
  public static FUNCTION_HAS_NULL_PARAMETERS = '{0} has null parameters';
  public static ODATA_SERVICE_URL_MISSING = 'ServiceUrl missing from the definition';
  public static ODATA_SERVICE_NAME_MISSING = 'ServiceName missing from the serviceUrl';
  public static ODATA_SERVICE_URL_NOT_A_STRING = 'ServiceUrl must be a string';
  public static ODATA_INIT_OFFLINE_DATA_PROVIDER_FAILED = 'OfflineODataProvider failed to be initialized';
  public static ODATA_UDB_FILE_NOT_FOUND = '{0} not found in bundle directory: {1}';
  public static ODATA_ENTITY_PROP_NOT_FOUND = 'Could not find entity set or properties';
  public static ODATA_SERVICE_PROVIDER_NOT_FOUND = 'Could not find the service provider';
  public static ODATA_SERVICE_PROVIDER_NOT_INITIALIZED = 'Could not find the service provider, ensure it is initialized';
  public static ODATA_INVALID_OP_TYPE = 'OnlineDataProvider used to do Offline OData {0}';
  public static ODATA_SERVICE_OP_PENDING_UPLOADS = 'Service {0} failed, pending uploads exist.';
  public static ODATA_SERVICE_OP_NOT_INITIALIZED = 'Offline OData Initialize needs to be called before {0}';
  public static ODATA_MALFORMED_PARAMS = '{0} {1}';
  public static ODATA_CREATE_RELATED_ENTITY_NOT_ALLOWED = 
    'Two links forced the usage of createRelatedEntity, which is not supported';
  public static ODATA_MALFORMED_PARAM_FOUND = '{0} could not find {1} value in linking instructions';
  public static ODATA_ZERO_TARGET_RETURNED = 'A query for link targets returned zero targets';
  public static ODATA_LINKING_2_PENDING_ENTITIES_NOT_ALLOWED = 
    'Cannot link between two pending entities, i.e. two entities that have not yet been added to the offline store.';
  public static ODATA_DELETE_REQUIRED_PROPERTY_NOT_ALLOWED = 'Cannot delete the required property';
  public static ODATA_CRUD_INIT_CHANGESETMANAGER_NOT_FOUND = 
    'Wrong parameter in BaseODataCruder.initialize. Expected parameter ChangeSetManager';
  public static ODATA_UPDATE_MANDATORY_PARENT_NOT_ALLOWED = 
    'There cannot be a mandatory parent in the context of an update';
  public static ODATA_ENTITY_NAME_NOT_FOUND = '{0} could not find {1} value in linking instructions';
  public static ODATA_ENTITY_READLINK_NOT_FOUND = 'Entity with readLink {0} was not found in changeSetManager';
  public static ODATA_MORE_THAN_1_ENTITY_RETURNED = 'The query should have returned only one entity. It returned {0}';
  public static ODATA_CHANGESET_ALREADY_EXISTS = 'ChangeSet set already exists';
  public static ODATA_COMMIT_EMPTY_CHANGESET_NOT_ALLOWED = 'Cannot commit empty changeSet';
  public static ODATA_DOWNLOADMEDIA_FAILED = 'Download media failed';
  public static ODATA_DOWNLOADSTREAM_FAILED = 'Download stream data failed';
  public static ODATA_UPLOADSTREAM_FAILED = 'Upload stream data failed';
  public static ODATA_DELETE_MEDIA_LOADENTITY_FAILURE = 'Delete Media failed to load entity';
  public static ODATA_UNDO_PENDING_CHANGES_LOADENTITY_FAILURE = 'Undo pending changes failed to load entity';
  public static ODATA_CREATE_OPERATION_EMPTY_PROPERTY_NOT_ALLOWED = 
    '{0}. Properties cannot be empty for operation create.';
  public static ODATA_CREATE_MEDIA_ENTITY_FAILED = 'Create Media Entity failed: invalid params';
  public static ODATA_CREATE_RELATED_MEDIA_ENTITY_FAILED = 'Create Related Media Entity failed: invalid params';
  public static ODATA_CREATE_MEDIA_INVALID_MEDIA_CONTENT = 'Create Media Entity failed, media contents not valid';
  public static ODATA_UPLOAD_STREAM_INVALID_STREAM_DATA = 'UploadStream failed, invalid stream data';
  public static ODATA_CREATE_MEDIA_ERROR = '{0} of {1} Create Media Entity failed. Reasons {2}';
  public static ODATA_READLINK_MISSING = '{0} parameters require readLink. it is nil';
  public static ODATA_CONVERSION_NOT_IMPLEMENTED = 'Conversion of format {0} not implemented';
  public static CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED = 'Could not convert property {0} value to {1} type';
  public static CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED = 'Could not convert property {0} value: {1} to {2} type';
  public static ODATA_UNKNOWN_DATASERVICE_TYPE = 'Unknown dataService type was not online of offline service';
  public static ODATA_DOWNLOAD_NOT_INITIALIZED = 'Offline OData Initialize needs to be called before download';
  public static ODATA_UPLOAD_NOT_INITIALIZED = 'Offline OData Initialize needs to be called before upload';
  public static ODATA_INVALID_SERVICE_NAME = 'Invalid Service name';
  public static ODATA_CREATE_SERVICE_INCORRECT_PARAMETERS = 'ODataManager.createService() has incorrect parameters';
  public static ODATA_MISSING_FUNCTION_NAME_FOR_FUNCTION_IMPORT = 'Missing function name for Function Import';
  public static POPOVER_INSTANTIATION_FAILED = 
    'Error: Popover instantiation failed. Use getInstance() instead of new.';         
  public static TOASTER_INSTANTIATION_FAILED = 
    'Error: Toaster instantiation failed. Use getInstance() instead of new.';
  public static TOASTER_NO_MESSAGE = 'Error: Toaster require message.';
  public static FORM_CELL_FACTORY_INSTANTIATION_FAILED = 
    'Error: Form Cell Factory instantiation failed. Use getInstance() instead of new.';
  public static FILE_SAVE_FAILED = 'Cannot save file with path: {0}';
  public static OPEN_SERVICE_NOT_INITIALIZED = 
    'Service open failed, DataService does not exist. Did you call create()?';
  public static MESSAGEDIALIOG_INSTANTIATION_FAILED = 
    'Error: MessageDialog instantiation failed. Use getInstance() instead of new.';
  public static ODATA_INVALID_DATAPROVIDER = 'Require online DataProvider.';
  public static ODATA_INVALID_STREAM_PARAMS = 'Invalid stream function parameters.';
  public static ODATA_BELOW_ARE_CSDL_OPTIONS = 'Below are the CSDL options:';
  public static ODATA_CSDL_OPTIONS_VALUE_AFTER_SET = 'CSDL options value after set: ';
  public static ODATA_UNSUPPORTED_CSDL_OPTIONS = 'Unsupported CSDL option, ';
  public static ODATA_INVALID_CHARS_IN_HTTP_HEADERS = 'Invalid character in HTTP header value';
  public static ODATA_UNSUPPORTED_SERVICE_OPTIONS = 'Unsupported service option {0}';
  public static ODATA_SET_SERVICE_OPTIONS = 'Set service option {0}';
  public static ODATA_STORENAME_NOT_DEFINED = 'If path suffix is defined, then store name must be the defined';
  public static PROPERTY_VALUE_REQUIRED = 
    'Cannot set non-nullable property {0} of type {1}, because the value is unexpectedly null';
  public static INVALID_GLOBAL_DATETIME_FORMAT = 'Invalid global datetime format';
  
  public static format(str: string, ...args: any[]): string {
    if (str == null) {
      return '';
    } else if (args && args.length > 0) {
      return str.replace(/{(\d+)}/g, (match, i) => {
        if (i < args.length && args[i]) {
          if (typeof args[i] === 'object') {
            return args[i].toString();
          } else {
            return args[i].toString();
          }
        } else {
          return args[i];
        }
      });
    } else {
      return str;
    }
  }
  
}
