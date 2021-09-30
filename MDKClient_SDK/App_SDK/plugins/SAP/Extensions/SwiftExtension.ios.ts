declare var SwiftExtensionBridge: any;

import { SwiftExtensionDelegate } from './SwiftExtensionDelegate';

export class SwiftExtension {

    protected _delegate: any;

    /**
     * Create the native control
     * @param className - The name of the class to be created
     * @param params - Parameters for initialization
     * @param extension - typescript extension control containing native extension
     */
    public create(className, params, extension): any {
      extension.bridge = SwiftExtensionBridge.new();
      this._delegate = SwiftExtensionDelegate.initWithBridge(extension.bridge, extension);
      extension.bridge.createWithParamsAndDelegate(className, params, this._delegate);
      return extension.bridge.extension;
    }

    /**
     * Simple getter for the delegate
     */
    public getDelegate(): any {
      return this._delegate;
    }

    /**
     * Simple setter for the delegate
     * @param delegate 
     */
    public setDelegate(delegate) {
      this._delegate = delegate;
    }

}
