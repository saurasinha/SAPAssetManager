export declare class SelectedItem {
    binding: any;
    cell: any;
    constructor(bindingData: any, cellData: any);
}
export declare class ChangedItem extends SelectedItem {
    selected: boolean;
    constructor(bindingData: any, cellData: any, selected: boolean);
}
