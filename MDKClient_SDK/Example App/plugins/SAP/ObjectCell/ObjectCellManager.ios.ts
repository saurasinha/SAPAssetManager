declare var ObjectCellBridge: any;
export class ObjectCell {
    /*
    * Calls native module to create a new Object Cell
    */
    public create() {
        return ObjectCellBridge.new().create();
    }

    /*
    * Calls native module to populate an Object Cell
    *
    * params: object cell property name-value dictionary
    * args: object cell to be updated
    */
    public populate(params, args) {
        let cellKey = 'cell';
        if (!params || !args) {
            throw new Error('ObjectCellManager.ios.populate() invalid parameters');
        }
        params[cellKey] = args;
        ObjectCellBridge.new().populate(params);
    }
};
