import { IControl } from '../controls/IControl';
import { Context } from '../context/Context';
import { PageDefinition } from '../definitions/PageDefinition';
export interface IMDKPage {
    isMDKPage: boolean;
    context: Context;
    controls: IControl[];
    definition: PageDefinition;
    findFormCellContainerOnPage(): IControl;
    initialize(context: Context, isModal: boolean): any;
}
export declare function isMDKPage(obj: IMDKPage): boolean;
