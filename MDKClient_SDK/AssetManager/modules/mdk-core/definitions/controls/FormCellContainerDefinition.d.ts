import { BaseControlDefinition } from './BaseControlDefinition';
import { BaseContainerDefinition } from './BaseContainerDefinition';
export declare class FormCellContainerDefinition extends BaseContainerDefinition {
    private _controlDefs;
    private _sectionCount;
    private _sectionsInformation;
    private _visibleSections;
    constructor(path: any, data: any, parent: any);
    readonly sections: any[];
    readonly sectionCount: number;
    readonly sectionNames: string[];
    visibleSectionsIndex: boolean[];
    readonly numberOfRowsInSection: number[];
    getVisibleControlDefs(): BaseControlDefinition[];
    getSectionsInformation(): {
        key: 'value';
        value: 'value';
    }[];
    getControlDefs(): BaseControlDefinition[];
    indexPath(name: string): {
        row: number;
        section: number;
    };
    private _loadControlDef;
}
