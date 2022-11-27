const serviceTransformer = (service) => {
  service.image = `${process.env.API_URL + "/uploads/" + service.image}`;
  
  delete service ["dataValues"]["createdAt"]
  delete service ["dataValues"]["updatedAt"]
  
  return service;

 };

var servicesTransformer = function(services) {
return services.map(service => serviceTransformer(service))
}

module.exports = {
 serviceTransformer,
 servicesTransformer
}