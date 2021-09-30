interface IAttachment {
  /**
   * content is a byte array provided by the native platform
   */
  content: string;
  /**
   * content type is a string representing the mimeType of the content
   */
  contentType: string;
  /**
   * nativeAttachment is the platform specific data provided for backwards compatibility
   * each nativeAttachment has a duplicate set of properties as IAttachment but must be
   * accessed via the native API.  This is a temporary property intended to assist in
   * application upgrading  but will be deprecated in a future release.
   * Android JSONObject
   * iOS - NSDictionaryorm
   */
  nativeAttachment: any;
  /**
   * OData readLink - set for persisted attachments
   */
  readLink: string;
  /**
   * platform specific url string
   */
  urlString: string;
}
