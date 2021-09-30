export declare class Tracer {
    static readonly instance: Tracer;
    static startTrace(message?: string, category?: string): number;
    static commitTrace(traceId: number, message?: string, category?: string): void;
    private static _instance;
    private static _lastTraceId;
    private static _activeTraces;
    private _profilingEnabled;
    private constructor();
}
