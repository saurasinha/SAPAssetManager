  /**
   * Provides an android wrapper to zip4j
   */
  declare var net;
  export class Zip {
    public static unzip(source: string, destination: string) {
      const zipFile = new net.lingala.zip4j.core.ZipFile(source);
      zipFile.extractAll(destination);
    }
  }		
