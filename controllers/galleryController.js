const { response } = require('express')
const models = require('../models')
const { galleryTransformer, galleriesTransformer } = require('../transformers/galleryTransformers')

var store = async function (req, res, next) {
    var result = {
        success: true,
        messages: [],
        data: {}
    }
    var title = req?.body?.title?.trim()
    var file = req?.body?.file

    if (title?.length < 0) {
        result.success = false
        result.messages.push('Please check your title')
    }
   
   
    if (!result.success) {
        result.send(response)
        return
    }
    var file = req?.file?.filename
    var newGallery= await models.Gallery.create({
        title: title,
        file: file,
    })
    result.data = galleryTransformer(newGallery)
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
    var gallery = await models.Gallery.findByPk(id, {
        attributes: {exclude:["createdAt","updatedAt"]
              },
    })
    if (gallery) {
        result.data = galleryTransformer(gallery)
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
    var galleries = await models.Gallery.findAll()
    if (Array.isArray(galleries)) {
        result.data = galleriesTransformer(galleries)
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
    var deleted = await models.Gallery.destroy({
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
    var file = req?.body?.file?.trim()

  
    if (title.length < 4) {
        response.success = false
        response.messages.push('Title is not a valid')
    }
    
  
    if (!response.success) {
        res.send(response)
        return
    }
    var file = req?.file?.filename
    var id = req.params.id
    var updateGallery = await models.Gallery.update({
        title: title,
        file: file,

      
    }, {
        where: {
            id
        }
    })
    response.data = updateGallery
    response.messages.push('done')
    res.send(response)
}
  


module.exports = {
    store,
    index,
    show,
    update,
    destroy,
}