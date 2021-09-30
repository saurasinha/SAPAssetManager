import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
import { CommonUtil } from '../ErrorHandling/CommonUtil';
import { messageType, write, isCategorySet } from 'tns-core-modules/trace';
import { DataConverter } from '../Common/DataConverter';

declare var DataServiceManager: any;

export class OData {
  private _bridge = DataServiceManager.sharedInstance;
  private _onChangeset = false;
  private _profilingEnabled = isCategorySet('mdk.trace.profiling');

  public createService(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.createService()'));
    }
    return new Promise((resolve, reject) => {
      return this._bridge.createWithParamsResolveReject(params, (id) => {
        resolve(id);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public openService(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.openService()'));
    }
    return new Promise((resolve, reject) => {
      return this._bridge.openWithParamsResolveReject(params, (id) => {
        resolve(id);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public downloadMedia(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.downloadMedia()'));
    }
    return new Promise((resolve, reject) => {
      return this._bridge.downloadMediaWithParamsResolveReject(params, result => {
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public isMediaLocal(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.isMediaLocal()'));
    }
    return new Promise((resolve, reject) => {
      return this._bridge.isMediaLocalWithParamsResolveReject(params, result => {
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public downloadOfflineOData(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.downloadOfflineOData()'));
    }
    return new Promise((resolve, reject) => {
      this._bridge.downloadWithParamsResolveReject(params, (id) => {
        resolve(id);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    }).catch(error => {
      CommonUtil.formatOfflineError(error);
      throw error;
    });
  }

  public initializeOfflineStore(params): Promise<any> { 
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.initializeOfflineStore()'));
    }
    return new Promise((resolve, reject) => {
      this._bridge.initOfflineStoreWithParamsResolveReject(params, (id) => {
        resolve(id);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    }).catch(error => {
      CommonUtil.formatOfflineError(error);
      throw error;
    });
  }

  public closeOfflineStore(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.closeOfflineStore()'));
    }
    return new Promise((resolve, reject) => {
      this._bridge.closeWithParamsResolveReject(params, (id) => {
        resolve(id);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public clearOfflineStore(params): Promise<any> {
    if (!params) { 
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.clearOfflineStore()'));
    }
    return new Promise((resolve, reject) => {
      this._bridge.clearWithParamsResolveReject(params, (id) => {
        resolve(id);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public uploadOfflineOData(params): Promise<any> {
    if (!params) { 
       throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.uploadOfflineOData()'));
    }
    return new Promise((resolve, reject) => {
      this._bridge.uploadWithParamsResolveReject(params, (id) => {
        resolve(id);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    }).catch(error => {
      CommonUtil.formatOfflineError(error);
      throw error;
    });
  }

  public cancelUploadOfflineOData(params): Promise<any> {
    if (!params) { 
       throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.cancelUploadOfflineOData()'));
    }
    return new Promise((resolve, reject) => {
      this._bridge.cancelUploadWithParamsResolveReject(params, (id) => {
        resolve(id);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public cancelDownloadOfflineOData(params): Promise<any> {
    if (!params) { 
       throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.cancelDownloadOfflineOData()'));
    }
    return new Promise((resolve, reject) => {
      this._bridge.cancelDownloadWithParamsResolveReject(params, (id) => {
        resolve(id);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public read(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.read()'));
    }
    return new Promise((resolve, reject) => {
      const start = Date.now();
      return this._bridge.readWithParamsResolveReject(params, result => {
        if (this._profilingEnabled) {
          let message = `Reading '${params.entitySet}' `;
          message += `with options '${params.queryOptions ? params.queryOptions : ''}'`;
          this.writeProfilingLog(start, 'OData Read', message);
        }
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public update(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.update()'));
    }

    if (params.service) {
      this.fixJSMapNullValues(params.service.properties);
    }

    return new Promise((resolve, reject) => {
      return this._bridge.updateWithParamsResolveReject(params, entity => {
        resolve(entity);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public create(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.create()'));
    }

    if (params.service) {
      this.fixJSMapNullValues(params.service.properties);
    }

    return new Promise((resolve, reject) => {
      return this._bridge.createEntityWithParamsResolveReject(params, result => {
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public createRelated(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.createRelated()'));
    }

    if (params.service) {
      this.fixJSMapNullValues(params.service.properties);
    }

    return new Promise((resolve, reject) => {
      return this._bridge.createRelatedEntityWithParamsResolveReject(params, result => {
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public delete(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.delete()'));
    }
    return new Promise((resolve, reject) => {
      return this._bridge.deleteEntityWithParamsResolveReject(params, entity => {
        resolve(entity);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public createMedia(params): Promise<any> {
    if (!params) { 
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.createMedia()'));
    }

    if (params.service) {
      this.fixJSMapNullValues(params.service.properties);
    }

    return new Promise((resolve, reject) => {
      return this._bridge.createMediaWithParamsResolveReject(params, mediaEntities => {
        let result = [];
        // convert to TypeScript array
        for (let i = 0; i < mediaEntities.count; i++) {
          result.push(mediaEntities.objectAtIndex(i));
        }
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public createRelatedMedia(params): Promise<any> {
    if (!params) { 
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.createRelatedMedia()'));
    }

    if (params.service) {
      this.fixJSMapNullValues(params.service.properties);
    }

    return new Promise((resolve, reject) => {
      return this._bridge.createRelatedMediaWithParamsResolveReject(params, mediaEntities => {
        let result = [];
        // convert to TypeScript array
        for (let i = 0; i < mediaEntities.count; i++) {
          result.push(mediaEntities.objectAtIndex(i));
        }
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public downloadStream(params: any): Promise<any> {
    if (!params || !params.service || !params.service.entitySet || 
      !params.service.properties || Object.keys(params.service.properties).length === 0) {
      throw new Error(ErrorMessage.ODATA_INVALID_STREAM_PARAMS);
    }

    return new Promise((resolve, reject) => {
      return this._bridge.downloadStreamWithParamsResolveReject(params, streams => {
        let result = [];
        // convert to TypeScript array
        for (let i = 0; i < streams.count; i++) {
          result.push(streams.objectAtIndex(i));
        }
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public uploadStream(params: any): Promise<any> {
    if (!params || !params.service || !params.service.entitySet || 
      !params.service.properties || params.service.properties.length === 0) {
      throw new Error(ErrorMessage.ODATA_INVALID_STREAM_PARAMS);
    }
    return new Promise((resolve, reject) => {
      return this._bridge.uploadStreamWithParamsResolveReject(params, result => {
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public beginChangeSet(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.beginChangeSet()'));
    }

    return new Promise((resolve, reject) => {
      return this._bridge.beginChangeSetWithParamsResolveReject(params, result => {
        this._onChangeset = true;
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public cancelChangeSet(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.cancelChangeSet()'));
    }

    return new Promise((resolve, reject) => {
      return this._bridge.cancelChangeSetWithParamsResolveReject(params, result => {
        this._onChangeset = false;
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public commitChangeSet(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.commitChangeSet()'));
    }
    
    return new Promise((resolve, reject) => {
      return this._bridge.commitChangeSetWithParamsResolveReject(params, result => {
        this._onChangeset = false;
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public isOnChangeSet(): boolean {
    return this._onChangeset;
  }

  public deleteMedia(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.deleteMedia()'));
    }
    return new Promise((resolve, reject) => {
      return this._bridge.deleteMediaWithParamsResolveReject(params, result => {
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public count(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.count()'));
    }
    return new Promise((resolve, reject) => {
      const start = Date.now();
      return this._bridge.countWithParamsResolveReject(params, result => {
        if (this._profilingEnabled) {
          let message = `Counting '${params.entitySet}' `;
          message += `with options '${params.queryOptions ? params.queryOptions : ''}'`;
          this.writeProfilingLog(start, 'OData Count', message);
        }
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public callFunction(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.callFunction()'));
    }
    let functionName = params.functionName;
    if (params.functionParameters) {
      this.fixJSMapNullValues(params.functionParameters);
    }
    if (functionName) {
      return new Promise((resolve, reject) => {
        return this._bridge.callFunctionWithParamsResolveReject(params, result => {
          resolve(result);
        }, (code, message, error) => {
          reject(CommonUtil.toJSError(code, message, error));
        });
      });
    }
  }

  public undoPendingChanges(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.undoPendingChanges()'));
    }
    return new Promise((resolve, reject) => {
      return this._bridge.undoPendingChangesWithParamsResolveReject(params, result => {
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public getPropertyType(params): string {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.getPropertyType()'));
    }
    if (params.entitySet && params.propertyName) {
      return this._bridge.getPropertyTypeWithParams(params);
    } else {
      return '';
    }
  }

  public getVersion(params): number {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.getVersion()'));
    }
    return this._bridge.getVersionWithParams(params);
  }

  public getOfflineStoreStatus(params): string {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.getOfflineStoreStatus()'));
    }
    return this._bridge.getOfflineStoreStatusWithParams(params);
  }

  public base64StringToBinary(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'ODataManager.base64StringToBinary()'));
    }
    return new Promise((resolve, reject) => {
      return this._bridge.base64StringToBinaryWithParamsResolveReject(params, result => {
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public getOfflineParameter(params): any {
    let value = this._bridge.getOfflineParameterWithParams(params);
    if (value instanceof NSDictionary) {
      if (value.count === 0) {
        return null;
      }
      return DataConverter.fromNSDictToJavascriptObject(value);
    } else {
      return value;
    }
  }

  public setOfflineParameter(params): void {
    return this._bridge.setOfflineParameterWithParams(params);
  }

  public getPreviousUser(): string {
    return '';
  }

  private fixJSMapNullValues(map) {
    if (map) {
      for (let key in map) {
        if (map[key] && typeof map[key] === 'object' && map[key].constructor === Object) {
          this.fixJSMapNullValues(map[key]);
        } else {
          if (map[key] == null) {
            map[key] = NSNull.null();
          } 
        }
      }
    }
  }

  private writeProfilingLog(start, category, message) {
    const end = Date.now();
    const durationInMS = end - start;

    let logMessage = category + ' - ';
    logMessage += `${start} - ${end} - ${durationInMS} ms - ${message}`;

    write(logMessage, 'mdk.trace.profiling', messageType.log);
  }
};
