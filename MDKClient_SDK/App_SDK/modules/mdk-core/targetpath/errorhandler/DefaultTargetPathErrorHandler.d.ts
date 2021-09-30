import { IErrorHandler } from '../../errorHandling/IErrorHandler';
export declare class DefaultTargetPathErrorHandler implements IErrorHandler {
    static getInstance(): DefaultTargetPathErrorHandler;
    private static instance;
    private constructor();
    error(message: string): void;
}
