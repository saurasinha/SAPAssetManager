import { UniqueIdType } from '../common/UniqueIdType';
/**
 * Represent and flatten Target metadata.
 */
export interface ITargetSpecifier {
  /**
   * Defining the entity set
   */
  entitySet: string;
  /**
   * Defining the query
   */
  queryOptions?: string;
  /**
   * Defining the query builder object
   */
  queryBuilder?: object;
  /**
   * Defining the readlink
   */
  readLink?: string;
  /**
   * Defining the editlink
   */
  editLink?: string;
  /**
   * Defining the ID type
   */
  uniqueIdType: UniqueIdType;
}

/**
 * Represent and flatten Target Service metadata.
 * @ignore 
 */
export interface ITargetServiceSpecifier extends ITargetSpecifier {
  function?: {Name: string, Parameters?: {key: string, value: any}};
  keyProperties?: string[] | { key: string, value: any };
  serviceUrl: string;
  offlineEnabled: boolean;
  // The "properties" property can be either an array or an empty object or a dictionary.
  properties: string[] | {} | { key: string, value: any };
  requestOptions?: { key: string, value: any };
  statefulService?: boolean;
  headers?: { key: string, value: any };
  // MDK-8265 Support Server-side pagination with nextLink
  serverSidePaging?: boolean;
  requestProperties?: {Method: string, Headers?: {key: string, value: any}, Parameters?: {key: string, value: any}, Body?: string};
  path?: string;
  outputPath?: string;
  serviceHeaders?: { key: string, value: any };
}

/**
 * Represent and flatten Target Link metadata.
 * @ignore
 */
export interface ITargetLinkSpecifier extends ITargetSpecifier {
  property: string;
}

/**
 * Represent and flatten Media metadata.
 * @ignore
 */
export interface IMediaSpecifier {
  content: any;
  contentType: string;
  url?: string;
}

/**
 * Represent and flatten Defining Request.
 * @ignore
 */
export interface IDefiningRequest {
  Name: string;
  Query: string;
  AutomaticallyRetrievesStreams: boolean;
}

/**
 * Represent and flatten Parent metadata.
 * @ignore
 */
export interface IParentLinkSpecifier {
  entitySet: string;
  queryOptions?: string;
  readLink?: string;
  navigationProperty: string;
}
