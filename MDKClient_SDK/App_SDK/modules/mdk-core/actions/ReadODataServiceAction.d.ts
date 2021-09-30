import { ODataAction } from './ODataAction';
import { IActionResult } from '../context/IClientAPI';
export declare class ReadODataServiceAction extends ODataAction {
    constructor(definition: any);
    execute(): Promise<IActionResult>;
}
