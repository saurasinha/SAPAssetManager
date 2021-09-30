import { ODataAction } from './ODataAction';
export declare class CreateODataServiceAction extends ODataAction {
    constructor(definition: any);
    execute(): Promise<import("../context/IClientAPI").IActionResult>;
}
