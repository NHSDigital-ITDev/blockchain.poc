/**
 * Transfer transaction processor function.
 * @param {blockchain.poc.TransferAccess} transferAccess The TransferAccess instance.
 * @transaction
 */
function transferTransaction(transferAccess) {
  
      var newAcessor = transferAccess.accessorReceiver
      transferAccess.record.accesors.Add(newAcessor);
      
      return getAssetRegistry('blockchain.poc.TransferAccess')
      .then(function (assetRegistry) {

          // Update the asset in the asset registry.
          return assetRegistry.update(transferAccess.accesors);

      });

  }
  