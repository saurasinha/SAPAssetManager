#!/usr/bin/env node
const path = require('path');
const toolUtils = require('../tool-utils');
const isDirectory = toolUtils.isDirectory;
const exec = toolUtils.exec;
const CreateClient = require('./create-client').CreateClient;
const shelljs = require('shelljs');

class CreateClientDev extends CreateClient {
  constructor() {
    super();
    this.sConfiguration = 'Debug';
    // No default mdkproject.
    this.sTemplateProjectPath = undefined;
    this.sOutDir = path.resolve('.');
    this.bCopyAndroidFioriLibs = false;
    this.bForce = true;
  }
  validateMDKProjectJSON() {
    super.validateMDKProjectJSON();
    // TODO: Use an absolute path for this.
    this.sAppName = '.';
    this.sAppPath = path.resolve('.');
    // Always use this bundle ID for dev builds. Note: If this
    // changes, we need to change how the entitlements file
    // is modified so that it can change again after the
    /// template is modified.
    this.sBundleID = 'com.sap.mobile.platform.SnowblindClient';
    this.aPluginsToSkip =
      ['MockDataPlugin', 'SAP', 'tests', 'toolbar-plugin', 'zip-plugin'];
  }
  
  createProject() {
    // Used to execute commands in the project directory
    this.oExecInProject = {
      cwd: this.sAppPath,
    };

    // Don't create a new project.
    console.log('Copying branded settings');
    exec(`cp "${this.sBrandedSettingsFile}" "${this.sAppPath}/app/branding/BrandedSettings.json"`,
         'Failed to copy branded settings');
    this.copyDemoFiles();
    this.populateTemplateFiles();
    this.updateSDKFiles();
    // Do not perform npm i at the end
  }

  appNameCondensed() {
    return 'SnowblindClientApplication';
  }

  copyLoaders() {
    // skip this step
  }

  prepare() {
    // Delete the build directory if it exists.
    // This helps prevent build issues that happen
    // when adding and removing frameworks that go with extensions.
    const sBuildDir = `${this.sAppPath}/platforms/ios/build`;
    if (isDirectory(sBuildDir)) {
      console.log(`Deleting build directory ${sBuildDir}`);
      exec(`rm -rf "${sBuildDir}"`);
    }
    super.prepare();
    if (this.sSdk === 'iphonesimulator') {
      console.log('Running tns build step');
      exec('tns build ios',
           'Failed to run tns build', this.oExecInProject);
    }
  }

  printNextSteps() {
    if (this.sSdk === 'iphonesimulator') {
      console.log('You can now run the app with tns run or debug with Xcode or Visual Studio Code.');
    } else {
      console.log('You can now run the app with tns run or debug with Visual Studio Code. To debug with Xcode, first run tns build ios --for-device.');
    }
  }

  updateInfoPlist() {
    // skip this step
  }
}

if (require.main === module) {
  const c = new CreateClientDev();
  return c.create();
}
