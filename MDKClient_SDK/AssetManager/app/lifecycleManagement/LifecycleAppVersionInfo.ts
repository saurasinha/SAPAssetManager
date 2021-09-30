
import * as xml from 'tns-core-modules/xml';
import { Logger } from 'mdk-core/utils/Logger';

export class LifecycleAppVersionInfo {
  private _url: string;
  public get url() {
    return this._url;
  }

  private _revision: number;
  public get revision(): number {
    return this._revision;
  }

  constructor(lcmsVersionXml: string) {
    this.parse(lcmsVersionXml);
  }

  // Very rudimentary parsing looking specfically for the elements:
  //      d:Revision
  //      d:Path
  // If more robust cheking is needed (like path checking), consider using
  //      https://www.npmjs.com/package/nativescript-xmlobjects
  public parse(lcmsVersionXml: string) {
    this._url = undefined;
    this._revision = undefined;
    let currentElementName: string;
    let currentText: string;

    // parse the data
    let xmlParser = new xml.XmlParser( (event: xml.ParserEvent) => {
        switch (event.eventType) {
          case xml.ParserEventType.StartElement:
            currentElementName = event.elementName;
            break;
          case xml.ParserEventType.EndElement:
            if (currentElementName === 'd:Revision') {
                this._revision = Number(currentText);
            } else if (currentElementName === 'd:Path') {
                this._url = currentText;
            }
            currentElementName = undefined;
            currentText = undefined;
            break;
          case xml.ParserEventType.Text:
            currentText = event.data.trim();
            break;
          default:
            Logger.instance.lcms.error(`Invalid event type onXmlEventCallback ${event.eventType}`);
        }
      }, (error: Error) => {
        Logger.instance.lcms.error(`Error parsing XML: ${error}`);
        this._url = undefined;
        this._revision = undefined;
    });
    xmlParser.parse(lcmsVersionXml);
    Logger.instance.lcms.info('LCMS version data parsed');
    Logger.instance.lcms.info(`\tlatest revision: ${this._revision} | url: ${this._url}`);
  }
}
