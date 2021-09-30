//
//  SectionedTableBridge.h
//  SAPMDCFramework
//
//  Created by Erickson, Ronnie on 2/6/17.
//  Copyright © 2017 SAP. All rights reserved.
//

#ifndef SectionedTableBridge_h
#define SectionedTableBridge_h

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class BaseSection;

@interface SectionedTableBridge : NSObject

/**
 Creates a new SectionedTableBridge

 @return SectionedTableBridge UIViewController
 */
-(UIViewController*) create:(NSArray<BaseSection *>*) sections;

@end

#endif /* SectionedTableBridge_h */
