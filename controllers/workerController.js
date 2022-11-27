const models = require('../models')
const { validateEmail } = require('../services/validateService')
const authService = require('../services/authService')
const { workerTransformer, workersTransformer } = require('../transformers/workerTransformer')

var store = async function (req, res, next) {
    var result = {
        success: true,
        messages: [],
        data: {}
    }
    var name = req?.body?.name?.trim()
    var email = req?.body?.email?.trim()
    var image = req?.body?.image?.trim()
    var password = req?.body?.password?.trim()
    var passwordConfirmation = req?.body?.passwordConfirmation?.trim()

    if (name.length < 3) {
        result.success = false
        result.messages.push('Please check your name')
    }
    if (!validateEmail(email)) {
        result.success = false
        result.messages.push('Please check your email')
    }
    // if (image.length < 0) {
    //     result.success = false
    //     result.messages.push('Please check your image')
    // }
    
    if (password.length < 6) {
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

    var image = req?.file?.filename
    password = authService.hashPassword(password)
    var [worker, created] = await models.Worker.findOrCreate({
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
        result.messages.push('Worker has been created successfully')
    } else {
        result.success = false
        result.messages.push('You are already registered')
    }
    result.data = workerTransformer(worker)
    res.send(result)
}

var show = async function (req, res, next) {
    var result = {
        success: true,
        data: {},
        messages: []
    }
    var id = req?.params?.id
    var worker = await models.Worker.findByPk(id, {
        include: [
            {
                model: models.Service,
            }
            ]
       
    })
    if (worker) {
        result.data = workerTransformer(worker)
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
    var workers = await models.Worker.findAll({
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        },
        include: [
            {
                model: models.Service,
                include:[{
                    model: models.Worker
                }],
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
            }
            ]
    })
    if (Array.isArray(workers)) {
        result.data = workersTransformer(workers)
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
    var deleted = await models.Worker.destroy({
        where: {
            id: id
        }
    });
    if (deleted) {
        res.status(200)
        result.messages.push('Worker has been deleted')
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
    var id = req.params.id
    const worker = await models.Worker.findOne({
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
    console.log(worker.password, " ###  worker.password  #### ")
    
    if (authService.comparePassword(currentPassword, worker.password)) {
        if (newPassword?.length > 0) {
            if (newPassword.length < 6 || newPassword != newPasswordConfirmation) {
                result.success = false
                result.messages.push('Passwords do not match')
                res.send(result)
                return
            }
            newData.password = authService.hashPassword(newPassword)
        }
        var updatedWorker = await models.Worker.update(newData, {
            where: {
                id
            }
        })
        result.data = workerTransformer(updatedWorker)
        result.messages.push('Worker has been updated successfully')
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
    var loggedWorker = await models.Worker.findOne({
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
    if (loggedWorker) {
        result.data = workerTransformer(loggedWorker),
        result.token = authService.generateToken(loggedWorker.id, 'worker')
    } else {
        result.success = false
        result.messages.push('Wrong email or password')
    }
    res.send(result)
}

const setServices = async (req, res, next) => {
    var result = {
        success: true,
        messages: [],
        data: {},
    }
    const services = req?.body?.services
    if (!Array.isArray(services)) {
        result.status(422)
        result.messages.push('Please provide valid services')
        result.success = false
        return res.send(result)
    }
    const worker = await models.Worker.findByPk(req.params.id)
    if (!worker) {
        result.status(422)
        result.messages.push('Please provide a valid worker ID')
        result.success = false
        return res.send(result)
    }
    await worker.setServices(services);
    return res.send(result)
}
const removeCateogry = async (req, res, next) => {
    worker = models.Worker.findByPk(req.params.id)
}

module.exports = {
    store,
    index,
    show,
    update,
    destroy,
    signIn,
    setServices,
    removeCateogry
}