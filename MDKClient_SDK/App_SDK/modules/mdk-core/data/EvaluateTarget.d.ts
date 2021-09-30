import { IContext } from '../context/IContext';
import { ITargetServiceSpecifier, ITargetLinkSpecifier, IParentLinkSpecifier } from './ITargetSpecifier';
export declare function asService(data: any, context: IContext): Promise<ITargetServiceSpecifier>;
export declare function asLinks(links: any, context: IContext): Promise<ITargetLinkSpecifier[]>;
export declare function asHeaders(headers: any, context: IContext): Promise<{
    key: string;
    value: string;
}>;
export declare function asParent(data: any, context: IContext): Promise<IParentLinkSpecifier>;
export declare function asDefiningRequests(data: any, context: IContext): Promise<any[]>;
export declare function asReadLink(data: any): string;
