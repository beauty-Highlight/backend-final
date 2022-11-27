const { response } = require('express')
const models = require('../models')
const { reviewTransformer, reviewsTransformer } = require('../transformers/reviewTransformers')

var store = async function (req, res, next) {
    var result = {
        success: true,
        messages: [],
        data: {}
    }
    var id = req?.user?.id

    var content = req?.body?.content?.trim()
    var stars = req?.body?.stars?.trim()
    var customerId = id

    if (content?.length < 6) {
        result.success = false
        result.messages.push('Please check your content')
        return res.send(result)
    }
    if (!stars) {
        result.success = false
        result.messages.push('Please check your stars')
        return res.send(result)
    }
    if (customerId < 0) {
        result.success = false
        result.messages.push('Please check your customerId')
        return res.send(result)
    }
   
    if (!result.success) {
        res.send(response)
        return
    }
    
    var newReview= await models.Review.create({
        content,
        stars,
        customerId
    })
    result.data = newReview
    result.messages.push('done')
   return res.send(result)
    

}

var show = async function (req, res, next) {
    var result = {
        success: true,
        data: {},
        messages: []
    }

    const where = {}

    if (req?.user?.type == 'customer') {
        where.customerId = req.user.id
    }

    var review = await models.Review.findAll(
        {
            where: where,
            attributes: {exclude:["createdAt","updatedAt"]
        },
        include: [
            {
                model: models.Customer,
            },
        
            ]
    })
    if (review) {
        result.data = review
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
    var reviews = await models.Review.findAll(
        {
          attributes: {exclude:["createdAt","updatedAt"]
        },
        include: [
            {
                model: models.Customer,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
            },
            ]
    })
    if (Array.isArray(reviews)) {
        result.data = (reviews)
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
    var deleted = await models.Review.destroy({
        where: {
            id: id
        }
    });
    if (deleted) {
        res.status(200)
        result.messages.push('Review has been deleted')
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
    var content = req?.body?.content?.trim()
    var stars = req?.body?.stars?.trim()


    if (content?.length < 6) {
        response.success = false
        response.messages.push('Content is not a valid')
    }
    if (stars?.length < 0) {
        response.success = false
        response.messages.push('Stars is not a valid')
    }
  
    if (!response.success) {
        res.send(response)
        return
    }
    var id = req.params.id
    var updateReview = await models.Review.update({
        content: content,
        stars: stars,
      
    }, {
        where: {
            id
        }
    })
    response.data = updateReview
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