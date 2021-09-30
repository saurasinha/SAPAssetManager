import queryOptions from './WorkOrderOperationsListViewQueryOption';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import IsOperationLevelAssigmentType from './IsOperationLevelAssigmentType';
import libSuper from '../../Supervisor/SupervisorLibrary';

export default function WorkOrderOperationListViewSetCaption(context) {

    var entitySet;
    var queryOption;
    var localizeText;
    var localizeText_x_x;

    var parameters = CommonLibrary.getStateVariable(context,'OPERATIONS_FILTER');
    if (!libVal.evalIsEmpty(parameters)) {
        entitySet = parameters.entity;
        queryOption = parameters.query;
        localizeText = parameters.localizeTextX;
        localizeText_x_x = parameters.localizeTextXX;
    } else {
        if (CommonLibrary.isDefined(context.binding['@odata.type'])) {
            switch (context.binding['@odata.type']) {
                case '#sap_mobile.MyWorkOrderHeader':
                    entitySet = context.binding['@odata.readLink'] + '/Operations';
                    queryOption = queryOptions(context);
                    localizeText = 'operations_x';
                    localizeText_x_x = 'operations_x_x';
                    break;
                default:
                    break;
            }
        } else {
            entitySet = 'MyWorkOrderOperations';
            localizeText = 'operations_x';
            localizeText_x_x = 'operations_x_x';
            if ((libSuper.isSupervisorFeatureEnabled(context)) && CommonLibrary.isDefined(context.binding.isSupervisorOperationsList)) {
                queryOption = libSuper.getFilterForOperationPendingReview(context, false);
            } else if ((libSuper.isSupervisorFeatureEnabled(context)) && CommonLibrary.isDefined(context.binding.isTechnicianOperationsList)) {
                queryOption = libSuper.getFilterForSubmittedOperation(context, false);
            } else if (IsOperationLevelAssigmentType(context)) {
                queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
            } else if (CommonLibrary.getWorkOrderAssignmentType(context) === '3') {
                entitySet = 'MyWorkOrderSubOperations';
                queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
                localizeText = 'suboperations_x';
                localizeText_x_x = 'suboperations_x_x';
            }
        }
    }

    var params = [];
    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service',entitySet, '');
    let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service',entitySet,queryOption);

    return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
        let totalCount = resultsArray[0];
        let count = resultsArray[1];
        params.push(count);
        params.push(totalCount);
        if (count === totalCount) {
            return context.setCaption(context.localizeText(localizeText, [totalCount]));
        }
        return context.setCaption(context.localizeText(localizeText_x_x, params));
    });
}
