import { BaseSectionPagingDefinition } from './BaseSectionPagingDefinition';
import { GridRowDefinition } from './GridRowDefinition';
export declare class GridTableSectionDefinition extends BaseSectionPagingDefinition {
    row: GridRowDefinition;
    headerRow: GridRowDefinition;
    constructor(path: any, data: any, parent: any);
}
