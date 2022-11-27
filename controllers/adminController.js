const models = require('../models')
const { validateEmail } = require('../services/validateService')
const authService = require('../services/authService')
const { adminTransformer, adminsTransformer } = require('../transformers/adminTransformers')

var store = async function (req, res, next) {
    var result = {
        success: true,
        messages: [],
        data: {}
    }
    var name = req?.body?.name?.trim()
    var email = req?.body?.email?.trim()
    var password = req?.body?.password?.trim()
    var passwordConfirmation = req?.body?.passwordConfirmation?.trim()

    if (name?.length < 3) {
        result.success = false
        result.messages.push('Please check your name')
    }
    if (!validateEmail(email)) {
        result.success = false
        result.messages.push('Please check your email')
    }
    if (password?.length < 6) {
        result.success = false
        result.messages.push('Please check your password')
    }
    if (password != passwordConfirmation) {
        result.success = false
        result.messages.push('Passwords do not match')
    }
    if (!result.success) {
        res.send(result)
        return
    }
    password = authService.hashPassword(password)
    var [admin, created] = await models.Admin.findOrCreate({
        where: {
            email: email
        },
        defaults: {
            name: name,
            password: password
        }
    })
    if (created) {
        result.messages.push('Admin has been created successfully')
    } else {
        result.success = false
        result.messages.push('You are already registered')
    }
    result.data = adminTransformer(admin)
    res.send(result)
}

// var show = async function (req, res, next) {
//     var result = {
//         success: true,
//         data: {},
//         messages: []
//     }
//     var id = req?.params?.id
//     var admin = await models.Admin.findByPk(id, {
   
//     })
//     if (admin) {
//         result.data = adminTransformer(admin)
//     } else {
//         res.status(404)
//         result.success = false
//         result.messages.push('Please provide a valid ID')
//     }
//     res.send(result)
// }

var index = async function (req, res, next) {
    var result = {
        success: true,
        data: {},
        messages: []
    }
    var admins = await models.Admin.findAll()
    if (Array.isArray(admins)) {
        result.data = adminsTransformer(admins)
    } else {
        res.status(404)
        res.success = false
        res.messages.push('Please try again later')
    }
    res.send(result)
}

var destroy = async function (req, res, next) {
    var result = {
        success: true,
        data: {},
        messages: []
    }
    var id = req?.params?.id
    var deleted = await models.Admin.destroy({
        where: {
            id: id
        }
    });
    if (deleted) {
        res.status(200)
        result.messages.push('Admin has been deleted')
    } else {
        res.status(404)
        result.success = false
        result.messages.push('Please provide a valid ID')
    }
    res.send(result)
}

var update = async function (req, res, next) {
    var result = {
        success: true,
        messages: [],
        data: {}
    }
    var name = req?.body?.name?.trim()
    var email = req?.body?.email?.trim()
    var currentPassword = req?.body?.currentPassword?.trim()
    var newPassword = req?.body?.newPassword?.trim()
    var newPasswordConfirmation = req?.body?.newPasswordConfirmation?.trim()
    
    if (name?.length < 3) {
        result.success = false
        result.messages.push('Please check your name')
    }
    if (!validateEmail(email)) {
        result.success = false
        result.messages.push('Please check your email')
    }
    if (!result.success) {
        res.send(result)
        return
    }
    var id = req.params.id

    const admin = await models.Admin.findOne({
        where: {
            id
        }
    })

    var newData = {
        name: name,
        email: email
    }

    if (authService.comparePassword(currentPassword, admin.password)) {
        if (newPassword.length > 0) {
            if (newPassword.length < 6 || newPassword != newPasswordConfirmation) {
                result.success = false
                result.messages.push('Passwords do not match')
                res.send(result)
                return
            }
            newData.password = authService.hashPassword(newPassword)
        }
        var updatedAdmin = await models.Admin.update(newData, {
            where: {
                id
            }
        })
        result.data = adminTransformer(updatedAdmin)
        result.messages.push('Admin has been updated successfully')
    } else {
        result.success = false
        result.messages.push('You provided a wrong password')
    }
    res.send(result)
    return
}

const signIn = async (req, res, next) => {
    var result = {
        success: true,
        messages: [],
        data: {},
        token: null
    }
    var email = req?.body?.email?.trim()
    var password = req?.body?.password?.trim()
    var loggedAdmin = await models.Admin.findOne({
        where: {
            email: email,
        }
    }).then((user) => {
        if (!user) {
            return false
        } else {
            if (authService.comparePassword(password, user.password)) {
                return user
            } else {
                return false
            }
        }
    })
    if (loggedAdmin) {
        result.data = adminTransformer(loggedAdmin),
        result.token = authService.generateToken(loggedAdmin.id, 'admin')
    } else {
        result.success = false
        result.messages.push('Wrong email or password')
    }
    res.send(result)
}

module.exports = {
    store,
    index,
    // show,
    update,
    destroy,
    signIn
}