import { IContext } from '../context/IContext';
import { IErrorHandler } from '../errorHandling/IErrorHandler';
export declare class TargetPathInterpreter {
    private _context;
    private errorHandler;
    constructor(_context: IContext);
    registerErrorHandler(errorHandler: IErrorHandler): void;
    getErrorHandler(): IErrorHandler;
    evaluateTargetPathForContext(targetPath: string): IContext;
    evaluateTargetPathForValue(targetPath: string): any;
    private throwIfBadTargetPath;
    private onResolve;
}
