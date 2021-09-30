//
//  FormCellItemDelegate.h
//  SAPMDCFramework
//
//  Copyright © 2016 SAP. All rights reserved.
//

#ifndef FormCellItemDelegate_h
#define FormCellItemDelegate_h

#import <UIKit/UIKit.h>

@interface FormCellItemDelegate : NSObject

- (void)loadMoreItems;
- (void)valueChangedWithParams:(NSDictionary<NSString *, NSString *> * _Nonnull)params;
- (void)searchUpdated: (NSString * _Nonnull) searchText;
- (UIView * _Nullable)getView;
- (void)onPress: (NSNumber * _Nullable) cell view:(UIView * _Nullable) view;

@end


#endif /* FormCellItemDelegate_h */
