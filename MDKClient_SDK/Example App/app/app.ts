
import * as application from 'tns-core-modules/application';
import { categories, enable, setCategories, clearWriters, addWriter } from 'tns-core-modules/trace';
import { Application as ApplicationBridge } from 'mdk-core/Application';
import { Application } from './Application';
import { LifecycleManager as LifecycleManagerBridge } from 'mdk-core/lifecycleManagement/LifecycleManager';
import { LifecycleManager } from './lifecycleManagement/LifecycleManager';
import { Paths as PathsBridge } from 'mdk-core/storage/Paths';
import { Paths } from './storage/Paths';
import { CustomEventHandler } from './App_Delegates/CustomEventHandler';
import { ClientSettings } from 'mdk-core/storage/ClientSettings';
import { DemoBundleDefinitionLoader as DemoBundleDefinitionLoaderBridge }
  from 'mdk-core/definitions/DemoBundleDefinitionLoader';
import { DemoBundleDefinitionLoader } from './definitions/DemoBundleDefinitionLoader';
import { RequireUtil } from 'mdk-core/utils/RequireUtil';
import { ConsoleWriter } from 'mdk-core/utils/ConsoleWriter';
import '@nota/nativescript-accessibility-ext';

ApplicationBridge.setApplication(Application);
LifecycleManagerBridge.setInstance(LifecycleManager.getInstance());
PathsBridge.setClass(Paths);
DemoBundleDefinitionLoaderBridge.setLoader(DemoBundleDefinitionLoader);

RequireUtil.setRequire(global.loadModule);
// tslint:disable-next-line:no-string-literal
global['mdkRequire'] = RequireUtil.require;

if (ClientSettings.getTracingEnabled()) {
  let traceCategories: string = '';
  ClientSettings.getTracingCategories().forEach(category => {
    traceCategories = categories.concat(traceCategories, category);
  });
  enable();
  setCategories(traceCategories);
  clearWriters();
  addWriter(new ConsoleWriter(traceCategories));
}

if (application.ios) {
  // tslint:disable:no-var-requires
  let customAppDelegate = require('./App_Delegates/CustomAppDelegate');
  application.ios.delegate = customAppDelegate.CustomAppDelegate;
} else if (application.android) {
  let custHander = new CustomEventHandler();

  // app lifecycle events
  application.on(application.launchEvent, (args) => custHander.onAppLaunched(args));

  // activity lifecycle events
  application.android.on(application.AndroidApplication.activityResumedEvent,
    (args) => custHander.onActivityResumed(args));
  application.android.on(application.AndroidApplication.activityPausedEvent,
    (args) => custHander.onActivityPaused(args));

  // Activity result event.
  // Called when an activity you launched (e.g. the QR code reader activity) exits,
  // giving you the requestCode you started it with,
  // the resultCode it returned, and any additional data from it.
  // The resultCode will be RESULT_CANCELED if the activity explicitly returned that,
  // didn't return any result, or crashed during its operation.
  //
  // You will receive this call immediately before onResume() when your activity is re-starting.
  //
  // This method is never invoked if your activity sets noHistory to true.

  application.android.on(application.AndroidApplication.activityResultEvent,
    (args) => custHander.onActivityResult(args));
}

// load the css here so they are available in demo mode
application.loadAppCss();
Application.start().then((navigation) => {
  application.run(navigation);
});
