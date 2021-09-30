import { BaseDataBuilder } from './BaseDataBuilder';
import { IContext } from './../context/IContext';
export declare class ApplicationDataBuilder extends BaseDataBuilder {
    constructor(context: IContext);
    setMainPage(mainPage: string): ApplicationDataBuilder;
    setStylePath(stylePath: string): ApplicationDataBuilder;
    setSDKStylesPath(SDKStylePath: string): ApplicationDataBuilder;
    setVersion(version: string): ApplicationDataBuilder;
    setLocalization(localization: string): ApplicationDataBuilder;
}
