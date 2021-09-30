import { ODataLinkCreator } from './ODataLinkCreator';
import { ODataCrudOperation } from '../../BaseODataCruder';

export class ODataLinkUpdater extends ODataLinkCreator {
  public constructor(sourceEntitySetName: string, linkingParams: any) {
    super(sourceEntitySetName, linkingParams, ODataCrudOperation.Update);
  }
}
