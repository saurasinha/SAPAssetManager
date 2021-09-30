import { MDKPage } from '../pages/MDKPage';
import { Context } from '../context/Context';
import { ContainerDefinition } from '../definitions/ContainerDefinition';
import { IDataService } from '../data/IDataService';
export interface IControlData {
    page: MDKPage;
    context: Context;
    container: ContainerDefinition;
    definition: any;
    dataService?: IDataService;
}
export declare function asControlData(page: MDKPage, context: Context, container: ContainerDefinition, definition: any): IControlData;
