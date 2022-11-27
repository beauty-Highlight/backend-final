const isCustomer = (req, res, next) => {
    if (req.user.type == 'customer') {
        return next()
    }
    res.status(403)
    res.send({
        success: false,
        messagrs: ['You are not allowed to do so']
    })
}

module.exports = isCustomer