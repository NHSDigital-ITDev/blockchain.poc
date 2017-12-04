'use strict';
/**
 * Track the trade of a commodity from one trader to another
 * @param {blockchain.poc.TransferAccess} transferAccess - the trade to be processed
 * @transaction
 */
function transferAccess(transferAccess) {
    
    // set the new accessor of the record
    transferAccess.record.accessor = transferAccess.to;
    return getAssetRegistry('blockchain.poc.Record')
        .then(function (assetRegistry) {

            // // emit a notification that a trade has occurred
            // var transferNotification = getFactory().newEvent('blockchain.poc', 'TransferNotification');
            // transferNotification.commodity = trade.commodity;
            // emit(transferNotification);

            // persist the state of the commodity
            return assetRegistry.update(trade.commodity);
        });
}