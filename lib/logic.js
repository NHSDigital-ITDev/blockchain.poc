'use strict';

/**
 * @param {blockchain.poc.TransferAccess} transferAccess
 * @transaction
*/
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

            transferAccess.sender.status = CLOSED;
            transferAccess.receiver.status = CLOSED;

            // persist the state of the commodity
            return assetRegistry.update(transferAccess.record);
        });
}

function transferException(message){
    this.message = message;
    this.name = "transferException";
}

/**
 * @param {blockchain.poc.EnableSend} enableSend
 * @transaction
*/
function EnableSend(enableSend){
    enableSend.accessor.accessorStatus = SENDING;

    var enableSendNotification = getFactory().newEvent('blockchain.poc', 'EnableSendNotification');
    enableSendNotification.accessor = enableSend.accessor;
    emit(enableSendNotification);
}

/**
 * @param {blockchain.poc.EnableReceive} enableReceive
 * @transaction 
 */
function EnableReceive(enableReceive){
    enableReceive.accessor.accessorStatus = RECEIVING;

    var enableReceiveNotification = getFactory().newEvent('blockchain.poc', 'EnableReceiveNotification');
    enableReceiveNotification.accessor = enableReceive.accessor;
    emit(enableReceiveNotification);
}

/**
 * @param {blockchain.poc.CloseAccessor} closeAccessor
 * @transaction 
 */
function CloseAccessor(closeAccessor){
    closeAccessor.accessor.accessorStatus = CLOSED;

    var closeAccessorNotification = getFactory().newEvent('blockchain.poc', 'CloseAccessorNotification');
    closeAccessorNotification.accessor = closeAccessor.accessor;
    emit(closeAccessorNotification);
}