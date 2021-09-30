//
//  SectionDelegate.h
//  SAPMDCFramework
//
//  Created by Erickson, Ronnie on 2/14/17.
//  Copyright © 2017 SAP. All rights reserved.
//

#ifndef SectionDelegate_h
#define SectionDelegate_h

#import <UIKit/UIKit.h>

@interface SectionDelegate : NSObject

- (void)footerTapped;
- (UIView *)getView: (NSNumber*) row;
- (void)onPress: (NSNumber*) cell view:(UIView*) view;
- (void)onAnalyticViewPress;
- (void)onItemPress: (NSNumber*) item;
- (void)searchUpdated: (NSString*) searchText;
- (void)viewDidAppear;

@end


#endif /* SectionDelegate_h */
