import * as fs from 'tns-core-modules/file-system';
export class Paths {

  // Retrieve the user accessible path for overrides
  public static getOverridePath(): string {
    return Paths.getDocumentsPath();
  }

  // Retrieve the user accessible save location for 'SavedSettings'
  public static getSavedSettingsPath(): string {
    return Paths.getDocumentsPath();
  }

  private static getDocumentsPath(): string {
    return fs.knownFolders.documents().path;
  }
}
