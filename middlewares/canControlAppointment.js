const models = require('../models')
const canControlAppointment = (req, res, next) => {
    const apointmentId = req.params.id
    const appointment = models.Appointment.findByPk(apointmentId)
    if (req.user.type == 'admin' || (req.user.type == 'customer' && req.user.id == appointment.customerId)) {
        return next()
    }
    res.status(403)
    res.send({
        success: false,
        messagrs: ['You are not allowed to do so']
    })
}

module.exports = canControlAppointment