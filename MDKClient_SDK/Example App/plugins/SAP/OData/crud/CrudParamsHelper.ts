import { ODataLinkCreator } from './odatalinking/odatalinkers/ODataLinkCreator';
import { ODataLinkDeleter } from './odatalinking/odatalinkers/ODataLinkDeleter';
import { ODataLinkUpdater } from './odatalinking/odatalinkers/ODataLinkUpdater';
import { ErrorMessage } from '../../ErrorHandling/ErrorMessage';

export class CrudParamsHelper {
  public static readonly  MALFORMEDPARAM: string = 'Malformed parameter:';
  
  public static getHeadersFromParams(params: any): any {
    let headers = params[CrudParamsHelper.HEADERSKEY];
    if (headers != null) {
      return headers;
    } else {
      return null;
    }
  }

  public static getServiceFromParams(params: any): any {
    let service = params[CrudParamsHelper.SERVICEKEY];
    if (service != null && Object.keys(service).length > 0) {
      return service;
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.ODATA_MALFORMED_PARAMS, this.MALFORMEDPARAM, 
        this.SERVICEKEY));
    }
  }

  public static getServiceUrlFromService(params: any): string {
    let serviceUrl = params[CrudParamsHelper.SERVICEURLKEY];
    if (typeof serviceUrl === 'string' && serviceUrl.length !== 0) {
      return serviceUrl;
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.ODATA_MALFORMED_PARAMS, this.MALFORMEDPARAM, 
        this.SERVICEURLKEY));
    }
  }

  public static getEntitySetNameFromService(params: any): string {
    let entitySet = params[CrudParamsHelper.ENTITYSETNAMEKEY];
    if (typeof entitySet === 'string' && entitySet.length !== 0) {
      return entitySet;
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.ODATA_MALFORMED_PARAMS, this.MALFORMEDPARAM, 
        this.ENTITYSETNAMEKEY));
    }
  }

  public static getPropertiesFromService(params: any): any {
    let properties = params[CrudParamsHelper.ENTITYPROPERTIESKEY];
    if (properties != null) {
      return properties;
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.ODATA_MALFORMED_PARAMS, this.MALFORMEDPARAM, 
        this.ENTITYPROPERTIESKEY));
    }
  }

  public static getLinkCreatorsFromParams(params: any): any {
    let linkCreatorParams = params[CrudParamsHelper.CREATELINKS];
    if (!Array.isArray(linkCreatorParams) || linkCreatorParams.length === 0) {
      return null;
    }

    let linkCreators = new Array(linkCreatorParams.length);
    let service = this.getServiceFromParams(params);
    let entitySetName = this.getEntitySetNameFromService(service);

    for (let i = 0; i < linkCreatorParams.length; i++) {
      let linkCreator = new ODataLinkCreator(entitySetName, linkCreatorParams[i]);
      linkCreators[i] = linkCreator;
    }
    return linkCreators;
  }

  public static getLinkUpdatersFromParams(params: any): any {
    let linkUpdaterParams = params[CrudParamsHelper.UPDATELINKS];
    if (!Array.isArray(linkUpdaterParams) || linkUpdaterParams.length === 0) {
      return null;
    }

    let linkUpdaters = new Array(linkUpdaterParams.length);
    let service = this.getServiceFromParams(params);
    let entitySetName = this.getEntitySetNameFromService(service);

    for (let i = 0; i < linkUpdaterParams.length; i++) {
      let linkUpdater = new ODataLinkUpdater(entitySetName, linkUpdaterParams[i]);
      linkUpdaters[i] = linkUpdater;
    }
    return linkUpdaters;
  }

  public static getLinkDeletersFromParams(params: any): any {
    let linkDeleterParams = params[CrudParamsHelper.DELETELINKS];
    if (!Array.isArray(linkDeleterParams) || linkDeleterParams.length === 0) {
      return null;
    }

    let linkDeleters = new Array(linkDeleterParams.length);
    let service = this.getServiceFromParams(params);
    let entitySetName = this.getEntitySetNameFromService(service);

    for (let i = 0; i < linkDeleterParams.length; i++) {
      let linkDeleter = new ODataLinkDeleter(entitySetName, linkDeleterParams[i]);
      linkDeleters[i] = linkDeleter;
    }
    return linkDeleters;
  }

  public static getRequestOptionsFromService(params: any): any {
    let requestOptions = params[CrudParamsHelper.REQUESTOPTIONS];
    if (requestOptions != null) {
      return requestOptions;
    } else {
      return null;
    }
  }

  public static getParentFromParams(params: any): any {
    let parent = params[CrudParamsHelper.PARENTKEY];
    if (parent != null) {
      return parent;
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.ODATA_MALFORMED_PARAMS, this.MALFORMEDPARAM, 
        this.PARENTKEY));
    }
  }

  public static getPropertyFromParent(params: any): any {
    let property = params[CrudParamsHelper.PROPERTYKEY];
    if (property != null) {
      return property;
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.ODATA_MALFORMED_PARAMS, this.MALFORMEDPARAM, 
        this.PROPERTYKEY));
    }
  }

  private static readonly SERVICEKEY: string = 'service';
  private static readonly PROPERTYKEY: string = 'property';
  private static readonly SERVICEURLKEY: string = 'serviceUrl';
  private static readonly ENTITYSETNAMEKEY: string = 'entitySet';
  private static readonly ENTITYPROPERTIESKEY: string = 'properties';
  private static readonly CREATELINKS: string = 'createLinks';
  private static readonly UPDATELINKS: string = 'updateLinks';
  private static readonly DELETELINKS: string = 'deleteLinks';
  private static readonly HEADERSKEY: string = 'headers';
  private static readonly REQUESTOPTIONS: string = 'requestOptions';
  private static readonly PARENTKEY: string = 'parent';
}
