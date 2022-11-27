const addressTransformer = ( address) => {
  delete address ["dataValues"]["createdAt"]
  delete address ["dataValues"]["updatedAt"]
    
    return address;
  };

var addressesTransformer = function(addresses) {
  return addresses.map(address => addressTransformer(address))
}
  
  module.exports = {
    addressTransformer,
    addressesTransformer
  }