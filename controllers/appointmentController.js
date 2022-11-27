const { response } = require('express')
const models = require('../models')
const { Op, where } = require("sequelize");
const dayjs = require('dayjs')
const { appointmentTransformer, appointmentsTransformer } = require('../transformers/appoinmentTransformer')

var store = async function (req, res, next) {
    var result = {
        success: true,
        messages: [],
        data: {}
    }
    var userId = req?.user?.id
    
    var datetime = req?.body?.datetime
    var isHome = (req?.body?.isHome === 'true')
    var note = req?.body?.note?.trim()
    // var total = req?.body?.total?.trim()
    var serviceId = req?.body?.serviceId
    var workerId = req?.body?.workerId
    var customerId = userId
    var addressId = req?.body?.addressId
    const d = new Date();
    const currentDate = dayjs(d).add(0, 'day').format('YYYY-MM-DDTHH:mm:ss')

    console.log("currentDate--->",currentDate) 
    const oppintmentDate = dayjs(datetime).add(0, 'day').format('YYYY-MM-DDTHH:mm:ss')
    console.log("DateTime 2:---->", oppintmentDate)
    // console.log("Compare Date",currentDate.getTime() === oppintmentDate.getTime())
    const compareDates = (d1, d2) => {
        let date1 = new Date(d1).getTime();
        let date2 = new Date(d2).getTime();
      
        if (date1 < date2) {
          console.log(`${d1} is less than ${d2}`);
          return true
        } else {
          console.log(`Both dates are equal`);
          return false
        }
      };
      
    const checkDate = compareDates(currentDate, oppintmentDate )
    console.log("checkDate", checkDate);

    if (!checkDate ) {
        result.success = false
        result.messages.push('Please check your datetime')
    }
    if (serviceId < 1) {
        result.success = false
        result.messages.push('Please check your serviceId')
    }
    if (workerId < 1) {
        result.success = false
        result.messages.push('Please check your workerId')
    }

    var total = 0
    const service = await models.Service.findByPk(serviceId)
    if (!service) {
        result.success = false
        result.messages.push('Please check your serviceId')
    }

    if (!result.success) {
        res.send(result)
        return
    }
    console.log(service)
    total = service.price
    console.log(isHome)
    if (isHome) {
        total *= 2
    }
    

    var [newAppointment, created] = await models.Appointment.findOrCreate({
        where:{
            datetime:oppintmentDate,
            serviceId
        },
        defaults:{
        datetime:oppintmentDate,
        isHome,
        note,
        total,
        serviceId,
        workerId,
        customerId,
        addressId
        }
    })
    if(created){
        result.data = appointmentTransformer (newAppointment)
        result.messages.push('done')
    }else{
        result.success = false
        result.messages.push('it is not free')
    }
    return res.send(result)
}

var show = async function (req, res, next) {
    var result = {
        success: true,
        data: {},
        messages: []
    }
    var id = req?.params?.id
    var appointment = await models.Appointment.findByPk(id,
        {
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            include: [
                {
                    model: models.Address,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                },
                {
                    model: models.Service,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                },
                {
                    model: models.Worker,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                },
                {
                    model: models.Customer,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                },
            ]

        });
    if (appointment) {
        result.data = (appointment)
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
    const where = {}
    if (req.user.type == 'customer') {
        where.customerId = req.user.id
    } else if (req.user.type == 'worker') {
        where.workerId = req.user.id
    }
    var appointments = await models.Appointment.findAll(
        {
            where: where,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            include: [
                {
                    model: models.Address,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                },
                {
                    model: models.Service,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                },
                {
                    model: models.Worker,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                },
                {
                    model: models.Customer,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                }
            ]
        })
    if (Array.isArray(appointments)) {
        result.data = (appointments)
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
    var deleted = await models.Appointment.destroy({
        where: {
            id: id
        }
    });
    if (deleted) {
        res.status(200)
        result.messages.push('Appointment has been deleted')
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
    var datetime = req?.body?.datetime?.trim()
    var isHome = req?.body?.isHome?.trim()
    var note = req?.body?.note?.trim()
    var total = req?.body?.total?.trim()
    var serviceId = req?.body?.serviceId
    var workerId = req?.body?.workerId
    var addressId = req?.body?.addressId

    if (datetime.length < 3) {
        response.success = false
        response.messages.push('Name is not a valid')
    }
    if (isHome.length < 3) {
        response.success = false
        response.messages.push('isHome is not a valid')
    }
    if (note.length < 3) {
        response.success = false
        response.messages.push('note is not true')
    }
    if (total.length < 0) {
        response.success = false
        response.messages.push('total is not true')
    }
    if (serviceId < 0) {
        result.success = false
        result.messages.push('Please check your serviceId')
    }
    if (workerId < 0) {
        result.success = false
        result.messages.push('Please check your workerId')
    }
    if (addressId < 0) {
        result.success = false
        result.messages.push('Please check your addressId')
    }
    if (!response.success) {
        res.send(response)
        return
    }
    var id = req.params.id
    var updateUser = await models.Appointment.update({
        datetime: datetime,
        isHome: isHome,
        note: note,
        total: total,
        serviceId,
        workerId,
        addressId
    }, {
        where: {
            id
        }
    })
    response.data = (updateUser)
    response.messages.push('done')
    res.send(response)
}

const schedule = async (req, res, next) => {
    var result = {
        success: true,
        messages: [],
        data: {}
    }
    const date = req.body.date
    const serviceId = req.params.id
    if(!serviceId) return res.send({
        success: false,
        messages: ["plese define the service"],
        data: {}
    })
    const nextDayDate = dayjs(date).add(1, 'day').format('YYYY-MM-DD')
    console.log(nextDayDate)
    var workingTimes = [
        {
            start: '09:00:00',
            end: '09:30:00',
            available: true
        },
        {
            start: '09:30:00',
            end: '10:00:00',
            available: true
        },
        {
            start: '10:00:00',
            end: '10:30:00',
            available: true
        },
        {
            start: '10:30:00',
            end: '11:00:00',
            available: true
        },
        {
            start: '11:00:00',
            end: '11:30:00',
            available: true
        },
        {
            start: '11:30:00',
            end: '12:00:00',
            available: true
        },
        {
            start: '12:00:00',
            end: '12:30:00',
            available: true
        },
        {
            start: '12:30:00',
            end: '13:00:00',
            available: true
        },
        {
            start: '13:00:00',
            end: '13:30:00',
            available: false
        },
        {
            start: '13:30:00',
            end: '14:00:00',
            available: false
        },
        {
            start: '14:00:00',
            end: '14:30:00',
            available: true
        },
        {
            start: '14:30:00',
            end: '15:00:00',
            available: true
        },
        {
            start: '15:00:00',
            end: '15:30:00',
            available: true
        },
        {
            start: '15:30:00',
            end: '16:00:00',
            available: true
        },
        {
            start: '16:00:00',
            end: '16:30:00',
            available: true
        },
        {
            start: '16:30:00',
            end: '17:00:00',
            available: true
        },
    ]
    // 2022-11-11
    // > 2022-11-11 00:00:00
    // < 2022-11-12 00:00:00
    const appointments = await models.Appointment.findAll({
        where: {
            serviceId,
            datetime: {
                [Op.gte]: `${date} 00:00:00`,
                [Op.lte]: `${nextDayDate} 00:00:00`
            }
        }
    })
    for (var i = 0; i < appointments.length; i++) {
        const dbtime = dayjs(appointments[i].datetime).format('HH:mm:ss')
        const service = await models.Service.findByPk(appointments[i].serviceId)
        const appTime = service.time / 30 // 1 || 2 || 3
        const timeIndex = findWorkingIndex(dbtime, workingTimes)
        if (timeIndex != null) {
            for (var j = timeIndex; j < (timeIndex + appTime); j++) {
                workingTimes[j].available = false
            }
        }
    }
    result.data = workingTimes
    res.send(result)
}

function findWorkingIndex(time, workingTimes) // 10:00:00
{
    for (var i = 0; i < workingTimes.length; i++) {
        if (workingTimes[i].start == time) {
            return i
        }
    }
    return null
}

module.exports = {
    store,
    index,
    show,
    update,
    destroy,
    schedule
}