import 'tns-core-modules/globals';
import { AppExtractHelper } from './AppExtractHelper';

const context: Worker = self as any;
// NOTE: CANNOT DEBUG WORKERS
// Recommended to add this code in a function in the invoking code to debug
context.onmessage = msg => {
    setTimeout(() => {
        let error = AppExtractHelper.getInstance().extract(msg);
        (<any> global).postMessage({err: error});
        AppExtractHelper.getInstance().removeFolder();
        AppExtractHelper.getInstance().removeDownloadedZipFile();
    }, 500);
};

// onerror intentionally left out, there is no special handling to be done in the worker
// pass error back to caller
