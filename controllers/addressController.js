const { response } = require('express')
const models = require('../models')
const { addressTransformer, addressesTransformer } = require('../transformers/addressTransformers')

var store = async function (req, res, next) {
    var result = {
        success: true,
        messages: [],
        data: {}
    }

    var customerId = req?.user?.id
    var city = req?.body?.city?.trim()
    var street = req?.body?.street?.trim()
    var building = req?.body?.building?.trim()
    var apartment = req?.body?.apartment?.trim()
    var phone = req?.body?.phone?.trim()
    var note = req?.body?.note?.trim()

    // if (customerId.length < 0) {
    //     result.success = false
    //     result.messages.push('Please check your customerId')
    // }
    
    if (city.length < 2) {
        result.success = false
        result.messages.push('Please check your city')
    }
    if (street.length < 3) {
        result.success = false
        result.messages.push('Please check your street')
    }
    if (building.length < 0) {
        result.success = false
        result.messages.push('Please check your building')
    }
    if (apartment.length < 0) {
        result.success = false
        result.messages.push('Please check your apartment')
    }
    if (phone.length < 8) {
        result.success = false
        result.messages.push('Please check your phone')
    }
    if (note.length < 5) {
        result.success = false
        result.messages.push('Please check your note')
    }
   
    if (!result.success) {
        result.send(response)
        return
    }
    
    var newAddress= await models.Address.create({
        customerId:customerId,
        city: city,
        street: street,
        building:building,
        apartment:apartment,
        phone:phone,
        note:note,
    })
    result.data =addressTransformer(newAddress)
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
    var address = await models.Address.findByPk(id,
        {
            attributes: {exclude:["createdAt","updatedAt"]
        },
        include: [
            {
                model: models.Customer,
            },
        
            ] 
      
    })
    if (address) {
        result.data = (address)
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
    var addresses = await models.Address.findAll(
        {
            attributes: {exclude:["createdAt","updatedAt"]
          },
          include: [
              {
                  model: models.Customer,
              },
              ]
    });
    if (Array.isArray(addresses)) {
        result.data = (addresses)
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
    var deleted = await models.Address.destroy({
        where: {
            id: id
        }
    });
    if (deleted) {
        res.status(200)
        result.messages.push('Address has been deleted')
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
    var city = req?.body?.city?.trim()
    var street = req?.body?.street?.trim()
    var building = req?.body?.building?.trim()
    var apartment = req?.body?.apartment?.trim()
    var phone = req?.body?.phone?.trim()
    var note = req?.body?.note?.trim()


    if (city?.length < 6) {
        response.success = false
        response.messages.push('City is not a valid')
    }
    if (street?.length < 0) {
        response.success = false
        response.messages.push('Street is not a valid')
    }
    if (building?.length < 0) {
        response.success = false
        response.messages.push('Building is not a valid')
    }
    if (apartment?.length < 0) {
        response.success = false
        response.messages.push('Apartment is not a valid')
    }
    if (phone?.length < 0) {
        response.success = false
        response.messages.push('Phone is not a valid')
    }
    if (note?.length < 0) {
        response.success = false
        response.messages.push('Note is not a valid')
    }
  
    if (!response.success) {
        res.send(response)
        return
    }
    var id = req.params.id
    var updateAddress = await models.Address.update({
        city: city,
        street: street,
        building: building,
        apartment: apartment,
        phone: phone,
        note: note,

      
    }, {
        where: {
            id
        }
    })
    response.data = updateAddress
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