import { UploadODataStreamActionDefinition } from '../definitions/actions/UploadODataStreamActionDefinition';
import { ODataAction } from './ODataAction';
import { IActionResult } from '../context/IClientAPI';
export declare class UploadODataStreamAction extends ODataAction {
    private headerKeys;
    constructor(definition: UploadODataStreamActionDefinition);
    execute(): Promise<IActionResult>;
    protected publishAfterSuccess(): Promise<boolean>;
}
