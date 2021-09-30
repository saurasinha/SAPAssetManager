import { BaseJSONDefinition } from './BaseJSONDefinition';
import { BaseControlDefinition } from './controls/BaseControlDefinition';
export declare class ContainerDefinition extends BaseJSONDefinition {
    private controls;
    constructor(path: any, data: any);
    getCaption(): any;
    getControls(): BaseControlDefinition[];
    isValidControl(type: any): boolean;
    private _loadControls;
}
