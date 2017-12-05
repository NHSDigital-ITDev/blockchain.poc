'use strict';
/**
 * Track the trade of a commodity from one trader to another
 * @param {blockchain.poc.TransferAccess} transferAccess - the trade to be processed
 * @transaction
 */

function transferException(message){
    this.message = message;
    this.name = "transferException";
}
 
function transferAccess(transferAccess) {
    
    // set the new accessor of the record
    transferAccess.record.accessors.push(transferAccess.to);
    return getAssetRegistry('blockchain.poc.Record')
        .then(function (assetRegistry) {

            // check status of accessors
            var proceed = (transferAccess.sender.status == SENDING && transferAccess.receiver.status == RECEIVING);
            if (!proceed) throw new transferException("Transfer unsuccessful. The sending and/or receiving party is in the incorrect state.");
            
            // emit a notification that a trade has occurred
            var transferNotification = getFactory().newEvent('blockchain.poc', 'TransferNotification');
            transferNotification.record = transferAccess.record;
            emit(transferNotification);

            // persist the state of the commodity
            return assetRegistry.update(transferAccess.record);
        });
}