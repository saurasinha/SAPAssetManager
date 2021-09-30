import { ODataAction } from './ODataAction';
export declare class DeleteODataMediaAction extends ODataAction {
    constructor(definition: any);
    execute(): Promise<any>;
    protected publishAfterSuccess(): Promise<boolean>;
}
