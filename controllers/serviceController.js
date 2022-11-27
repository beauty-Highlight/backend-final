const { response } = require('express')
const models = require('../models')
const { serviceTransformer, servicesTransformer } = require('../transformers/serviceTransformers')

var store = async function (req, res, next) {
    var result = {
        success: true,
        messages: [],
        data: {}
    }
    var title = req?.body?.title?.trim()
    var price = req?.body?.price?.trim()
    var time = req?.body?.time?.trim()
    var description = req?.body?.description?.trim()
    var image = req?.body?.image
    


    if (title?.length < 0) {
        result.success = false
        result.messages.push('Please check your title')
    }
    if (price?.length < 3) {
        result.success = false
        result.messages.push('Please check your price')
    }
    if (!time || (time % 30 != 0)) {
        result.success = false
        result.messages.push('Please check your time')
    }
    if (description?.length < 0) {
        result.success = false
        result.messages.push('Please check your description')
    }
  
   
    if (!result.success) {
        res.send(result)
        return
    }
    var image = req?.file?.filename
    var newService= await models.Service.create({
        title: title,
        price: price,
        time:time,
        description:description,
        image:image,
    })
    result.data =serviceTransformer(newService)
    result.messages.push('done')
   return res.send(result)
    

}

var show = async function (req, res, next) {
    var result = {
        success: true,
        data: {},
        messages: []
    }
    var id = req?.params?.id
    var service = await models.Service.findByPk(id, 
            {
                attributes: {exclude:["createdAt","updatedAt"]
            },
            // include: [
            //     {
            //         model: models.Worker,
            //     },
            
            //     ] 
    })
    if (service) {
        result.data = serviceTransformer(service)
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
    var services = await models.Service.findAll(
        {
                attributes: {exclude:["createdAt","updatedAt"]
              },
            //   include: [
            //       {
            //           model: models.Worker,
            //       },
            //       ]
    });
    if (Array.isArray(services)) {
        result.data = servicesTransformer(services)
    } else {
        res.status(404)
        res.success = false
        res.messages.push('Please try again later')
    }
     return res.send(result)
}

var destroy = async function (req, res, next) {
    var result = {
        success: true,
        data: {},
        messages: []
    }
    var id = req?.params?.id
    var deleted = await models.Service.destroy({
        where: {
            id: id
        }
    });
    if (deleted) {
        res.status(200)
        result.messages.push('Service has been deleted')
    } else {
        res.status(404)
        result.success = false
        result.messages.push('Please provide a valid ID')
    }
    res.send(result)
}

var update = async function (req, res, next) {
    var response = {
        success: true,
        messages: [],
        data: {}
    }
    var title = req?.body?.title?.trim()
    var price = req?.body?.price?.trim()
    var time = req?.body?.time?.trim()
    var description = req?.body?.description?.trim()
    var image = req?.body?.image?.trim()


    if (title?.length < 6) {
        response.success = false
        response.messages.push('Title is not a valid')
    }
    if (price?.length < 0) {
        response.success = false
        response.messages.push('Price is not a valid')
    }
    if (time?.length < 0) {
        response.success = false
        response.messages.push('Time is not a valid')
    }
    if (description?.length < 0) {
        response.success = false
        response.messages.push('Description is not a valid')
    }
  
  
    if (!response.success) {
        res.send(response)
        return
    }
    var image = req?.file?.filename
    var id = req.params.id
    var updateService = await models.Service.update({
        title: title,
        price: price,
        time: time,
        description: description,
        image: image,

      
    }, {
        where: {
            id
        }
    })
    response.data = updateService
    response.messages.push('done')
    res.send(response)
}
  
const setWorkers = async (req, res, next) => {
    var result = {
        success: true,
        messages: [],
        data: {},
    }
    const workers = req?.body?.workers
    if (!Array.isArray(workers)) {
        result.status(422)
        result.messages.push('Please provide valid workers')
        result.success = false
        return res.send(result)
    }
    const service = await models.Service.findByPk(req.params.id)
    if (!service) {
        result.status(422)
        result.messages.push('Please provide a valid service ID')
        result.success = false
        return res.send(result)
    }
    await service.setWorkers(workers);
    return res.send(result)
}

module.exports = {
    store,
    index,
    show,
    update,
    destroy,
    setWorkers
}