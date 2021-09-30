import { NavigationAction } from './NavigationAction';
import { FilterActionDefinition } from '../definitions/actions/FilterActionDefinition';
import { FilterActionResult } from '../controls/IFilterable';
import { IActionResult } from '../context/IClientAPI';
export declare class FilterAction extends NavigationAction {
    constructor(actionDefinition: FilterActionDefinition);
    execute(): Promise<IActionResult>;
    private executePopover;
}
export declare class FilterActionResultData {
    private _filter;
    private _sorter;
    constructor(actionResult: FilterActionResult);
    readonly filter: string;
    readonly sorter: string;
}
