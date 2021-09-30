  /**
   * Provides an iOS wrapper to SSZipArchive.
   */

  export class Zip {
    public static unzip(source: string, destination: string): boolean {
      return SSZipArchive.unzipFileAtPathToDestination(source, destination);
    }
 }	
