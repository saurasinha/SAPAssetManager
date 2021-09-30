import { BaseActionDefinition } from './BaseActionDefinition';
export declare class SetLanguageActionDefinition extends BaseActionDefinition {
    constructor(path: string, data: any);
    getLanguage(): string;
}
