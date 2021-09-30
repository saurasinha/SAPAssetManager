const os = require("os");
const program = require('commander');
const toolUtils = require('../tool-utils');
const chalk = require('chalk');
const fail = toolUtils.fail;

class CreateClientBase {
  
  constructor() {
    this.isMac = (os.type() === "Darwin");
    this.isAppUpdate = false;
    let argvCommand = program
      .version('1.0.0')
      .option('-m, --mdkproject <dir-path>', 'path to .mdkproject directory')
      .option('-u, --update', 'update an existing client project')
      .option('--debug', 'build project using debug mode')
      .option('-o, --outdir <dir-path>', 'path to store the generated project; if it is not specified, using the current directory')
      .option('-f, --force', 'remove existing application directory without prompting')
      .option('-v, --verbose', 'show more log output');

    if (this.isMac) {
      argvCommand
        .option('-s, --simulator', 'create client for simulator of iOS')
        .option('-d, --device', 'create client for device of iOS')
        .option('--all', 'create client for all (iOS & Android)')
        .option('--ios', 'create client for iOS')
        .option('--android', 'create client for Android');
    }

    argvCommand.parse(process.argv);
  }

  create() {
    this.getMDKProjectPath()
    .then(() => {
      return this.getOutDir();
    })
    .then(() => {
      this.parseMDKProjectJSON();
      this.validateMDKProjectJSON();
      if (this.isAppPathExists()) {
        if (program.update) {
          this.getInstalledPlatforms();
          if (this.ios || this.android) {
            this.isAppUpdate = true;
          }
        }

        if (!this.bForce && !program.force) {
          if (this.isAppUpdate) {
            return this.getConfirmRemoveUpdateFolders();
          } else {
            return this.getConfirmRemoveAppFolder();
          }
        }
      }
    })
    .then(() => {
      if (!this.isAppUpdate) {
        return this.getPlatforms();
      }
    })
    .then(() => {
      if (!this.isAppUpdate && this.ios) {
        return this.getSimOrDevice();
      }
    })
    .then(() => {
      this.parseBrandedSettingsJSON();
      if (this.isAppUpdate) {
        this.copyBrandedSettings();
        this.installNSPlugins();
      } else {
        this.createProject();
        this.installNSPlugins();
        this.installMDKCore();
      }
      this.populateTemplateFiles();
      this.copyAppResources();
      this.mergeAppResources();
      return this.addMetadata();
    })
    .then(() =>{
      this.addDemoMetadata();
    })
    .then(() => {
      return this.addPlugins();
    })
    .then(() => {
      return this.prepare_i18n();
    })
    .then(() => {
      return this.addFonts();
    })
    .then(() => {
      this.prepare();
      if (!this.isAppUpdate) {
        console.log(chalk.green('Application ready.'));
      } else {
        console.log(chalk.green('Application updated.'));
      }
      this.printNextSteps();
    })
    .catch(e => {
      fail(e);
    });
  }

}

exports.CreateClientBase = CreateClientBase;
