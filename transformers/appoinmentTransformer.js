const appointmentTransformer = (appointment) => {
  
//  delete service ["dataValues"]["createdAt"]
 // delete service ["dataValues"]["updatedAt"]
  
    return appointment;
  };
var appointmentsTransformer = function(appointments) {
  return appointments.map(appointment => appointmentTransformer(appointment))
}

  
  module.exports = {
    appointmentTransformer,
    appointmentsTransformer
  }