const models = require('../models')
const { validateEmail } = require('../services/validateService')
const authService = require('../services/authService')
const { customersTransformer, customerTransformer } = require('../transformers/customerTtansformers')
const { response } = require('../app')

var store = async function (req, res, next) {
    var result = {
        success: true,
        messages: [],
        data: {}
    }
    var name = req?.body?.name?.trim()
    var email = req?.body?.email?.trim()
    var password = req?.body?.password?.trim()

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

    if (!result.success) {
        res.send(result)
        return
    }
    var image = req?.file?.filename
    password = authService.hashPassword(password)
    var [customer, created] = await models.Customer.findOrCreate({
        where: {
            email: email
        },
        defaults: {
            name: name,
            image: image,
            password: password
        }
    })
    if (created) {
        result.messages.push('customer has been created successfully')
    } else {
        result.success = false
        result.messages.push('You are already registered')
    }
    result.data = customerTransformer(customer)
    res.send(result)
}

var profile = async function (req, res, next) {
    var result = {
        success: true,
        data: {},
        messages: []
    }
    var usrtId = req.user.id
    var customer = await models.Customer.findByPk(usrtId, {

    })
    if (customer) {
        result.data = customerTransformer(customer)
    } else {
        res.status(404)
        result.success = false
        result.messages.push('Please log in to your profile')
    }
    res.send(result)
}

var show = async function (req, res, next) {
    var result = {
        success: true,
        data: {},
        messages: []
    }
    var id = req.params.id
    var customer = await models.Customer.findByPk(id, {

    })
    if (customer) {
        result.data = customerTransformer(customer)
    } else {
        res.status(404)
        result.success = false
        result.messages.push('Please provide a valid ID')
    }
    res.send(result)
}

var index = async function (req, res, next) {
    var result = {
        success: true,
        data: {},
        messages: []
    }

    var customers = await models.Customer.findAll({
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        },
        where: {
            deletedAt: null
        }
        
    }
    )
    if (Array.isArray(customers)) {
        result.data =customersTransformer(customers)
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
    var id = req.params.id
    var deleted = await models.Customer.destroy({
        where: {
            id: id
        }
    });
    if (deleted) {
        res.status(200)
        result.messages.push('Customer has been deleted')
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
    var image = req?.file?.filename
    var id = req.user.id
    const customer = await models.Customer.findOne({
        where: {
            id
        }
    })

    var newData = {
        name: name,
        email: email,
        image:image
    }
    console.log(currentPassword, " ****  currentPassword  **** ")
    console.log(customer.password, " ###  customer.password  #### ")
    
    if (authService.comparePassword(currentPassword, customer.password)) {
        if (newPassword?.length > 0) {
            if (newPassword.length < 6 || newPassword != newPasswordConfirmation) {
                result.success = false
                result.messages.push('Passwords do not match')
                res.send(result)
                return
            }
            newData.password = authService.hashPassword(newPassword)
        }
        var updated = await models.Customer.update(newData, {
            where: {
                id
            }
        })
        result.data = customerTransformer(updated)
        result.messages.push('Customer has been updated successfully')
    } else {
        result.success = false
        result.messages.push('You provided a wrong password')
        
    }

    res.send(result)
    return

}

var login = async function (req, res, next) {
    var result = {
        success: true,
        messages: [],
        data: {},
        token: null
    }
    var email = req.body.email?.trim()
    var password = req.body.password?.trim()
    var loggedCustomer = await models.Customer.findOne({
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        },
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
    if (loggedCustomer) {
        result.data = customerTransformer(loggedCustomer)
        result.token = authService.generateToken(loggedCustomer.id, 'customer')
    } else {
        result.success = false
        result.messages.push('Wrong email or password')
    }
    res.send(result)
}



module.exports = {
    store,
    show,
    index,
    destroy,
    update,
    login,
    profile,
}