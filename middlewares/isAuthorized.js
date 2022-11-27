var isAuthorized = function(req, res, next) {
    if (req.user.type == 'admin' || (req.user.type == 'customer' && req.user.id == req.params.id)) {
        return next()
    }
    res.status(403)
    res.send({
        success: false,
        messages: ['You do not have permission to performmmm this action']
    })
}

module.exports = isAuthorized