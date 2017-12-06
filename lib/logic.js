'use strict';

/**
 * @param {blockchain.poc.TransferAccess} transferAccess
 * @transaction
*/
function transferAccess(transferAccess) {
    
    // set the new accessor of the record
    transferAccess.record.accessors.push(transferAccess.receiver);

    // check status of accessors
    var proceed = (transferAccess.sender.accessorStatus == "SENDING" && transferAccess.receiver.accessorStatus == "RECEIVING");
    if (!proceed) throw new transferException("Transfer unsuccessful. The sending and/or receiving party is in the incorrect state.");

    getAssetRegistry('blockchain.poc.Record')
        .then(function (assetRegistry) {
            
            // persist the state of the asset
            assetRegistry.update(transferAccess.record);
        });
    
    // emit a notification that a transfer has occurred
    var transferNotification = getFactory().newEvent('blockchain.poc', 'TransferNotification');
    transferNotification.record = transferAccess.record;
    emit(transferNotification);

    transferAccess.sender.accessorStatus = "CLOSED";
    transferAccess.receiver.accessorStatus = "CLOSED";
        
    getParticipantRegistry('blockchain.poc.Gp')
        .then(function (participantRegistry){
            participantRegistry.update(transferAccess.sender);
            participantRegistry.update(transferAccess.receiver);
        });

    getParticipantRegistry('blockchain.poc.Trust')
        .then(function (participantRegistry){
            participantRegistry.update(transferAccess.sender);
            participantRegistry.update(transferAccess.receiver);
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

    if (enableSend.accessor.accessorStatus == "SENDING") return;
    enableSend.accessor.accessorStatus = "SENDING";

    var enableSendNotification = getFactory().newEvent('blockchain.poc', 'EnableSendNotification');
    enableSendNotification.accessor = enableSend.accessor;
    emit(enableSendNotification);

    getParticipantRegistry('blockchain.poc.Gp')
    .then(function (participantRegistry) {
        return participantRegistry.update(enableSend.accessor);
    });
    
    getParticipantRegistry('blockchain.poc.Trust')
    .then(function (participantRegistry) {
        return participantRegistry.update(enableSend.accessor);
    });
}

/**
 * @param {blockchain.poc.EnableReceive} enableReceive
 * @transaction 
 */
function EnableReceive(enableReceive){
    
    if (enableReceive.accessor.accessorStatus == "RECEIVING") return;
    enableReceive.accessor.accessorStatus = "RECEIVING";
    
    var enableReceiveNotification = getFactory().newEvent('blockchain.poc', 'EnableReceiveNotification');
    enableReceiveNotification.accessor = enableReceive.accessor;
    emit(enableReceiveNotification);

    getParticipantRegistry('blockchain.poc.Gp')
    .then(function (participantRegistry) {
        return participantRegistry.update(enableReceive.accessor);
    });
    
    getParticipantRegistry('blockchain.poc.Trust')
    .then(function (participantRegistry) {
        return participantRegistry.update(enableReceive.accessor);
    });
}

/**
 * @param {blockchain.poc.CloseAccessor} closeAccessor
 * @transaction 
 */
function CloseAccessor(closeAccessor){
    
    if (closeAccessor.accessor.accessorStatus == "CLOSED") return;
    closeAccessor.accessor.accessorStatus = "CLOSED";
    
    var closeAccessorNotification = getFactory().newEvent('blockchain.poc', 'CloseAccessorNotification');
    closeAccessorNotification.accessor = closeAccessor.accessor;
    emit(closeAccessorNotification);

    getParticipantRegistry('blockchain.poc.Gp')
    .then(function (participantRegistry) {
        return participantRegistry.update(closeAccessor.accessor);
    });
    
    getParticipantRegistry('blockchain.poc.Trust')
    .then(function (participantRegistry) {
        return participantRegistry.update(closeAccessor.accessor);
    });
}