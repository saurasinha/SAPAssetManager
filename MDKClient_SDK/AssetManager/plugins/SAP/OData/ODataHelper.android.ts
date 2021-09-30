import { ODataServiceUtils } from './ODataServiceUtils';
import { ODataConverter } from './ODataConverter';
import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
import { SharedLoggerManager } from '../Foundation/Common/SharedLogger/SharedLoggerManager';

declare var com;
const oDataPkg = com.sap.cloud.mobile.odata;
const TransactionID = oDataPkg.offline.OfflineODataRequestOptions.TransactionID;
const UploadCategory = oDataPkg.offline.OfflineODataRequestOptions.UploadCategory;
const GlobalDateTime = oDataPkg.GlobalDateTime;

export class ODataHelper {
  // EntityValueList
  public static createEntityValueList(): any {
    return new oDataPkg.EntityValueList();
  }

  public static entityValueListToJson(entityValueList: any, dataContext: any, isErrorArchive?: boolean): string {
    /* tslint:disable:no-bitwise */
    let bindOptions = oDataPkg.DataContext.SEND_TO_CLIENT | oDataPkg.DataContext.SAP_ENTITY_STATE_ANNOTATIONS;
    if (!isErrorArchive) {
      bindOptions |= oDataPkg.DataContext.FULL_METADATA;
    }

    dataContext.setBindOptions(bindOptions);
    dataContext.setVersionCode(oDataPkg.DataVersion.ODATA_V4);
    return oDataPkg.json.JsonValue.fromEntityList(entityValueList, dataContext).toString();
  }

  // ComplexValueList
  public static complexValueListToJson(complexList: any, dataContext: any): string {
    /* tslint:disable:no-bitwise */
    let bindOptions = oDataPkg.DataContext.SEND_TO_CLIENT | oDataPkg.DataContext.FULL_METADATA |
    oDataPkg.DataContext.SAP_ENTITY_STATE_ANNOTATIONS;
    dataContext.setBindOptions(bindOptions);
    dataContext.setVersionCode(oDataPkg.DataVersion.ODATA_V4);
    return oDataPkg.json.JsonValue.fromComplexList(complexList, dataContext).toString();
  }

  // basic
  public static dataValueToJson(dataValue: any, dataContext: any): string {
    /* tslint:disable:no-bitwise */
    dataContext.setBindOptions(oDataPkg.DataContext.SEND_TO_CLIENT | oDataPkg.DataContext.FULL_METADATA |
      oDataPkg.DataContext.SAP_ENTITY_STATE_ANNOTATIONS);
    dataContext.setVersionCode(oDataPkg.DataVersion.ODATA_V4);
    return oDataPkg.json.JsonValue.fromDataValue(dataValue, dataContext).toString();
  }

  // basic list
  public static dataListValueToJson(dataListValue: any, dataContext: any): string {
    /* tslint:disable:no-bitwise */
    let bindOptions = oDataPkg.DataContext.SEND_TO_CLIENT | oDataPkg.DataContext.FULL_METADATA |
    oDataPkg.DataContext.SAP_ENTITY_STATE_ANNOTATIONS;
    dataContext.setBindOptions(bindOptions);
    dataContext.setVersionCode(oDataPkg.DataVersion.ODATA_V4);
    return oDataPkg.json.JsonValue.fromBasicList(dataListValue, dataContext).toString();
  }

  // EntityValue
  public static createEntityValue(entityType: any): any {
    return oDataPkg.EntityValue.ofType(entityType);
  }

  public static entityValueToJson(entityValue: any, dataContext: any): string {
    dataContext.setBindOptions(oDataPkg.DataContext.SEND_TO_CLIENT | oDataPkg.DataContext.FULL_METADATA |
      oDataPkg.DataContext.SAP_ENTITY_STATE_ANNOTATIONS);
    dataContext.setVersionCode(oDataPkg.DataVersion.ODATA_V4);
    return oDataPkg.json.JsonValue.fromEntityValue(entityValue, dataContext).toString();
  }

  public static setEntityValueProperties(entityValue: any, dataService: any, properties: any): void {
    let converter = new ODataConverter(dataService);
    for (let key in properties) {
      if (key) {
        let prop = entityValue.getEntityType().getProperty(key);
        entityValue.setDataValue(prop, converter.convert(key, properties[key], prop.getDataType().getCode(), 
          prop.getDataType().getName()));
      }
    }
  }

  public static isEntityValueKnownToBackend(entityValue: any): boolean {
    return entityValue.getReadLink() != null && entityValue.getReadLink().indexOf('lodata_sys_eid') === -1;
  }

  public static entityWithReadLink(changeSet: any, readLink: string): any {
    for (let i = 0; i < changeSet.size(); i++) {
      if (changeSet.isEntity(i)) {
        let entity = changeSet.getEntity(i);
        if (entity.getReadLink() === readLink) {
          return entity;
        }
      }
    }
    return null;
  }

  // ComplexValue
  public static complexValueToJson(complexValue: any, dataContext: any): string {
    dataContext.setBindOptions(oDataPkg.DataContext.SEND_TO_CLIENT | oDataPkg.DataContext.FULL_METADATA |
      oDataPkg.DataContext.SAP_ENTITY_STATE_ANNOTATIONS);
    dataContext.setVersionCode(oDataPkg.DataVersion.ODATA_V4);
    return oDataPkg.json.JsonValue.fromComplexValue(complexValue, dataContext).toString();
  }

  // Property
  public static partnerPropertyFromEntity(property: any, entity: any): any {
    let odataAssociationPartnerPropName = property.getPartnerPath();
    if (odataAssociationPartnerPropName == null) {
      return null;
    }
    let entityType = entity.getEntityType();
    if (entityType.getPropertyMap().get(odataAssociationPartnerPropName)) {
      return entity.getEntityType().getProperty(odataAssociationPartnerPropName);
    } else {
      return null;
    }
  }

  // HttpHeaders
  public static createHttpHeaders(): any {
    return new oDataPkg.http.HttpHeaders();
  }

  // DataContext
  public static createDataContext(dataService: any): any {
    return new oDataPkg.DataContext(dataService);
  }

  // DataQuery
  public static createDataQuery(): any {
    return new oDataPkg.DataQuery();
  }

  // ChangeSet
  public static createChangeSet(): any {
    return new oDataPkg.ChangeSet();
  }

  public static createRequestBatch(): any {
    return new oDataPkg.RequestBatch();
  }

  public static isOnlineProvider(dataService: any): boolean {
    return (dataService.getProvider() instanceof oDataPkg.OnlineODataProvider);
  }

  // Get Request Options
  public static getRequestOptions(requestOptions: any, dataService: any): any {
    SharedLoggerManager.pluginDebug('!!!RequestOptions!!!');
    if (!requestOptions) {
      return oDataPkg.RequestOptions.none;
    }

    let requestOptionsLog = {};
    let logKey: string;
    let options;
    let isOnline = this.isOnlineProvider(dataService);
    if (isOnline) {
      options = new oDataPkg.RequestOptions();
    } else {
      options = new oDataPkg.offline.OfflineODataRequestOptions();
    }
    if (requestOptions.UpdateMode) {
      logKey = 'updateMode';
      if (requestOptions.UpdateMode.toLocaleLowerCase() === 'replace') {
        options.setUpdateMode(oDataPkg.UpdateMode.REPLACE);
        requestOptionsLog[logKey] = 'Replace';
      }
    }

    logKey = 'preferNoContent';
    if (requestOptions.PreferNoContent === true) {
      options.setPreferNoContent(true);
      requestOptionsLog[logKey] = true;
    } else if (requestOptions.PreferNoContent === false) {
      options.setPreferNoContent(false);
      requestOptionsLog[logKey] = false;
    }

    logKey = 'sendEmptyUpdate';
    if (requestOptions.SendEmptyUpdate === true) {
      options.setSendEmptyUpdate(true);
      requestOptionsLog[logKey] = true;
    } else if (requestOptions.SendEmptyUpdate === false) {
      options.setSendEmptyUpdate(false);
      requestOptionsLog[logKey] = false;
    }

    // set offline request options
    if (!isOnline) {
      if (requestOptions.CustomHeaderFormatTemplate) {
        logKey = 'customHeaderFormatTemplate';
        options.setCustomHeaderFormatTemplate(requestOptions.CustomHeaderFormatTemplate);
        requestOptionsLog[logKey] = requestOptions.CustomHeaderFormatTemplate;
      }

      logKey = 'removeCreatedEntityAfterUpload';
      if (requestOptions.RemoveCreatedEntityAfterUpload === true) {
        options.setRemoveCreatedEntityAfterUpload(true);
        requestOptionsLog[logKey] = true;
      } else if (requestOptions.RemoveCreatedEntityAfterUpload === false) {
        options.setRemoveCreatedEntityAfterUpload(false);
        requestOptionsLog[logKey] = false;
      }

      logKey = 'unmodifiableRequest';
      if (requestOptions.UnmodifiableRequest === true) {
        options.setUnmodifiableRequest(true);
        requestOptionsLog[logKey] = true;
      } else if (requestOptions.UnmodifiableRequest === false) {
        options.setUnmodifiableRequest(false);
        requestOptionsLog[logKey] = false;
      }
      if (requestOptions.UploadCategory) {
        logKey = 'uploadCategory';
        if (requestOptions.UploadCategory.toLocaleLowerCase() === 'usegeneratedid') {
          options.setUploadCategory(UploadCategory.useGeneratedIDForUploadCategory);
          requestOptionsLog[logKey] = 'UseGeneratedID';
        } else {
          options.setUploadCategory(new UploadCategory(requestOptions.UploadCategory));
          requestOptionsLog[logKey] = requestOptions.UploadCategory;
        }
      } 
      if (requestOptions.TransactionID) {
        logKey = 'transactionID';
        if (requestOptions.TransactionID.toLocaleLowerCase() === 'usegeneratedid') {
          options.setTransactionID(TransactionID.UseGeneratedIDForTransactionID);
          requestOptionsLog[logKey] = 'UseGeneratedID';
        } else {
          options.setTransactionID(new TransactionID(requestOptions.TransactionID));
          requestOptionsLog[logKey] = requestOptions.TransactionID;
        }
      }
    }
    SharedLoggerManager.pluginDebug(JSON.stringify(requestOptionsLog));
    return options;
  }

  public static getHttpHeaders(headers: any): any {
    SharedLoggerManager.pluginDebug('!!!HttpHeaders!!!');
    if (!headers) {
      return oDataPkg.http.HttpHeaders.empty;
    }

    let httpHeader = this.createHttpHeaders();
    for (let key in headers) {
      if (key) {
        if (headers[key].indexOf('\r') !== -1 || headers[key].indexOf('\n') !== -1) {
          throw new Error(ErrorMessage.ODATA_INVALID_CHARS_IN_HTTP_HEADERS);
        }
        httpHeader.set(key, headers[key]);
      }
    }
    SharedLoggerManager.pluginDebug(JSON.stringify(headers));
    return httpHeader;
  }

  public static createAction0(args: any) {
    return new oDataPkg.core.Action0(args);
  }

  public static createAction1(args: any) {
    return new oDataPkg.core.Action1(args);
  }
}
