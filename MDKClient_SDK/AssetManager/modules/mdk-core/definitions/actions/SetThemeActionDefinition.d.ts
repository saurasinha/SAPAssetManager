import { BaseActionDefinition } from './BaseActionDefinition';
export declare class SetThemeActionDefinition extends BaseActionDefinition {
    constructor(path: string, data: any);
    getTheme(): string;
}
