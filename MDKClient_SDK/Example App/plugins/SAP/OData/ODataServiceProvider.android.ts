import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
import { ODataServiceUtils } from './ODataServiceUtils';
import { ODataConverter } from './ODataConverter';
import { ODataHelper } from './ODataHelper';
import { ChangeSetManager } from './crud/ChangeSetManager';
import { messageType, write } from 'tns-core-modules/trace';
import { DataConverter } from '../Common/DataConverter';
import { SharedLoggerManager } from '../Foundation/Common/SharedLogger/SharedLoggerManager';
import { CommonUtil } from '../ErrorHandling/CommonUtil';
import * as application from 'tns-core-modules/application';
import { WelcomeScreen } from '../Onboarding/WelcomeScreen';

declare var com;
declare var java;
declare var android;
declare var okhttp3;
declare var org;
declare var ch;
const clientODataPkg = com.sap.mdk.client.odata;
const foundationPkg = com.sap.cloud.mobile.foundation;
const oDataPkg = com.sap.cloud.mobile.odata;
const offlineODataPkg = com.sap.cloud.mobile.odata.offline;
const UploadCategory = oDataPkg.offline.OfflineODataRequestOptions.UploadCategory;
const clientFoundationPkg = com.sap.mdk.client.foundation;

enum StateChangeOperation {
  Close = 'Close',
  Clear = 'Clear',
}

enum StoreStates {
  Uninitialized = 'Uninitialized', 
  Initialized = 'Initialized', 
  Closed = 'Closed',
  Error = 'Error',
};

export class ODataServiceProvider {
  public static clear(context: any, serviceUrl: string) {
    return new Promise((resolve, reject) => {
      try {
        oDataPkg.core.AndroidSystem.setContext(context);
        let serviceName = ODataServiceUtils.getServiceName(serviceUrl);
        offlineODataPkg.OfflineODataProvider.clear(new java.net.URL('file:/' + 
          ODataServiceProvider.offlineODataDirectory(context)), serviceName);
        resolve(null);
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));   
      }
    });
  }

  public static getServiceTimeZoneAbbreviation(): string {
    return ODataServiceProvider.serviceTimeZoneAbbreviation;
  }

  private static _wakeLock: any = null;
  private static demoDBPath: string;
  private static serviceTimeZoneAbbreviation: string = 'UTC';
  // __transaction_merge - update locally created request are merged as 1 request
  // __create_delete_merge - delete locally created request are removed instead of submitting them
  private static readonly extraStreamParameters = '__transaction_merge;__create_delete_merge;';

  private static offlineODataDirectory(context: any): string {
    if (!context) {
      return null;
    }

    const workingODataDir = context.getExternalFilesDir(null).getAbsolutePath();
    return workingODataDir;
  }

  private static toJSError(error: any): any {
    if (error == null) {
      return error;
    }
    if (error instanceof Error) {
      return CommonUtil.formatJSError(error);
    } else if (error instanceof java.lang.Exception) {
      let jsError = new Error(error.getMessage());
      return CommonUtil.formatJSError(jsError);
    } else {
      return new Error('Invalid Error Object');
    }
  }

  private static releaseWakeLock() {
    if (ODataServiceProvider._wakeLock) {
      try {
        if (ODataServiceProvider._wakeLock.isHeld()) {
          ODataServiceProvider._wakeLock.release();
        }
      } catch (error) {
        write(ODataServiceProvider.toJSError(error).message, 'mdk.trace.odata', messageType.error);
      }

      ODataServiceProvider._wakeLock = null;
    }
  }

  private dataService: any;
  private changeSetManager: ChangeSetManager;
  private isOnlineServiceOpen: boolean;
  private storeStates: StoreStates = StoreStates.Uninitialized;
  private static prevUser: string = '';

  public constructor() {
    // Please refer to iOS OfflineODataLoggerInternal.init function
    // The log level is set to Off
    let logger = org.slf4j.LoggerFactory.getLogger('com.sap.cloud.mobile.odata.offline');
    logger.setLevel(ch.qos.logback.classic.Level.OFF);
  }

  /// Offline specific methods
  public download(params: any): Promise<any> {
    if (this.dataService == null) {
      return Promise.reject(new Error(ErrorMessage.ODATA_DOWNLOAD_NOT_INITIALIZED));
    }

    return new Promise((resolve, reject) => {
      let provider = this.getOfflineODataProvider();

      let successHandler = new oDataPkg.core.Action0({
        call: () => resolve(null),
      });
      let failureHandler = new oDataPkg.core.Action1({
        call: (error) => {
          let jsError = ODataServiceProvider.toJSError(error);
          reject(CommonUtil.formatOfflineError(jsError));
        },
      });

      if (params.definingRequests) {
        let subset = new java.util.ArrayList();
        for (let req of params.definingRequests) {
          let name = req.Name;
          let query = req.Query;
          if (typeof name === 'string' && typeof query === 'string') {
            let autoRetrieveStreams = typeof(req.AutomaticallyRetrievesStreams) === 'boolean' ?
              req.AutomaticallyRetrievesStreams : false;

            let defQuery = new offlineODataPkg.OfflineODataDefiningQuery(name, query, autoRetrieveStreams);
            try {
              provider.addDefiningQuery(defQuery);
            } catch (error) {
              // Typically if we get here, we have already added the defining query to the service. Currently, there 
              // is no way to check with the service to see if the defining query already exists. So, it doesn't make
              // much sense to fail the download just because we are adding the defining query twice.  If we failed
              // for something else on the add, we're going to fail the download and catch that.
            }
            subset.add(defQuery);
          }
        }
        provider.download(subset, successHandler, failureHandler);
      } else {
        provider.download(successHandler, failureHandler);
      }
    });
  }

  public initOfflineStore(context: any, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let storeParams = new offlineODataPkg.OfflineODataParameters();
      storeParams.setEnableRepeatableRequests(true);
      let inDemoMode = typeof params.inDemoMode === 'boolean' ? params.inDemoMode : false;
      ODataServiceProvider.demoDBPath = null; // default to null, set when valid

      if (inDemoMode) {
        // If we are in demo mode, process the dbPath param so we can access the local udb files
        let paramDbPath = params.dbPath ? params.dbPath : '';
        let dPath = paramDbPath;
        if (dPath.endsWith('.udb')) {
          if (!dPath.startsWith('/')) {
            dPath = '/' + dPath;
          }
          let dbRelativeFolder = dPath.substring(0, dPath.lastIndexOf('/'));
          // Supported in API 26
          // let path = java.nio.file.Paths.get(documentsFolder + dPath);
          // if (java.nio.file.Files.exists(path)) {
          ODataServiceProvider.demoDBPath = dbRelativeFolder;
          // }
        }
      }

      if (typeof params.serviceTimeZoneAbbreviation === 'string' && params.serviceTimeZoneAbbreviation.length !== 0) {
        ODataServiceProvider.serviceTimeZoneAbbreviation = params.serviceTimeZoneAbbreviation;
      }

      if (typeof params.storeEncryptionKey === 'string') {
        storeParams.setStoreEncryptionKey(params.storeEncryptionKey);
      }
      if (params.serviceHeaders) {
        storeParams.setCustomHeaders(this.getHeadersMap(params.serviceHeaders));
      }
      if (params.currentUser) {
        storeParams.setCurrentUser(params.currentUser);
      }
      
      // This flag is set to true only for multi-user. No need to set for single-user mode.
      // During the single user to multi user switch scenario, 
      // `MultiUserEnabled` property from `BrandedSettings` may not give appropriate value of whether app is running in single user or multi user mode.
      // Hence, fetch this value from MDC layer.
      let isAppInMultiUserMode:boolean = WelcomeScreen.getInstance().isAppInMultiUserMode();
      if(isAppInMultiUserMode) {
        storeParams.setForceUploadOnUserSwitch(isAppInMultiUserMode);
      }

      let storeParameters = params.storeParameters;
      if (storeParameters) {
        if (storeParameters.EnableIndividualErrorArchiveDeletion === true) {
          storeParams.setEnableIndividualErrorArchiveDeletion(true);
        }
        if (storeParameters.StoreName) {
          storeParams.setStoreName(storeParameters.StoreName);
        }
        if (storeParameters.EnableRepeatableRequests === false) {
          storeParams.setEnableRepeatableRequests(false);
        }
        if (storeParameters.Timeout && !isNaN(Number(storeParameters.Timeout.toString()))) {
          storeParams.setTimeout(java.lang.Integer.valueOf(storeParameters.Timeout.toString()));
        }
        if (storeParameters.EnableUndoLocalCreation) {
          storeParams.setEnableUndoLocalCreation(storeParameters.EnableUndoLocalCreation);
        }
        if (storeParameters.EnableRequestQueueOptimization) {
          storeParams.setEnableRequestQueueOptimization(storeParameters.EnableRequestQueueOptimization);
        }
      }

      let serviceURL = params.serviceUrl;
      if (serviceURL != null) {
        let powerManager = context.getSystemService(
          android.content.Context.POWER_SERVICE);

        ODataServiceProvider.releaseWakeLock();

        ODataServiceProvider._wakeLock = powerManager.newWakeLock
          (android.os.PowerManager.FULL_WAKE_LOCK, 'MyApp::MyWakelockTag');

        try {
          if (!storeParams.getStoreName()) {
            if (ODataServiceUtils.hasPathSuffix(serviceURL)) {
              reject(new Error(ErrorMessage.ODATA_STORENAME_NOT_DEFINED));
              return;
            }
            let storeName = ODataServiceUtils.getServiceName(serviceURL);
            if (storeName != null) {
              storeParams.setStoreName(storeName);
            }
          }

          storeParams.setStorePath(new java.net.URL('file:/' + ODataServiceProvider.offlineODataDirectory(context)));
          storeParams.setExtraStreamParameters(ODataServiceProvider.extraStreamParameters);
          
          let udbFileExists = false;
          if (storeParams.getStoreName() != null) {
            if (inDemoMode) {
              this.initDemoDatabase(context, storeParams.getStoreName());

              let builder = new okhttp3.OkHttpClient.Builder();
              foundationPkg.common.ClientProvider.set(builder.build());
            } else {
              let odataDir = ODataServiceProvider.offlineODataDirectory(context);
              let udbFilename = storeParams.getStoreName() + '.udb';
              let udbFile = new java.io.File(odataDir + '/' + udbFilename);
              udbFileExists = udbFile.exists();
            }
          }

          let okHttpClient = foundationPkg.common.ClientProvider.get();

          oDataPkg.core.AndroidSystem.setContext(context);

          let progressTextObj = DataConverter.toJavaObject(params.progressText);
          let provider = new offlineODataPkg.OfflineODataProvider(new java.net.URL(serviceURL), storeParams, 
            okHttpClient, null, new oDataPkg.mdk.MDKOfflineODataDelegate(context, progressTextObj));

          provider = this.applyOfflineServiceOptions(params, provider);
          provider = this.applyCsdlOptions(params, provider);

          ODataServiceProvider.prevUser = provider.getPreviousUser();

          let debugODataProvider = params.debugODataProvider;
          if (debugODataProvider) {
            let logger = org.slf4j.LoggerFactory.getLogger('com.sap.cloud.mobile.odata.offline');
            logger.setLevel(ch.qos.logback.classic.Level.DEBUG);
          }

          if (params.definingRequests) {
            for (let req of params.definingRequests) {
              let name = req.Name;
              let query = req.Query;
              if (typeof name === 'string' && typeof query === 'string') {
                let autoRetrieveStreams = typeof(req.AutomaticallyRetrievesStreams) === 'boolean' ?
                  req.AutomaticallyRetrievesStreams : false;

                let defQuery = new offlineODataPkg.OfflineODataDefiningQuery(name, query, autoRetrieveStreams);
                provider.addDefiningQuery(defQuery);
              }
            }
          }


          ODataServiceProvider._wakeLock.acquire();

          provider.open(new oDataPkg.core.Action0({
            call: () => {
              ODataServiceProvider.releaseWakeLock();
              this.storeStates = StoreStates.Initialized;
              this.dataService = new oDataPkg.DataService(provider);
              resolve(null);
            },
          }), new oDataPkg.core.Action1({
            call: (error) => {
              ODataServiceProvider.releaseWakeLock();
              if (!udbFileExists) {
                this.storeStates = StoreStates.Error;
              }
              let jsError = ODataServiceProvider.toJSError(error);
              reject(CommonUtil.formatOfflineError(jsError));
            },
          }));
        } catch (error) {
          ODataServiceProvider.releaseWakeLock();
          reject(ODataServiceProvider.toJSError(error));
        }
      } else {
        reject(new Error(ErrorMessage.ODATA_INIT_OFFLINE_DATA_PROVIDER_FAILED));
      }
    });
  }

  public upload(params: any): Promise<any> {
    if (this.dataService == null) {
      return Promise.reject(new Error(ErrorMessage.ODATA_UPLOAD_NOT_INITIALIZED));
    }

    return new Promise((resolve, reject) => {
      let provider = this.getOfflineODataProvider();

      try {
        if (this.getOfflineODataProvider().isRequestQueueEmpty()) {
          resolve(null);
          return;
        }
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
        return;
      }

      const successHandler = new oDataPkg.core.Action0({
        call: () => resolve(null),
      });

      const failureHandler = new oDataPkg.core.Action1({
        call: (error) => {
          let jsError = ODataServiceProvider.toJSError(error);
          reject(CommonUtil.formatOfflineError(jsError));
        },
      });

      if(params.uploadCategories){
        const uploadCategoryArr : [typeof UploadCategory?] = [];
        for (let category of params.uploadCategories){
          uploadCategoryArr.push(new UploadCategory(category));
        }
        provider.upload(uploadCategoryArr, successHandler, failureHandler);
      } else {
        provider.upload(successHandler, failureHandler);
      }
      
    });
  }

  public clear(params: any): Promise<any> {
    return this.offlineStateChange(params, StateChangeOperation.Clear);
  }

  public close(params: any): Promise<any> {
    return this.offlineStateChange(params, StateChangeOperation.Close);
  }

  public cancelUpload(params: any): Promise<any> {
    if (this.dataService == null) {
      return Promise.reject(new Error(ErrorMessage.ODATA_UPLOAD_NOT_INITIALIZED));
    }
    return new Promise((resolve, reject) => {
      try {
        this.getOfflineODataProvider().cancelUpload();
        resolve(null);
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
      }
    });
  }

  public cancelDownload(params: any): Promise<any> {
    if (this.dataService == null) {
      return Promise.reject(new Error(ErrorMessage.ODATA_DOWNLOAD_NOT_INITIALIZED));
    }
    return new Promise((resolve, reject) => {
      try {
        this.getOfflineODataProvider().cancelDownload();
        resolve(null);
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
      }
    });
  }

  /// Online specific methods
  public create(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let onlineServiceName = null;
      let serviceURL = params.serviceUrl;
      if (serviceURL && typeof serviceURL === 'string') {
        onlineServiceName = ODataServiceUtils.getServiceName(serviceURL);
        let okHttpClient = foundationPkg.common.ClientProvider.get();
        okHttpClient = clientFoundationPkg.OkHttpClientConfigurator.addLanguageInterceptor(application.android.context, okHttpClient);
        let provider = new oDataPkg.mdk.MDKOnlineODataProvider(onlineServiceName, serviceURL, okHttpClient);
        provider.setTraceRequests(true);
        provider.setTraceWithData(true);
        provider.setPrettyTracing(true);

        if (params.serviceHeaders && Object.keys(params.serviceHeaders).length !== 0) {
          let serviceHeader = this.getHttpHeaders(params.serviceHeaders);
          provider.getHttpHeaders().addAll(serviceHeader);
        }
        
        provider = this.applyServiceOptions(params, provider);
        provider = this.applyCsdlOptions(params, provider);
        this.dataService = new oDataPkg.DataService(provider);
        try {
          provider.acquireTokenAsync(this.dataService, new oDataPkg.core.Action0({
            call: () => {
              resolve(null);
            },
          }), new oDataPkg.core.Action1({
            call: (error) => reject(ODataServiceProvider.toJSError(error)),
          }));
          resolve(null);
        } catch (error) {
          reject(ODataServiceProvider.toJSError(error));
        }
      } else {
        reject(new Error(ErrorMessage.ODATA_CREATE_SERVICE_INCORRECT_PARAMETERS));
      }
    });
  }

  public open(context: any, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.dataService != null && this.isOnline()) {
        try {
          oDataPkg.core.AndroidSystem.setContext(context);
          this.dataService.loadMetadataAsync(new oDataPkg.core.Action0({
            call: () => {
              this.isOnlineServiceOpen = true;
              resolve(null);
            },
          }), new oDataPkg.core.Action1({
            call: (error) => reject(ODataServiceProvider.toJSError(error)),
          }));
        } catch (error) {
          reject(ODataServiceProvider.toJSError(error));
        }
      } else {
        reject(new Error(ErrorMessage.ODATA_SERVICE_PROVIDER_NOT_FOUND));
      }
    });
  }

  /// Common CRUD methods
  public read(entitySet: string, properties: any, queryString: string, 
              headers: Object, requestOptions: Object, pageSize?: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let filteredQueryString = this.filterQueryOptions(entitySet, queryString);
        let query = this.getQuery(entitySet, properties, filteredQueryString, false);
        if (pageSize) {
          query.page(pageSize);
        }
        let successHandler = new oDataPkg.core.Action1({
          call: (queryResult) => {
            let entityList = queryResult.getEntityList();

            if (entitySet === 'ErrorArchive' && !this.isOnline()) {
              for (let i = 0; i < entityList.length(); i++) {
                let entityValue = entityList.get(i);
                if (entityValue) {
                  try {
                    const affectedEntityNavProp = entityValue.getEntityType().getProperty('AffectedEntity');
                    this.dataService.loadProperty(affectedEntityNavProp, entityValue);
                  } catch (error) {
                    write(ODataServiceProvider.toJSError(error).message, 'mdk.trace.odata', messageType.error);
                  }
                }
              }
            }

            for (let i = 0; i < entityList.length(); i++) {
              let entity = entityList.get(i);
              if (entity.getReadLink() == null) {
                entity.setReadLink(entity.getCanonicalURL());
              }
            }
    
            let isErrorArchive = false;
            if (entitySet === 'ErrorArchive') {
              isErrorArchive = true;
            }
    
            let dataContext = new oDataPkg.DataContext(this.dataService.getMetadata());
            resolve(ODataHelper.entityValueListToJson(entityList, dataContext, isErrorArchive));
          },
        });

        let failureHandler = new oDataPkg.core.Action1({
          call: (error) => reject(ODataServiceProvider.toJSError(error)),
        });
            
        this.dataService.executeQueryAsync(query,
          successHandler, failureHandler, this.getHttpHeaders(headers), this.getRequestOptions(requestOptions));
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
      }
    });
  }

  public createEntity(odataCreator: any): Promise<any> {
    try {
      return odataCreator.execute(this.dataService, this.getChangeSetManager()).catch((error) => {
        throw ODataServiceProvider.toJSError(error);
      });
    } catch (error) {
      throw ODataServiceProvider.toJSError(error);
    }
  }

  public createRelatedEntity(odataCreator: any): Promise<any> {
    try {
      return odataCreator.execute(this.dataService, this.getChangeSetManager()).catch((error) => {
        throw ODataServiceProvider.toJSError(error);
      });
    } catch (error) {
      throw ODataServiceProvider.toJSError(error);
    }
  }

  public updateEntity(odataUpdater: any): Promise<any> {
    try {
      return odataUpdater.execute(this.dataService, this.getChangeSetManager()).catch((error) => {
        throw ODataServiceProvider.toJSError(error);
      });
    } catch (error) {
      throw ODataServiceProvider.toJSError(error);
    }
  }

  public deleteEntity(odataDeleter: any): Promise<any> {
    try {
      return odataDeleter.execute(this.dataService, this.getChangeSetManager()).catch((error) => {
        throw ODataServiceProvider.toJSError(error);
      });
    } catch (error) {
      throw ODataServiceProvider.toJSError(error);
    }
  }

  public deleteMediaEntity(entitySetName: string, queryString: string, readLink: string, 
                           headers: Object, requestOptions: Object): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let entity = null;
        if (queryString) {
          let entities = this.getEntityUsingQueryOptions(queryString, entitySetName);
          if (entities === null || entities.length() !== 1) {
            throw new Error(ErrorMessage.format(ErrorMessage.ODATA_MORE_THAN_1_ENTITY_RETURNED, entities.length()));
          }
          entity = entities.get(0);
        } else if (readLink) {
          entity = this.getEntityUsingReadLink(readLink, entitySetName);
        }
        if (entity) {
          this.dataService.deleteEntityAsync(entity, new oDataPkg.core.Action0({
            call: () => {
              let dataContext = new oDataPkg.DataContext(this.dataService.getMetadata());
              resolve(ODataHelper.entityValueToJson(entity, dataContext));
            },
          }), new oDataPkg.core.Action1({
            call: (error) => reject(error),
          }), this.getHttpHeaders(headers), this.getRequestOptions(requestOptions));
        } else {
          reject(new Error(ErrorMessage.ODATA_DELETE_MEDIA_LOADENTITY_FAILURE));
        }
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
      }
    });
  }

  public createMediaEntity(entitySetName: string, properties: any, 
                           headers: any, requestOptions: any, media: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const entitySet = this.dataService.getEntitySet(entitySetName);
        const entityType = entitySet.getEntityType();
        let converter = new ODataConverter(this.dataService);
        let entities: string[] = [];
        let errors: string[] = [];
        let mediaCount = 0;
        for (let mediaContent of media) {
          if (!mediaContent.content || !mediaContent.contentType) {
            throw new Error(ErrorMessage.ODATA_CREATE_MEDIA_INVALID_MEDIA_CONTENT);
          }

          let content;
          if (typeof mediaContent.content === 'string') {
            content = android.util.Base64.decode(mediaContent.content, android.util.Base64.DEFAULT);  
          } else {
            content = mediaContent.content;
          }     

          let mediaStream = oDataPkg.ByteStream.fromBinary(content);
          mediaStream.setMediaType(mediaContent.contentType);
          let entity = oDataPkg.EntityValue.ofType(entityType);
          for (let key in properties) {
            if (key) {
              let property = entityType.getProperty(key);
              entity.setDataValue(property, converter.convert(key, properties[key], 
                property.getDataType().getCode(), property.getDataType().getName()));
            }
          }
          try {
            this.dataService.createMediaAsync(entity, mediaStream, new oDataPkg.core.Action0({
              call: () => {
                let dataContext = new oDataPkg.DataContext(this.dataService.getMetadata());
                entities.push(ODataHelper.entityValueToJson(entity, dataContext));
                mediaCount++;
                if (media.length === mediaCount) {
                  this.endCreateMediaEntity(media.length, entities, errors, resolve, reject);
                }
              },
            }), new oDataPkg.core.Action1({
              call: (error) => {
                let err = ODataServiceProvider.toJSError(error);
                errors.push(err.message);
                mediaCount++;
                if (media.length === mediaCount) {
                  this.endCreateMediaEntity(media.length, entities, errors, resolve, reject);
                }
              },
            }), this.getHttpHeaders(headers), this.getRequestOptions(requestOptions));
          } catch (error) {
            reject(ODataServiceProvider.toJSError(error));
          }
        }
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
      }
    });
  }

  public createRelatedMediaEntity(entitySetName: string, properties: any, parent: any, 
                                  headers: any, requestOptions, media: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const entitySet = this.dataService.getEntitySet(entitySetName);
        const entityType = entitySet.getEntityType();
        let parentEntityVal = this.getEntityValue(parent.entitySet, parent.queryOptions, parent.readLink);
        let parentProperty = parentEntityVal.getEntityType().getProperty(parent.property);
        let converter = new ODataConverter(this.dataService);
        let entities: string[] = [];
        let errors: string[] = [];
        let mediaCount = 0;
        for (let mediaContent of media) {
          if (!mediaContent.content || !mediaContent.contentType) {
            throw new Error(ErrorMessage.ODATA_CREATE_MEDIA_INVALID_MEDIA_CONTENT);
          }

          let content;
          if (typeof mediaContent.content === 'string') {
            content = android.util.Base64.decode(mediaContent.content, android.util.Base64.DEFAULT);  
          } else {
            content = mediaContent.content;
          }     

          let mediaStream = oDataPkg.ByteStream.fromBinary(content);
          mediaStream.setMediaType(mediaContent.contentType);
          let entityVal = oDataPkg.EntityValue.ofType(entityType);
          for (let key in properties) {
            if (key) {
              let property = entityType.getProperty(key);
              entityVal.setDataValue(property, converter.convert(key, properties[key], 
                property.getDataType().getCode(), property.getDataType().getName()));
            }
          }
          try {
            clientODataPkg.DataServiceUtils.createRelatedMediaAsync(this.dataService, entityVal,
              mediaStream, parentEntityVal, parentProperty, new oDataPkg.core.Action0({call: () => {
                let dataContext = new oDataPkg.DataContext(this.dataService.getMetadata());
                entities.push(ODataHelper.entityValueToJson(entityVal, dataContext));
                mediaCount++;
                if (media.length === mediaCount) {
                  this.endCreateMediaEntity(media.length, entities, errors, resolve, reject);
                }
              },
            }), new oDataPkg.core.Action1({
              call: (error) => {
                let err = ODataServiceProvider.toJSError(error);
                errors.push(err.message);
                mediaCount++;
                if (media.length === mediaCount) {
                  this.endCreateMediaEntity(media.length, entities, errors, resolve, reject);
                }
              },
            }), this.getHttpHeaders(headers), this.getRequestOptions(requestOptions));
          } catch (error) {
            reject(ODataServiceProvider.toJSError(error));
          }
        }
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
      }
    });
  }

  public createMediaEntity1(entitySetName: string, properties: any, headers: any, media: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const entitySet = this.dataService.getEntitySet(entitySetName);
        let entityType = entitySet.getEntityType();
        let entity = oDataPkg.EntityValue.ofType(entityType);
        for (let key in properties) {
          if (key) {
            let property = entityType.getProperty(key);
            entity.setDataValue(property, ODataServiceUtils.convert(key, properties[key], 
              property.getDataType().getCode()));
          }
        }
        try {
          entityType.setMedia(false);
          this.dataService.createEntity(entity);
          let entityID = entity.getEntityID();
          let regExp = /\(([^)]+)\)/;
          let match = regExp.exec(entityID);
          let key = 'slug';
          headers[key] = match[1];
        } catch (error) {
          reject(ODataServiceProvider.toJSError(error));
        } finally {
          entityType.setMedia(true);
        }

        let entities: string[] = [];
        let errors: string[] = [];
        let mediaCount = 0;
        for (let mediaContent of media) {
          if (!mediaContent.content || !mediaContent.contentType) {
            throw new Error(ErrorMessage.ODATA_CREATE_MEDIA_INVALID_MEDIA_CONTENT);
          }

          let content;
          if (typeof mediaContent.content === 'string') {
            content = android.util.Base64.decode(mediaContent.content, android.util.Base64.DEFAULT);  
          } else {
            content = mediaContent.content;
          }     
          let mediaStream = oDataPkg.ByteStream.fromBinary(content);
          mediaStream.setMediaType(mediaContent.contentType);
          try {
            this.dataService.createMediaAsync(entity, mediaStream, new oDataPkg.core.Action0({
              call: () => {
                let dataContext = new oDataPkg.DataContext(this.dataService.getMetadata());
                entities.push(ODataHelper.entityValueToJson(entity, dataContext));
                mediaCount++;
                if (media.length === mediaCount) {
                  this.endCreateMediaEntity(media.length, entities, errors, resolve, reject);
                }
              },
            }), new oDataPkg.core.Action1({
              call: (error) => {
                let err = ODataServiceProvider.toJSError(error);
                errors.push(err.message);
                mediaCount++;
                if (media.length === mediaCount) {
                  this.endCreateMediaEntity(media.length, entities, errors, resolve, reject);
                }
              },
            }), this.getHttpHeaders(headers));
          } catch (error) {
            reject(ODataServiceProvider.toJSError(error));
          }
        }
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
      }
    });
  }
  
  public downloadMedia(entitySet: string, queryString: string, readLink: string, 
                       headers: Object, requestOptions: Object): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let entity = this.getEntityValue(entitySet, queryString, readLink);
        if (entity != null) {
          this.dataService.downloadMediaAsync(entity, new oDataPkg.core.Action1({
            call: (data) => {
              resolve(data);
            },
          }), new oDataPkg.core.Action1({
            call: (error) => reject(ODataServiceProvider.toJSError(error)),
          }), this.getHttpHeaders(headers), this.getRequestOptions(requestOptions));
        } else {
          reject(new Error(ErrorMessage.ODATA_DOWNLOADMEDIA_FAILED));
        }
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
      }
    });
  }

  public isMediaLocal(entitySet: string, readLink: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let fixedEntitySet = entitySet;
      if (fixedEntitySet.indexOf('/') === 0) {
        // local entity read link
        fixedEntitySet = fixedEntitySet.substring(1);
      }

      try {
        let entityValue = oDataPkg.EntityValue.ofType(this.dataService.getEntitySet(fixedEntitySet).getEntityType());
        entityValue.setReadLink(readLink);

        if (!this.isOnline()) {
          this.dataService.loadEntity(entityValue);
        }

        let isLocal = entityValue.getMediaStream().isOffline();
        resolve(isLocal);
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
      }
    });
  }

  // tslint:disable-next-line:max-line-length
  public uploadStream(entitySetName: string, properties: any[], query: string, readLink: string, headers: any, requestOptions: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const entitySet = this.dataService.getEntitySet(entitySetName);
        let entityType = entitySet.getEntityType();
        let entityValue = this.getEntityValue(entitySetName, query, readLink);
        let count = 0;
        let propertiesLength = Object.keys(properties).length; 
        if (entityValue != null) {
          for (let key in properties) {
            if (key && properties[key]) {
              let media = Array.isArray(properties[key]) ? properties[key][0] : properties[key];
              if (!media.content || !media.contentType) {
                throw new Error(ErrorMessage.ODATA_UPLOAD_STREAM_INVALID_STREAM_DATA);
              }
              let content;
              if (typeof media.content === 'string') {
                content = android.util.Base64.decode(media.content, android.util.Base64.DEFAULT);  
              } else {
                content = media.content;
              }   
              let mediaStream = oDataPkg.ByteStream.fromBinary(content);
              mediaStream.setMediaType(media.contentType);

              let streamlink = entityValue.getStreamLink(entityType.getProperty(key));
              count++;
              this.dataService.uploadStreamAsync(entityValue, streamlink, mediaStream,
                new oDataPkg.core.Action0({
                  call: () => {
                    if (count === propertiesLength) {
                      let dataContext = new oDataPkg.DataContext(this.dataService.getMetadata());
                      resolve(ODataHelper.entityValueToJson(entityValue, dataContext));
                    }
                  },
                }), new oDataPkg.core.Action1({
                  call: (error) => {
                    reject(ODataServiceProvider.toJSError(error));
                  },
                }), this.getHttpHeaders(headers), this.getRequestOptions(requestOptions));
            }
          }
        } else {
          reject(new Error(ErrorMessage.ODATA_UPLOADSTREAM_FAILED));
        }
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
      }
    });
  }

  // tslint:disable-next-line:max-line-length
  public downloadStream(entitySetName: string, properties: string[], query: string, readLink: string, headers: any, requestOptions: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const entitySet = this.dataService.getEntitySet(entitySetName);
        let entityType = entitySet.getEntityType();
        let entityValue = this.getEntityValue(entitySetName, query, readLink);
        if (entityValue != null) {
          let promises = [];
          for (let prop of properties) {
            if (prop) {
              let streamlink = entityType.getProperty(prop).getStreamLink(entityValue);
              promises.push(this.downloadStreamData(entityValue, streamlink, this.getHttpHeaders(headers),
                                                    this.getRequestOptions(requestOptions)));
            }
          }
          return Promise.all(promises).then(datas => {
            resolve(datas);
          }).catch(err => {
            reject(err);
          });
        } else {
          reject(new Error(ErrorMessage.ODATA_DOWNLOADSTREAM_FAILED));
        }
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
      }
    });
  }

  // Change Set methods
  public beginChangeSet(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.getChangeSetManager().beginChangeSet();
        resolve(true);
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
      }
    });
  }

  public cancelChangeSet(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
         this.getChangeSetManager().cancelChangeSet();
         resolve(true);
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
      }
    });
  }

  public commitChangeSet(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.getChangeSetManager().commitChangeSet().then(() => {
          resolve(true);
        }).catch((error) => {
          reject(ODataServiceProvider.toJSError(error));
        });
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
      }
    });
  }

  public count(entitySet: string, properties: any, 
               queryString: string, headers: Object, requestOptions: Object): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        let query = this.getQuery(entitySet, properties, queryString, true);
        query.setCountOnly(true);

        let successHandler = new oDataPkg.core.Action1({
          call: (queryResult) => {
            let count = queryResult.getCount();
            resolve(count);
          },
        });

        let failureHandler = new oDataPkg.core.Action1({
          call: (error) => reject(ODataServiceProvider.toJSError(error)),
        });
          
        this.dataService.executeQueryAsync(query, successHandler, failureHandler, 
          this.getHttpHeaders(headers), this.getRequestOptions(requestOptions));
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
      }
    });
  }
  
  // tslint:disable:max-line-length
  public callFunction(functionName, functionParameters, functionHeaders, functionOptions) {
    return new Promise((resolve, reject) => {
      if (this.dataService != null) {
        try {
          let method = this.dataService.getDataMethod(functionName);
          let query = new oDataPkg.DataQuery();
          let converter = new ODataConverter(this.dataService);
          let inputParams = new oDataPkg.ParameterList();
          let methodParameters = method.getParameters();
          if (methodParameters !== null) {
            for (let i = 0; i < methodParameters.length(); i++) {
              let parameter = methodParameters.get(i);
              if (functionParameters != null) {
                let parameterValue = functionParameters[parameter.getName()];
                if (parameterValue === undefined) {
                  if (!parameter.isNullable()) {
                    throw new Error(ErrorMessage.format(ErrorMessage.PROPERTY_VALUE_REQUIRED,
                      parameter.getName(), parameter.getType().toString()));
                  }
                  continue;
                }
                let inputParam = new oDataPkg.Parameter();
                inputParam.setType(parameter.getType());
                inputParam.setName(parameter.getName());
                inputParam.setValue(converter.convert(parameter.getName(), parameterValue, parameter.getType().getCode(), 
                  parameter.getType().getName()));
                inputParams.add(inputParam);
              } 
            }
          }

          let inputHeaders = this.getHttpHeaders(functionHeaders);
          let inputOptions = this.getRequestOptions(functionOptions);

          // BCP-1970363628
          // Activity Indicator not displaying when executing CallFunction
          // Also executeQuery is causing error sometimes with Network on main thread error.
          let successHandler = new oDataPkg.core.Action1({
            call: (queryResult) => {
              let result = '';
              if (queryResult) {
                try {
                  let dataContext = new oDataPkg.DataContext(this.dataService.getMetadata());
                  if (method.getReturnType().isEntityList()) {
                    let entityValueList = queryResult.getEntityList();
                    if (entityValueList !== null) {
                      result = ODataHelper.entityValueListToJson(entityValueList, dataContext);
                    }
                  } else if (method.getReturnType().isComplexList()) {
                    let complexList = queryResult.getComplexList();
                    if (complexList !== null) {
                      result = ODataHelper.complexValueListToJson(complexList, dataContext).toString();
                    }
                  } else if (method.getReturnType().isEntity()) {
                    let entityValue = queryResult.getOptionalEntity();
                    if (entityValue !== null) {
                      result = ODataHelper.entityValueToJson(entityValue, dataContext).toString();
                    }
                  } else if (method.getReturnType().isComplex()) {
                    let complexValue = queryResult.getOptionalComplex();
                    if (complexValue !== null) {
                      result = ODataHelper.complexValueToJson(complexValue, dataContext).toString();
                    }
                  } else if (method.getReturnType().isBasic()) {
                    let basicValue = queryResult.getOptionalBasic();
                    if (basicValue !== null) {
                      result = ODataHelper.dataValueToJson(basicValue, dataContext).toString();
                    }
                  } else if (method.getReturnType().isBasicList()) {
                    let basicList = queryResult.getBasicList();
                    if (basicList !== null) {
                      result = ODataHelper.dataListValueToJson(basicList, dataContext).toString();
                    }
                  }
                } catch (error) {
                  write(ODataServiceProvider.toJSError(error).message, 'mdk.trace.odata', messageType.error);
                }
              }
              resolve(result);
            },
          });
  
          let failureHandler = new oDataPkg.core.Action1({
            call: (error) => reject(ODataServiceProvider.toJSError(error)),
          });
          this.dataService.executeQueryAsync(query.invoke(method, inputParams), successHandler, failureHandler, inputHeaders, inputOptions);
        } catch (error) {
          reject(ODataServiceProvider.toJSError(error));
        }
      } else {
        reject(new Error(ErrorMessage.OPEN_SERVICE_NOT_INITIALIZED));
      }
    });
  }

  public undoPendingChanges(entitySetName: string, queryOptions: string, editLink: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let entityValue = this.getEntityValueWithQueryOptionOrEditLink(entitySetName, queryOptions, editLink);
        if (entityValue) {
          this.getOfflineODataProvider().undoPendingChanges(entityValue);
          // now retrieve new entityValue
          let newEntityVal;
          try {
            if (queryOptions && queryOptions.length !== 0) {
              let entities = this.getEntityUsingQueryOptions(queryOptions, entitySetName);
              if (entities &&  entities.length() > 0) {
                newEntityVal = entities.get(0);
              }
            } else {
              this.dataService.loadEntity(entityValue);
              newEntityVal = entityValue;
            }
          } catch {
            // failed to get new entityValue as it's deleted
            newEntityVal = null;
          }
          if (newEntityVal) {
            let dataContext = new oDataPkg.DataContext(this.dataService.getMetadata());
            resolve(ODataHelper.entityValueToJson(newEntityVal, dataContext));
          } else {
            resolve('');
          }
        } else {
          reject(new Error(ErrorMessage.ODATA_UNDO_PENDING_CHANGES_LOADENTITY_FAILURE));
        }
      } catch (error) {
        reject(ODataServiceProvider.toJSError(error));
      }
    });
  }
  
  public getOfflineStoreStatus(): string {
    return this.storeStates.toString().toLowerCase();
  }

  public getPreviousUser(): string{
    return ODataServiceProvider.prevUser;
  }

  public getPropertyType(entitySetName: string, propertyName: string): string {
    try {
      let finalEntityType = null;
      if (entitySetName.indexOf('/') !== -1) {
        let splitEntitySet = entitySetName.split('/');
        let sourceEntitySetName = splitEntitySet[0].split('(')[0];
        let navigationPropertyName = splitEntitySet[splitEntitySet.length - 1];
        let navEntitySet = this.dataService.getEntitySet(sourceEntitySetName);
        if (navEntitySet != null) {
          let navEntityType = navEntitySet.getEntityType();
          let navProperty = this.getOptionalProperty(navEntityType, navigationPropertyName);
          if (navProperty != null) {
            finalEntityType = navProperty.getDataType().getItemType();
          }
        }
      } else {
        // Same as this.dataService.getEntitySet except not throwing error
        let entity = this.dataService.getMetadata().getLookupSets().get(entitySetName);
        if (entity != null) {
          finalEntityType = entity.getEntityType();
        }
      }
      if (finalEntityType != null) {
        // Same as entityType.getProperty function except not throwing error
        let property = this.getOptionalProperty(finalEntityType, propertyName);
        if (property != null) {
          return property.getType().toString();
        }
      }
    } catch (error) {
      write(ODataServiceProvider.toJSError(error).message, 'mdk.trace.odata', messageType.error);
    }
    return '';
  }

  public getVersion(): number {
    return this.dataService.getMetadata().getVersionCode();
  }

  public getOfflineParameter(name: string): any {
    let provider = this.getOfflineODataProvider();
    if (!provider) {
      return null;
    }

    let storeParams = provider.getStoreParameters();
    if (name === 'CustomHeaders') {
      return storeParams.getCustomHeaders();
    } else {
      return null;
    }
  }
  
  public setOfflineParameter(name: string, value: any) {
    let provider = this.getOfflineODataProvider();
    if (!provider) {
      return ;
    }

    let storeParams = provider.getStoreParameters();
    if (name === 'CustomHeaders') {
      storeParams.setCustomHeaders(this.getHeadersMap(value));
    }
  }

  private downloadStreamData(entityValue, streamlink, headers, requestOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dataService.downloadStreamAsync(entityValue, streamlink, 
        new oDataPkg.core.Action1({
          call: (data) => {
            resolve(data);
          },
        }), new oDataPkg.core.Action1({
          call: (error) => {
            reject(ODataServiceProvider.toJSError(error));
          },
        }), headers, requestOptions);
    });
  }

  private getOptionalProperty(entityType: any, propertyName: string) {
    let propertyNames = propertyName.split('/');
    let currentPropertyName = propertyNames[0];
    let property = entityType.getPropertyMap().get(currentPropertyName);
    if (property != null) {
      if (propertyNames.length > 1) {
        let propertyType = property.getType();
        if (propertyType.isList()) {
            propertyType = propertyType.getItemType();
        }

        if (propertyType instanceof oDataPkg.StructureType) {
            propertyNames.splice(0, 1);
            let path = propertyNames.join('/');
            return propertyType.getProperty(path);
        }
      } else {
        return property;
      }
    }
  }

  private getChangeSetManager(): ChangeSetManager {
    if (this.changeSetManager == null) {
        this.changeSetManager = new ChangeSetManager(this.dataService);
        return this.changeSetManager;
    } else {
        return this.changeSetManager;
    }
  }

  private initDemoDatabase(context: any, name: string) {
    let odataDir = ODataServiceProvider.offlineODataDirectory(context);
    let sourceDir = 'app/branding';
    let rqUdbFilename = name + '.rq.udb';
    let udbFilename = name + '.udb';
    write(`Init Demo DB Source: ${sourceDir} | ODataDir ${odataDir}`, 'mdk.trace.odata', messageType.log);
    
    let rqUdbFile = new java.io.File(odataDir + '/' + rqUdbFilename);
    let udbFile = new java.io.File(odataDir + '/' + udbFilename);

    if (rqUdbFile.exists() && udbFile.exists()) {
      return;
    }

    if (ODataServiceProvider.demoDBPath != null && ODataServiceProvider.demoDBPath.length !== 0) {
      sourceDir = context.getExternalFilesDir(null).getAbsolutePath() + ODataServiceProvider.demoDBPath;
      clientODataPkg.DataServiceUtils.copyExternalStorageFile(context, sourceDir, odataDir, rqUdbFilename);
      clientODataPkg.DataServiceUtils.copyExternalStorageFile(context, sourceDir, odataDir, udbFilename);
    } else {
      clientODataPkg.DataServiceUtils.copyAssetFile(context, sourceDir, odataDir, rqUdbFilename);
      clientODataPkg.DataServiceUtils.copyAssetFile(context, sourceDir, odataDir, udbFilename);
    }
  }

  /*private copyResourceFile(context: any, sourceDir: string, destDir: string, filename: string) {
    try {
      let inStream = context.getAssets().open(sourceDir + '/' + filename);
      if (inStream == null) {
          throw new Error(ErrorMessage.format(ErrorMessage.ODATA_UDB_FILE_NOT_FOUND, filename, sourceDir));
      }

      let outFile = new java.io.File(destDir, filename);
      java.nio.file.Files.deleteIfExists(java.nio.file.Paths.get(outFile.getPath()));
      java.nio.file.Files.copy(inStream, java.nio.file.Paths.get(outFile.getPath()));

      inStream.close();
    } catch (error) {
        throw error;
    }
  }*/

  private filterQueryOptions(entitySetName: string, queryOptions: string): string {
    let stringToFilter = entitySetName;
    if (stringToFilter.startsWith('/')) {
        // local entity read link
        stringToFilter = stringToFilter.substring(1);
    }
    // Only filter queries that are trying to access a navigation property.re trying to access a navigation property.
    if (stringToFilter.indexOf('/') !== -1) {
        let splitEntitySet = stringToFilter.split('/');
        let sourceEntitySetName = splitEntitySet[0].split('(')[0];
        let navigationPropertyName = splitEntitySet[splitEntitySet.length - 1];
        let entitySet = this.dataService.getEntitySet(sourceEntitySetName);
        if (entitySet != null && queryOptions != null) {
          let propertyList = entitySet.getEntityType().getNavigationProperties();
          let navigationProperty = null;
          let iterator = propertyList.iterator();
          while (iterator.hasNext()) {
            let property = iterator.next();
            if (property.getName() === navigationPropertyName) {
              navigationProperty = property;
              break;
            }
          }
          if (navigationProperty != null && !navigationProperty.getType().isEntityList()) {
            let queryParams = queryOptions.split('&');
            let sb = [];
            for (let param of queryParams) {
              if (param.indexOf('$top') === -1) {
                if (sb.length > 0) {
                  sb.push('&');
                }
                sb.push(param);
              }
            }
            return sb.length > 0 ? sb.join('') : null;
          }
        }
    }
    return queryOptions;
  }

  private getQuery(entitySetName: string, properties: any, originalQueryString: string, forCount: boolean): any {
    let containsLeadingAndTrailingBracketPattern = '.*\\(.*\\).*';
    let pattern = java.util.regex.Pattern.compile(containsLeadingAndTrailingBracketPattern);
    let matcher = pattern.matcher(entitySetName);
    let isReadLink = matcher.matches();

    let query = new oDataPkg.DataQuery();
    let queryString = originalQueryString;

    let queryUrl = forCount ? entitySetName + '/$count' : entitySetName;
    if (queryString == null || queryString.length === 0) {
      query.setUrl(queryUrl);
    } else {
      query.setUrl(queryUrl + '?' + queryString);
    }

    let entitySet;

    if (isReadLink) {
      query.setEntityKey(new oDataPkg.EntityKey());

      let bracket = '(';
      let token = entitySetName.split(bracket);
      let entitySetNameFromReadLink = token[0];

      if (entitySetNameFromReadLink.startsWith('/')) {
        // local entity read link
        entitySetNameFromReadLink = oDataPkg.core.StringFunction.removePrefix(entitySetNameFromReadLink, '/');
      }

      entitySet = this.dataService.getEntitySet(entitySetNameFromReadLink);

      if (this.isOnline()) {
        // This workaround is required for both Json & Atom data format
        let splitEntitySet = entitySetName.split('/');
        if (splitEntitySet.length > 1) {
          // we need to get navigation property name and set query property
          // e.g. "Groups(1)/FeedEntries"
          // "MaterialSLocs(MaterialNum='126',Plant='1000',StorageLocation='0001')/Material/MaterialUOMs"
          let navigationPropertyName, navigationProperty;
          for (let i = 1; i < splitEntitySet.length - 1; i++) {
            navigationPropertyName = splitEntitySet[i];
            navigationProperty = entitySet.getEntityType().getProperty(navigationPropertyName);
            entitySet = this.dataService.getEntitySet(navigationProperty.getType().getName());
          }
          navigationPropertyName = splitEntitySet[splitEntitySet.length - 1];
          query.property(entitySet.getEntityType().getProperty(navigationPropertyName));
        }
      }
    } else {
      entitySet = this.dataService.getEntitySet(entitySetName);
    }

    query.from(entitySet);

    if (this.isOnline()) {
      let entityType = entitySet.getEntityType();
      if (properties && properties.length > 0) {
        for (let property of properties) {
          query = query.select([entityType.getProperty(property)]);
        }
      }
    }

    return query;
  }

  private getEntityUsingQueryOptions(queryString: string, entitySetName: string): any {
      let query = this.getQuery(entitySetName, null, queryString, false);
      return this.dataService.executeQuery(query).getEntityList();
  }

  private getEntityUsingReadLink(readLink: string, entitySetName: string): any {
      let entitySet = this.dataService.getEntitySet(entitySetName);
      let entity = oDataPkg.EntityValue.ofType(entitySet.getEntityType());
      entity.setReadLink(readLink);
      if (this.isOnline()) {
        // workaround for MDK-5070. Once OData SDK fixes the issue, online check will be removed
        let query = new oDataPkg.DataQuery();
        query.setExpectSingle(true);
        this.dataService.loadEntity(entity, query);
      } else {
        this.dataService.loadEntity(entity);
      }
      return entity;
  }

  private isOnline(): boolean {
    return (this.dataService.getProvider() instanceof oDataPkg.OnlineODataProvider);
  }

  private getOfflineODataProvider(): any {
    return (this.dataService.getProvider() instanceof offlineODataPkg.OfflineODataProvider) ?
      this.dataService.getProvider() : null;
  }

  private offlineStateChange(params: any, stateChangeOperation: StateChangeOperation): Promise<any> {
    return new Promise((resolve, reject) => {
      let operationType = stateChangeOperation.toString();

      if (this.isOnline()) {
        Promise.reject(new Error(ErrorMessage.format(ErrorMessage.ODATA_INVALID_OP_TYPE, operationType)));
        return;
      }

      let isForce = (typeof params.force === 'boolean') ? params.force : false;

      if (this.dataService != null) {
        let isPending = false;
        let isQueueEmpty = false;

        // hasPendingUpload and requestQueueIsEmpty will throw an exception if the store is closed.
        if (!isForce) {
          try {
            isPending = this.getOfflineODataProvider().hasPendingUpload();
            isQueueEmpty = this.getOfflineODataProvider().isRequestQueueEmpty();
          } catch (error) {
            reject(ODataServiceProvider.toJSError(error));
            return;
          }
        }

        if ((!isPending && isQueueEmpty) || isForce) {
          try {
            switch (stateChangeOperation) {
              case StateChangeOperation.Close:
                this.getOfflineODataProvider().close();
                this.storeStates = StoreStates.Closed;
                break;
              case StateChangeOperation.Clear:
                this.getOfflineODataProvider().clear();
                break;
              default:
                break;
            }
            resolve(null);
          } catch (error) {
            reject(ODataServiceProvider.toJSError(error));
          }
        } else {
          reject(new Error(ErrorMessage.format(ErrorMessage.ODATA_SERVICE_OP_PENDING_UPLOADS, operationType)));
        }
      } else {
        reject(new Error(ErrorMessage.format(ErrorMessage.ODATA_SERVICE_OP_NOT_INITIALIZED, operationType)));
      }
    });
  }

  private endCreateMediaEntity(count: number, entities: string[], errors: string[], resolve, reject) {
    if (errors.length > 0) {
      let errMessage: string = '';
      for (let error of errors) {
        if (errMessage) {
          errMessage += ', ';
        }
        errMessage += error;
      }
      reject(new Error(ErrorMessage.format(ErrorMessage.ODATA_CREATE_MEDIA_ERROR, 
        errors.length, count, errMessage)));
    } else {
      resolve(entities);
    }
  }

  private getEntityValue(entitySetName: string, query: string, readLink: string): any {
    let entityValue;
    if (query != null && query.length !== 0) {
      let entities = this.getEntityUsingQueryOptions(query, entitySetName);
      if (entities == null || entities.length() !== 1) {
        throw new Error(ErrorMessage.format(ErrorMessage.ODATA_MORE_THAN_1_ENTITY_RETURNED, entities.length()));
      }
      entityValue = entities.get(0);
    } else if (readLink != null && readLink.length !== 0) {
      entityValue = this.getEntityUsingReadLink(readLink, entitySetName);
    }
    return entityValue;
  }

  private getEntityValueWithQueryOptionOrEditLink(entitySetName: string, query: string, editLink: string): any {
    let entityValue;
    if (query != null && query.length !== 0) {
      let entities = this.getEntityUsingQueryOptions(query, entitySetName);
      if (entities == null || entities.length() !== 1) {
        throw new Error(ErrorMessage.format(ErrorMessage.ODATA_MORE_THAN_1_ENTITY_RETURNED, entities.length()));
      }
      entityValue = entities.get(0);
    } else if (editLink && editLink.length > 0) {
      let entitySet = this.dataService.getEntitySet(entitySetName);
      entityValue = oDataPkg.EntityValue.ofType(entitySet.getEntityType());
      entityValue.setEditLink(editLink);
    }
    return entityValue;
  }

  private getHttpHeaders(headers: any)  {
    return ODataHelper.getHttpHeaders(headers);
  }

  private getRequestOptions(requestOptions: any) {
    return ODataHelper.getRequestOptions(requestOptions, this.dataService);
  }

  private getHeadersMap(headers: any) {
    let headersMap = new java.util.HashMap();
    if (!headers) {
      return headersMap;
    }

    for (let key in headers) {
      if (key) {
        if (headers[key].indexOf('\r') !== -1 || headers[key].indexOf('\n') !== -1) {
          throw new Error(ErrorMessage.ODATA_INVALID_CHARS_IN_HTTP_HEADERS);
        }
        headersMap.put(key, headers[key]);
      }
    }
    return headersMap;
  }

  private applyServiceOptions(params: any, provider: any): any {
    // set default service options
    provider.getServiceOptions().setPingMethod('GET');
    provider.getServiceOptions().setCheckVersion(false);

    if (params.serviceOptions) {
      const options = params.serviceOptions;
      let value: any = null;
      Object.keys(options).forEach(key => {
        SharedLoggerManager.pluginDebug(ErrorMessage.format(ErrorMessage.ODATA_SET_SERVICE_OPTIONS, key));
        switch (key) {
          case ODataServiceOptions.avoidInPaths: {
            value = options[key];
            if (value) {
              provider.getServiceOptions().setAvoidInPaths(value.toString());
            }
            break;
          }
          case ODataServiceOptions.cacheMetadata: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setCacheMetadata((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.checkQueries: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setCheckQueries((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.checkResults: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setCheckResults((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.checkVersion: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setCheckVersion((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.clientID: {
            value = options[key];
            if (value) {
              provider.getServiceOptions().setClientID(value.toString());
            }
            break;
          }
          case ODataServiceOptions.createReturnsContent: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setCreateReturnsContent((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.dataFormat: {
            value = options[key];
            if (!isNaN(Number(value.toString()))) {
              provider.getServiceOptions().setDataFormat(Number(value.toString()));
            }
            break;
          }
          case ODataServiceOptions.dataVersion: {
            value = options[key];
            if (!isNaN(Number(value.toString()))) {
              provider.getServiceOptions().setDataVersion(Number(value.toString()));
            }
            break;
          }
          case ODataServiceOptions.databaseOnly: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setDatabaseOnly((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.fixMissingEmptyLists: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setFixMissingEmptyLists((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.fixMissingNullValues: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setFixMissingNullValues((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.logErrors: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setLogErrors((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.logWarnings: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setLogWarnings((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.metadataFile: {
            value = options[key];
            if (value) {
              provider.getServiceOptions().setMetadataFile(value.toString());
            }
            break;
          }
          case ODataServiceOptions.metadataText: {
            value = options[key];
            if (value) {
              provider.getServiceOptions().setMetadataText(value.toString());
            }
            break;
          }
          case ODataServiceOptions.metadataURL: {
            value = options[key];
            if (value) {
              provider.getServiceOptions().setMetadataURL(value.toString());
            }
            break;
          }
          case ODataServiceOptions.pingAccept: {
            value = options[key];
            if (value) {
              provider.getServiceOptions().setPingAccept(value.toString());
            }
            break;
          }
          case ODataServiceOptions.pingMethod: {
            value = options[key];
            if (value) {
              provider.getServiceOptions().setPingMethod(value.toString());
            }
            break;
          }
          case ODataServiceOptions.pingResource: {
            value = options[key];
            if (value) {
              provider.getServiceOptions().setPingResource(value.toString());
            }
            break;
          }
          case ODataServiceOptions.requiresToken: {
            value = options[key];
            if (value) {
              provider.getServiceOptions().setRequiresToken(value.toString());
            }
            break;
          }
          case ODataServiceOptions.requiresType: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setRequiresType((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.supportsAlias: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setSupportsAlias((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.supportsBatch: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setSupportsBatch((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.supportsBind: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setSupportsBind((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.supportsDelta: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setSupportsDelta((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.supportsNext: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setSupportsNext((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.supportsPatch: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setSupportsPatch((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.supportsUnbind: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setSupportsUnbind((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.updateReturnsContent: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setUpdateReturnsContent((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          default: {
            SharedLoggerManager.pluginError(ErrorMessage.format(ErrorMessage.ODATA_UNSUPPORTED_SERVICE_OPTIONS, key));
            break;
          }
        }
      });
    }
    return provider;
  }

  private applyOfflineServiceOptions(params: any, provider: any): any {
    // set default service options
    provider.getServiceOptions().setSupportsBind(false);
    if (params.serviceOptions) {
      const options = params.serviceOptions;
      let value: any = null;
      Object.keys(options).forEach(key => {
        SharedLoggerManager.pluginDebug(ErrorMessage.format(ErrorMessage.ODATA_SET_SERVICE_OPTIONS, key));
        switch (key) {
          case ODataServiceOptions.supportsBind: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setSupportsBind((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          case ODataServiceOptions.supportsPatch: {
            value = options[key];
            if (value != null) {
              provider.getServiceOptions().setSupportsPatch((value.toString().toLowerCase() === 'true'));
            }
            break;
          }
          default: {
            SharedLoggerManager.pluginError(ErrorMessage.format(ErrorMessage.ODATA_UNSUPPORTED_SERVICE_OPTIONS, key));
            break;
          }
        }
      });
    }
    return provider;
  }

  private applyCsdlOptions(params: any, provider: any): any {
    // tslint:disable:no-bitwise
    let csdlOptionsBitmap: number = 0;
    SharedLoggerManager.pluginDebug(ErrorMessage.ODATA_BELOW_ARE_CSDL_OPTIONS);
  
    if (params.csdlOptions) {
      let optString = '';
      params.csdlOptions.forEach((option) => {
        optString = option.toString();
        SharedLoggerManager.pluginDebug(optString);
        switch (optString) {
          case ODataCDSLOptions.allowCaseConflicts: {
            csdlOptionsBitmap |= CSDLOption.allowCaseConflicts;
            break;
          }
          case ODataCDSLOptions.defaultVariableScale: {
            csdlOptionsBitmap |= CSDLOption.defaultVariableScale;
            break;
          }
          case ODataCDSLOptions.defaultVariableSrid: {
            csdlOptionsBitmap |= CSDLOption.defaultVariableSrid;
            break;
          }
          case ODataCDSLOptions.disableFacetWarnings: {
            csdlOptionsBitmap |= CSDLOption.disableFacetWarnings;
            break;
          }
          case ODataCDSLOptions.disableLoggingOfErrors: {
            csdlOptionsBitmap |= CSDLOption.disableLoggingOfErrors;
            break;
          }
          case ODataCDSLOptions.disableLoggingOfWarnings: {
            csdlOptionsBitmap |= CSDLOption.disableLoggingOfWarnings;
            break;
          }
          case ODataCDSLOptions.disableNameValidation: {
            csdlOptionsBitmap |= CSDLOption.disableNameValidation;
            break;
          }
          case ODataCDSLOptions.excludeServerOnlyElements: {
            csdlOptionsBitmap |= CSDLOption.excludeServerOnlyElements;
            break;
          }
          case ODataCDSLOptions.failIfProviderIncompatible: {
            csdlOptionsBitmap |= CSDLOption.failIfProviderIncompatible;
            break;
          }
          case ODataCDSLOptions.ignoreAllAnnotations: {
            csdlOptionsBitmap |= CSDLOption.ignoreAllAnnotations;
            break;
          }
          case ODataCDSLOptions.ignoreAllReferences: {
            csdlOptionsBitmap |= CSDLOption.ignoreAllReferences;
            break;
          }
          case ODataCDSLOptions.ignoreEdmAnnotations: {
            csdlOptionsBitmap |= CSDLOption.ignoreEdmAnnotations;
            break;
          }
          case ODataCDSLOptions.ignoreExternalReferences: {
            csdlOptionsBitmap |= CSDLOption.ignoreExternalReferences;
            break;
          }
          case ODataCDSLOptions.ignoreInternalReferences: {
            csdlOptionsBitmap |= CSDLOption.ignoreInternalReferences;
            break;
          }
          case ODataCDSLOptions.ignoreStandardReferences: {
            csdlOptionsBitmap |= CSDLOption.ignoreStandardReferences;
            break;
          }
          case ODataCDSLOptions.ignoreUndefinedTerms: {
            csdlOptionsBitmap |= CSDLOption.ignoreUndefinedTerms;
            break;
          }
          case ODataCDSLOptions.ignoreXmlAnnotations: {
            csdlOptionsBitmap |= CSDLOption.ignoreXmlAnnotations;
            break;
          }
          case ODataCDSLOptions.logWithUnqualifiedFileNames: {
            csdlOptionsBitmap |= CSDLOption.logWithUnqualifiedFileNames;
            break;
          }
          case ODataCDSLOptions.processMixedVersions: {
            csdlOptionsBitmap |= CSDLOption.processMixedVersions;
            break;
          }
          case ODataCDSLOptions.resolveUndefinedTerms: {
            csdlOptionsBitmap |= CSDLOption.resolveUndefinedTerms;
            break;
          }
          case ODataCDSLOptions.retainOriginalText: {
            csdlOptionsBitmap |= CSDLOption.retainOriginalText;
            break;
          }
          case ODataCDSLOptions.retainResolvedText: {
            csdlOptionsBitmap |= CSDLOption.retainResolvedText;
            break;
          }
          case ODataCDSLOptions.strictFacetWarnings: {
            csdlOptionsBitmap |= CSDLOption.strictFacetWarnings;
            break;
          }
          case ODataCDSLOptions.traceParsingOfElements: {
            csdlOptionsBitmap |= CSDLOption.traceParsingOfElements;
            break;
          }
          case ODataCDSLOptions.warnAboutUndefinedTerms: {
            csdlOptionsBitmap |= CSDLOption.warnAboutUndefinedTerms;
            break;
          }
          case ODataCDSLOptions.warnIfProviderIncompatible: {
            csdlOptionsBitmap |= CSDLOption.warnIfProviderIncompatible;
            break;
          }
          default: {
            // Unsupported csdl option
            SharedLoggerManager.pluginError(ErrorMessage.format(ErrorMessage.ODATA_UNSUPPORTED_CSDL_OPTIONS, optString));
            break;
          }
        }
      });
    }

    // tslint:enable:no-bitwise
    provider.getServiceOptions().setCsdlOptions(csdlOptionsBitmap);
    SharedLoggerManager.pluginDebug(ErrorMessage.ODATA_CSDL_OPTIONS_VALUE_AFTER_SET + csdlOptionsBitmap);
    return provider;
  }
}

enum ODataServiceOptions {
  avoidInPaths = 'avoidInPaths',
  cacheMetadata = 'cacheMetadata',
  checkQueries = 'checkQueries',
  checkResults = 'checkResults',
  checkVersion = 'checkVersion',
  clientID = 'clientID',
  createReturnsContent = 'createReturnsContent',
  dataFormat = 'dataFormat',
  dataVersion = 'dataVersion',
  databaseOnly = 'databaseOnly',
  fixMissingEmptyLists = 'fixMissingEmptyLists',
  fixMissingNullValues = 'fixMissingNullValues',
  logErrors = 'logErrors',
  logWarnings = 'logWarnings',
  metadataFile = 'metadataFile',
  metadataText = 'metadataText',
  metadataURL = 'metadataURL',
  pingAccept = 'pingAccept',
  pingMethod = 'pingMethod',
  pingResource = 'pingResource',
  requiresToken = 'requiresToken',
  requiresType = 'requiresType',
  supportsAlias = 'supportsAlias',
  supportsBatch = 'supportsBatch',
  supportsBind = 'supportsBind',
  supportsDelta = 'supportsDelta',
  supportsNext = 'supportsNext',
  supportsPatch = 'supportsPatch',
  supportsUnbind = 'supportsUnbind',
  updateReturnsContent = 'updateReturnsContent',
}

enum ODataCDSLOptions {
  allowCaseConflicts = 'allowCaseConflicts',
  defaultVariableScale = 'defaultVariableScale',
  defaultVariableSrid = 'defaultVariableSrid',
  disableFacetWarnings = 'disableFacetWarnings',
  disableLoggingOfErrors = 'disableLoggingOfErrors',
  disableLoggingOfWarnings = 'disableLoggingOfWarnings',
  disableNameValidation = 'disableNameValidation',
  excludeServerOnlyElements = 'excludeServerOnlyElements',
  failIfProviderIncompatible = 'failIfProviderIncompatible',
  ignoreAllAnnotations = 'ignoreAllAnnotations',
  ignoreAllReferences = 'ignoreAllReferences',
  ignoreEdmAnnotations = 'ignoreEdmAnnotations',
  ignoreExternalReferences = 'ignoreExternalReferences',
  ignoreInternalReferences = 'ignoreInternalReferences',
  ignoreStandardReferences = 'ignoreStandardReferences',
  ignoreUndefinedTerms = 'ignoreUndefinedTerms',
  ignoreXmlAnnotations = 'ignoreXmlAnnotations',
  logWithUnqualifiedFileNames = 'logWithUnqualifiedFileNames',
  processMixedVersions = 'processMixedVersions',
  resolveUndefinedTerms = 'resolveUndefinedTerms',
  retainOriginalText = 'retainOriginalText',
  retainResolvedText = 'retainResolvedText',
  strictFacetWarnings = 'strictFacetWarnings',
  traceParsingOfElements = 'traceParsingOfElements',
  warnAboutUndefinedTerms = 'warnAboutUndefinedTerms',
  warnIfProviderIncompatible = 'warnIfProviderIncompatible',
}

enum CSDLOption {
  processMixedVersions = 1,
  retainOriginalText = 2,
  retainResolvedText = 4,
  ignoreExternalReferences = 8,
  ignoreInternalReferences = 16,
  ignoreStandardReferences = 32,
  ignoreAllReferences = 56,
  ignoreEdmAnnotations = 64,
  ignoreXmlAnnotations = 128,
  ignoreAllAnnotations = 192,
  ignoreUndefinedTerms = 256,
  resolveUndefinedTerms = 512,
  warnAboutUndefinedTerms = 1024,
  traceParsingOfElements = 2048,
  disableNameValidation = 4096,
  allowCaseConflicts = 8192,
  defaultVariableScale = 32768,
  defaultVariableSrid = 65536,
  disableFacetWarnings = 131072,
  strictFacetWarnings = 262144,
  disableLoggingOfErrors = 524288,
  disableLoggingOfWarnings = 1048576,
  failIfProviderIncompatible = 2097152,
  warnIfProviderIncompatible = 4194304,
  logWithUnqualifiedFileNames = 8388608,
  excludeServerOnlyElements = 16777216,
}
