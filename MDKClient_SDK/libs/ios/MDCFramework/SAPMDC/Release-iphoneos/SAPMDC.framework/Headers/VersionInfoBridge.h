//
//  VersionInfoBridge.h
//  SAPMDCFramework
//
//  Copyright © 2017. SAP. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface VersionInfoBridge : NSObject

+(NSString *)getVersionInfo;

+(void)setVersionInfo:(NSString *)buildVersion;

@end
