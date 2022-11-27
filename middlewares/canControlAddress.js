const models = require('../models')
const canControlAddress = (req, res, next) => {
    const addressId = req.params.id
    const address = models.Address.findByPk(addressId)
    if (req.user.type == 'admin' || (req.user.type == 'customer' && req.user.id == address.customerId)) {
        return next()
    }
    res.status(403)
    res.send({
        success: false,
        messagrs: ['You are not allowed to do so']
    })
}

module.exports = canControlAddress