
import { ReadParams } from './readparams/ReadParams';
import { QueryOptionsReadParams } from './readparams/QueryOptionsReadParams';
import { ReadLinkReadParams } from './readparams/ReadLinkReadParams';
import { CrudParamsHelper } from './CrudParamsHelper';
import { ErrorMessage } from '../../ErrorHandling/ErrorMessage';

export class ReadParamsFactory {
  public static createReadParams(params: any): any {
    let entitySetName = params[ReadParamsFactory.ENTITYSETNAMEKEY];
    if (typeof entitySetName !== 'string' || entitySetName.length === 0) {
      throw new Error(ErrorMessage.format(ErrorMessage.ODATA_ENTITY_NAME_NOT_FOUND, CrudParamsHelper.MALFORMEDPARAM,
        this.ENTITYSETNAMEKEY));
    }

    let queryOptions = params[ReadParamsFactory.QUERYOPTIONSKEY];
    let readLink = params[ReadParamsFactory.READLINKKEY];

    if (typeof queryOptions === 'string' && queryOptions.length !== 0) {
      return new QueryOptionsReadParams(entitySetName, queryOptions);
    } else if (typeof readLink === 'string' && readLink.length !== 0) {
      return new ReadLinkReadParams(entitySetName, readLink);
    } else {
      return new ReadParams(entitySetName);
    }
  }
  
  private static readonly ENTITYSETNAMEKEY: string = 'entitySet';
  private static readonly QUERYOPTIONSKEY: string = 'queryOptions';
  private static readonly READLINKKEY: string = 'readLink';
}
