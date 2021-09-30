//
//  SectionBridge.h
//  SAPMDCFramework
//
//  Created by Erickson, Ronnie on 2/6/17.
//  Copyright © 2017 SAP. All rights reserved.
//

#ifndef SectionBridge_h
#define SectionBridge_h

#import <Foundation/Foundation.h>
#import "SectionDelegate.h"
#import "FormCellItemDelegate.h"

@class BaseSection;

@interface SectionBridge : NSObject

@property (nonatomic, strong) BaseSection* section;

/**
 * Creates a new Section and returns the SectionBridge
 *
 * @return SectionBridge
 */
-(NSObject*) create:(NSDictionary*)params callback:(SectionDelegate*)callback;

-(void) setIndicatorState:(NSDictionary*)params;

/**
 * Called to refresh indicators.  Fiori indicators don't maintain their state after
 * page navigation.
 */
-(void) refreshIndicators;

/**
 * Called to redraw the section
 */
-(void) redraw:(NSDictionary*)data;

/**
 * Called to reload the data for the section
 */
-(void) reloadData:(NSNumber*)itemCount;

/**
 * Called to redraw a row
 */
-(void) reloadRow:(NSNumber*)index;

-(void) updateRow:(NSNumber*)index data:(NSDictionary*)data;
 
-(void) setFormCellSectionItem:(NSDictionary*)params callback:(FormCellItemDelegate*)callback;

-(void) updateCell:(NSDictionary*)params row:(NSNumber*)row;

-(void) updateCells:(NSArray*)params;

-(void) setFocus:(NSNumber*)row;

-(void) hideLazyLoadingIndicator:(NSNumber*)row;

-(void) setSelectionMode:(NSDictionary*)params;

@end

#endif /* SectionBridge_h */
