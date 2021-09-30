import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
import { ODataServiceUtils } from './ODataServiceUtils';
import { ODataServiceProvider } from './ODataServiceProvider';
import { ODataCreator } from './crud/ODataCreator';
import { ODataRelatedCreator } from './crud/ODataRelatedCreator';
import { ODataUpdater } from './crud/ODataUpdater';
import { ODataDeleter } from './crud/ODataDeleter';
import { CrudParams } from './crud/CrudParams';
import { ODataCrudOperation } from './crud/BaseODataCruder';
import * as application from 'tns-core-modules/application';
import { messageType, write, isCategorySet } from 'tns-core-modules/trace';

declare var com;

export class OData {

  private dataProviders = [];
  private offlineDataProviders = [];
  private onChangeset = false;
  private profilingEnabled = isCategorySet('mdk.trace.profiling');

  public createService(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.createService()'));
    }
    
    let serviceUrl = params.serviceUrl;
    let provider = new ODataServiceProvider();
    if (typeof serviceUrl === 'string') {
      return new Promise((resolve, reject) => {
        provider.create(params).then((result: any) => {
          let serviceName = ODataServiceUtils.getServiceName(serviceUrl);
          if (serviceName !== null) {
            this.dataProviders[serviceName] = provider;
            resolve(result);
          } else {
            reject(ErrorMessage.ODATA_INVALID_SERVICE_NAME);
          }
        }).catch((error) => {
          reject(error);
        });
      });
    } else {
      return Promise.reject(new Error(ErrorMessage.ODATA_SERVICE_URL_NOT_A_STRING));
    }
  }

  public openService(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.openService()'));
    }
    
    try {
      let provider = this.getDataProvider({serviceUrl: params.serviceUrl, offlineEnabled: false});
      return new Promise((resolve, reject) => {
        provider.open(application.android.context, params).then((result: any) => {
          resolve(result);
        }).catch((error) => {
          reject(error);
        });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public downloadMedia(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.downloadMedia()'));
    }
    
    try {
      let provider = this.getDataProvider(params);
      let crudParams = new CrudParams(params, ODataCrudOperation.Read);
      return provider.downloadMedia(crudParams.getEntitySetName(), crudParams.getQueryString(), 
        crudParams.getReadLink(), crudParams.getHeaders(), crudParams.getRequestOptions());
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public isMediaLocal(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.isMediaLocal()'));
    }

    try {
      let provider = this.getDataProvider(params);
      if (typeof params.entitySet !== 'string' || params.entitySet.length === 0) {
        return Promise.reject(new Error(ErrorMessage.ODATA_ENTITY_PROP_NOT_FOUND));
      }
      return provider.isMediaLocal(params.entitySet, params.readLink);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public downloadOfflineOData(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.downloadOfflineOData()'));
    }

    try {
      let provider = this.getDataProvider(params);
      return provider.download(params);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public initializeOfflineStore(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.initializeOfflineStore()'));
    }

    try {
      let serviceName = ODataServiceUtils.getServiceName(params.serviceUrl);
      if (serviceName != null) {
        let offlineProvider = this.offlineDataProviders[serviceName];
        if (offlineProvider != null && offlineProvider.getOfflineStoreStatus() === 'initialized') {
          return Promise.resolve(null);
        } else {
          let provider = new ODataServiceProvider();
          return provider.initOfflineStore(application.android.context, params).then((result: any) => {
              this.offlineDataProviders[serviceName] = provider;
              return Promise.resolve(result);
          });
        }
      } else {
        return Promise.reject(new Error(ErrorMessage.ODATA_SERVICE_NAME_MISSING));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public getPreviousUser(): string{
    let provider = new ODataServiceProvider();
    return provider.getPreviousUser(); 
  }

  public closeOfflineStore(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.closeOfflineStore()'));
    }

    try {
      let provider = this.getDataProvider(params);
      return provider.close(params);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public clearOfflineStore(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.clearOfflineStore()'));
    }
    
    try {
      let serviceName = ODataServiceUtils.getServiceName(params.serviceUrl);
      if (serviceName == null) {
        throw new Error(ErrorMessage.ODATA_SERVICE_NAME_MISSING);
      }

      let provider = this.offlineDataProviders[serviceName];
      if (provider) {
        return provider.clear(params).then((result) => {
          this.offlineDataProviders[serviceName] = null;        
          return result;
        });
      } else {
        const isForce = (typeof params.force === 'boolean') ? params.force : false;
        if (!isForce) {
            let errorMsg = ErrorMessage.ODATA_SERVICE_PROVIDER_NOT_INITIALIZED;
            return Promise.reject(new Error(errorMsg));
        }
        return ODataServiceProvider.clear(application.android.context, params.serviceUrl);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public uploadOfflineOData(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.uploadOfflineOData()'));
    }
    
    try {
      let provider = this.getDataProvider(params);
      return provider.upload(params);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public cancelUploadOfflineOData(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.cancelUploadOfflineOData()'));
    }
    try {
      let provider = this.getDataProvider(params);
      return provider.cancelUpload(params);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public cancelDownloadOfflineOData(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.cancelDownloadOfflineOData()'));
    }
    try {
      let provider = this.getDataProvider(params);
      return provider.cancelDownload(params);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public read(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.read()'));
    }
    
    try {
      const start = Date.now();
      let provider = this.getDataProvider(params);

      let entitySet = params.entitySet; 
      let properties = params.properties; 
      let headers = params.headers;
      let requestOptions = params.requestOptions;
      if (typeof entitySet !== 'string' || entitySet.length === 0 || !Array.isArray(properties)) {
        return Promise.reject(new Error(ErrorMessage.ODATA_ENTITY_PROP_NOT_FOUND));
      }
      let pageSize = params.PageSize;
      let queryString = (typeof params.queryOptions === 'string' && params.queryOptions.length !== 0) ?  
      params.queryOptions : null;
      return provider.read(entitySet, properties, queryString, headers, requestOptions, pageSize).then(jsonString => {
        if (this.profilingEnabled) {
          let message = `Reading '${params.entitySet}' `;
          message += `with options '${params.queryOptions ? params.queryOptions : ''}'`;
          this.writeProfilingLog(start, 'OData Read', message);
        }
        return Promise.resolve(jsonString);
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public update(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.update()'));
    }
    
    return new Promise((resolve, reject) => {
      try {
        let updater = new ODataUpdater(params);
        let provider = this.getDataProvider(params.service);
        resolve(provider.updateEntity(updater));
      } catch (error) {
        reject(error);
      }
    });
  }

  public create(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.create()'));
    }
    
    return new Promise((resolve, reject) => {
      try {
        let creator = new ODataCreator(params);
        let provider = this.getDataProvider(params.service);
        resolve(provider.createEntity(creator));
      } catch (error) {
        reject(error);
      }
    });
  }

  public createRelated(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.createRelated()'));
    }
    
    return new Promise((resolve, reject) => {
      try {
        let creator = new ODataRelatedCreator(params);
        let provider = this.getDataProvider(params.service);
        resolve(provider.createRelatedEntity(creator));
      } catch (error) {
        reject(error);
      }
    });
  }

  public delete(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.delete()'));
    }
    
    return new Promise((resolve, reject) => {
      try {
        let deleter = new ODataDeleter(params);
        let provider = this.getDataProvider(params.service);
        resolve(provider.deleteEntity(deleter));
      } catch (error) {
        reject(error);
      }
    });
  }

  public createMedia(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.createMedia()'));
    }
    if (!params.entitySet || !params.properties || !params.headers || !params.media || params.media.length === 0) {
      throw new Error(ErrorMessage.ODATA_CREATE_MEDIA_ENTITY_FAILED);
    }

    try {
      let provider = this.getDataProvider(params);
      // workaround for CAP service
      let flagKey = 'CreateEntityFirst';
      if (params.headers && params.headers[flagKey] && params.headers[flagKey] === 'true') {
        return provider.createMediaEntity1(params.entitySet, params.properties, params.headers, params.media);
      } else {
      return provider.createMediaEntity(params.entitySet, params.properties, 
        params.headers, params.requestOptions, params.media);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public createRelatedMedia(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.createRelatedMedia()'));
    }
    if (!params.entitySet || !params.properties || !params.parent || !params.parent.entitySet || 
      !params.parent.property || !params.headers || !params.media || params.media.length === 0) {
      throw new Error(ErrorMessage.ODATA_CREATE_RELATED_MEDIA_ENTITY_FAILED);
    }

    try {
      let provider = this.getDataProvider(params);
      return provider.createRelatedMediaEntity(params.entitySet, params.properties, 
        params.parent, params.headers, params.requestOptions, params.media);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public beginChangeSet(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.beginChangeSet()'));
    }
    
    try {
      let provider = this.getDataProvider(params);
      return provider.beginChangeSet(params);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public cancelChangeSet(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.cancelChangeSet()'));
    }
    
    try {
      let provider = this.getDataProvider(params);
      return provider.cancelChangeSet(params);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public commitChangeSet(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.commitChangeSet()'));
    }
    
    try {
      let provider = this.getDataProvider(params);
      return provider.commitChangeSet(params);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public isOnChangeSet(): boolean {
    return this.onChangeset;
  }

  public deleteMedia(params: any): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.deleteMedia()'));
    }
    try {
      let provider = this.getDataProvider(params);
      let crudParams = new CrudParams(params, ODataCrudOperation.Delete);
      return provider.deleteMediaEntity(crudParams.getEntitySetName(), crudParams.getQueryString(), 
        crudParams.getReadLink(), crudParams.getHeaders(), crudParams.getRequestOptions());
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public downloadStream(params: any): Promise<any> {
    if (!params || !params.service || !params.service.entitySet || 
      !params.service.properties || params.service.properties.length === 0) {
      throw new Error(ErrorMessage.ODATA_INVALID_STREAM_PARAMS);
    }
    
    try {
      let service = params.service;
      let provider = this.getDataProvider(service);
      return provider.downloadStream(service.entitySet, service.properties, 
        service.queryOptions, service.readLink, service.headers, service.requestOptions);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public uploadStream(params: any): Promise<any> {
    if (!params || !params.service || !params.service.entitySet || 
      !params.service.properties || Object.keys(params.service.properties).length === 0) {
      throw new Error(ErrorMessage.ODATA_INVALID_STREAM_PARAMS);
    }
    try {
      let service = params.service;
      let provider = this.getDataProvider(service);
      return provider.uploadStream(service.entitySet, service.properties, 
        service.queryOptions, service.readLink, service.headers, service.requestOptions);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public count(params: any): Promise<number> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.count()'));
    }

    try {
      const start = Date.now();
      let provider = this.getDataProvider(params);

      let entitySet = params.entitySet; 
      let properties = params.properties; 
      let headers = params.headers;
      let requestOptions = params.requestOptions;
      if (typeof entitySet !== 'string' || entitySet.length === 0 || !Array.isArray(properties)) {
        return Promise.reject(new Error(ErrorMessage.ODATA_ENTITY_PROP_NOT_FOUND));
      }

      let queryString = (typeof params.queryOptions === 'string' && params.queryOptions.length !== 0) 
        ? params.queryOptions : null;
      return provider.count(entitySet, properties, queryString, headers, requestOptions).then(result => {
        if (this.profilingEnabled) {
          let message = `Counting '${params.entitySet}' `;
          message += `with options '${params.queryOptions ? params.queryOptions : ''}'`;
          this.writeProfilingLog(start, 'OData Count', message);
        }
        return Promise.resolve(result);
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public callFunction(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.callFunction()'));
    }
    try {
      let provider = this.getDataProvider(params);
      let functionName = params.functionName;
      if (functionName == null) {
        return Promise.reject(new Error(ErrorMessage.ODATA_MISSING_FUNCTION_NAME_FOR_FUNCTION_IMPORT));
      }
      let functionParameters = params.functionParameters;
      let functionHeaders = params.functionHeaders;
      let functionOptions = params.functionOptions;
  
      return provider.callFunction(functionName, functionParameters, functionHeaders, functionOptions);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public undoPendingChanges(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.undoPendingChanges()'));
    }
    try {
      let provider = this.getDataProvider(params);
      return provider.undoPendingChanges(params.entitySet, params.queryOptions, params.editLink);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public base64StringToBinary(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.base64StringToBinary()'));
    }
    return Promise.resolve(ODataServiceUtils.base64StringToBinary(params));
  }

  public getPropertyType(params): string {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.getPropertyType()'));
    }
    try {
      let provider = this.getDataProvider(params);
      if (params.entitySet && params.propertyName) {
        return provider.getPropertyType(params.entitySet, params.propertyName);
      }
    } catch (error) {
      write(error.message, 'mdk.trace.odata', messageType.log);
    }
    return '';
  }

  public getVersion(params): number {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.getVersion()'));
    }
    try {
      let provider = this.getDataProvider(params);
      return provider.getVersion();
    } catch (error) {
      write(error.message, 'mdk.trace.odata', messageType.log);
    }
    return 0;
  }

  public getOfflineStoreStatus(params): string {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.getOfflineStoreStatus()'));
    }
    try {
      let provider = this.getDataProvider(params);
      return provider.getOfflineStoreStatus();
    } catch (error) {
      write(error.message, 'mdk.trace.odata', messageType.log);
    }
    return '';
  }

  public getOfflineParameter(params): any {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.getOfflineParameter()'));
    }
    try {
      let provider = this.getDataProvider(params);
      let value = provider.getOfflineParameter(params.name);
      if (value.getClass().getSimpleName() === 'HashMap') {
        if (value.size() === 0) {
          return null;
        }
        
        let map = {};
        let iterator = value.entrySet().iterator();
        while (iterator.hasNext()) {
          let entry = iterator.next();
          map[entry.getKey()] = entry.getValue();
        }
        return map;
      } else {
        return value;
      }
    } catch (error) {
      write(error.message, 'mdk.trace.odata', messageType.log);
    }
  }

  public setOfflineParameter(params): void {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.setOfflineParameter()'));
    }
    try {
      let provider = this.getDataProvider(params);
      return provider.setOfflineParameter(params.name, params.value);
    } catch (error) {
      write(error.message, 'mdk.trace.odata', messageType.log);
    }
  }

  private getDataProvider(params: any): any {
    if (params.serviceUrl == null) {
      throw new Error(ErrorMessage.ODATA_SERVICE_URL_MISSING);
    }
    
    let offlineEnabled = true;

    // For CRUD and Media functions
    if (typeof params.offlineEnabled === 'boolean' && !params.offlineEnabled) {
      offlineEnabled = false;
    }

    return this.getProvider(params.serviceUrl, offlineEnabled);
  }

  private getProvider(serviceUrl: string, offlineEnabled: boolean): any {
    let serviceName = ODataServiceUtils.getServiceName(serviceUrl);
    if (serviceName == null ) {
      throw new Error(ErrorMessage.ODATA_SERVICE_NAME_MISSING);
    }

    let provider = offlineEnabled ? this.offlineDataProviders[serviceName] : this.dataProviders[serviceName];
    if (provider == null) {
      throw new Error(ErrorMessage.ODATA_SERVICE_PROVIDER_NOT_FOUND);
    }
    return provider;
  }

  private writeProfilingLog(start, category, message) {
    const end = Date.now();
    const durationInMS = end - start;

    let logMessage = category + ' - ';
    logMessage += `${start} - ${end} - ${durationInMS} ms - ${message}`;

    write(logMessage, 'mdk.trace.profiling', messageType.log);
  }
};
