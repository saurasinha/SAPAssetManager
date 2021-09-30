import { BaseObservable } from './BaseObservable';
import { SectionedTable } from '../controls/SectionedTable';
import { SectionedTableDefinition } from '../definitions/controls/SectionedTableDefinition';
import { Page } from 'tns-core-modules/ui/page';
import { ODataAction } from '../actions/ODataAction';
export declare class SectionedTableObservable extends BaseObservable {
    constructor(table: SectionedTable, sectionedTableDefinition: SectionedTableDefinition, oPage: Page);
    onDataChanged(action: ODataAction, result: any): void;
    protected registerDataListeners(oControlDef: any): Promise<any>;
    resolveLoadingIndicator(): Promise<any>;
}
