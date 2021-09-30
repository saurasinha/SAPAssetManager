import { BaseDataBuilder } from '../BaseDataBuilder';
import { IContext } from '../../context/IContext';
export declare class ODataActionBuilder extends BaseDataBuilder {
    constructor(context: IContext);
    build(): Promise<any>;
    setIsOnlineRequest(isOnlineRequest: boolean): ODataActionBuilder;
    setForce(force: boolean): ODataActionBuilder;
    setMedia(media: string): ODataActionBuilder;
    setQueryOptions(queryOptions: string): ODataActionBuilder;
    setService(service: any): ODataActionBuilder;
    setProperties(properties: any): ODataActionBuilder;
    setProgressText(progressText: string): ODataActionBuilder;
    setShowActivityIndicator(showActivityIndicator: boolean): ODataActionBuilder;
    setActionResult(actionResult: any): ODataActionBuilder;
    setUploadCategories(uploadCategories: string[]): ODataActionBuilder;
}
