import { BaseJSONDefinition } from '../BaseJSONDefinition';
import { GridTableSectionDefinition } from './GridTableSectionDefinition';
import { GridLayoutDefinition } from './GridLayoutDefinition';
import { GridRowItemDefinition } from './GridRowItemDefinition';
export declare class GridRowDefinition extends BaseJSONDefinition {
    private parent;
    layout: GridLayoutDefinition;
    items: GridRowItemDefinition[];
    constructor(path: any, data: any, parent: GridTableSectionDefinition);
    readonly accessoryType: string;
    readonly defaultAccessoryType: string;
    readonly onAccessoryButtonPress: string;
    readonly onPress: string;
}
