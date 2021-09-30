import { BaseSectionDefinition } from './BaseSectionDefinition';
import { BaseControlDefinition } from '../controls/BaseControlDefinition';
export declare class FormCellSectionDefinition extends BaseSectionDefinition {
    private _controlDefs;
    private _sectionInfo;
    constructor(path: any, data: any, parent: any);
    readonly Controls: [Object];
    getControlDefs(): BaseControlDefinition[];
    getSectionInfo(): any;
    private _loadControlDef;
}
