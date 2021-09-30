// This file allows to import json files in the app's path
// like so:
//   private static someJSONFile = require('./somewhere/someJSONFile.json');
declare module "*.json" {
    const value: any;
    export default value;
}
