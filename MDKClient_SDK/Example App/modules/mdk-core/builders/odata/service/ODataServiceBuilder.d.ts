import { BaseDataBuilder } from '../../BaseDataBuilder';
import { IContext } from '../../../context/IContext';
export declare class ODataServiceBuilder extends BaseDataBuilder {
    constructor(context: IContext);
    build(): Promise<any>;
    setCsdlOptions(csdlOptions: string[]): ODataServiceBuilder;
    setServiceOptions(serviceOptions: any): ODataServiceBuilder;
    setOfflineCsdlOptions(offlineCsdlOptions: string[]): ODataServiceBuilder;
    setOfflineServiceOptions(offlineServiceOptions: any): ODataServiceBuilder;
    setOfflineStoreParameters(offlineStoreParameters: any): ODataServiceBuilder;
    setHeaders(headers: any): ODataServiceBuilder;
    setOfflineEnabled(offlineEnabled: any): ODataServiceBuilder;
    setLanguageUrlParam(languageUrlParam: string): ODataServiceBuilder;
}
