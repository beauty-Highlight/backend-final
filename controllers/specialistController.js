const models = require("../models");
const {Op} = require("sequelize")
var store = async function (req, res, next) {
  var result = {
    success: true,
    messages: [],
    data: {},
  };
  var serviceId = req?.body?.serviceId;
  var workerId = req?.body?.workerId;

  if (serviceId?.length < 1) {
    result.success = false;
    result.messages.push("Please check  Service Datsa");
    return res.send(result);
  }
  var checkService = await models.Service.findOne({
    where: {
      id: serviceId,
    },
  });
  console.log("checkService", checkService);
  if (!checkService) {
    result.success = false;
    result.messages.push(" service not found, Please check the service");
    return res.send(result);
  }

  if (workerId?.length < 1) {
    result.success = false;
    result.messages.push("Please check  worker Data");
    return res.send(result);
  }
  var checkWorker = await models.Worker.findOne({
    where: {
      id: workerId,
    },
  });
  if (!checkWorker) {
    result.success = false;
    result.messages.push(" Worker not found, Please check the Worker Data ");
    return res.send(result);
  }

  if (!result.success) {
    res.send(response);
    return;
  }

  var [specialistsData, created] = await models.Specialist.findOrCreate({
    where: {
      workerId,
      serviceId,
    },
    defaults: {
      workerId,
      serviceId,
    },
  });
  if (!created) {
    result.success = false;
    result.messages.push(" This Data Already Exists ");
    return res.send(result);
  }
  result.data = specialistsData;
  result.messages.push("Created Succefully");
  return res.send(result);
};
var index = async function (req, res, next) {
  var result = {
    success: true,
    data: {},
    messages: [],
  };

  var specialists = await models.Specialist.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: models.Worker,
        attributes: ["name", "image"],
      },
      {
        model: models.Service,
        attributes: ["title"],
      },
    ],
  });
  console.log("specialists Data :", specialists);
  if (specialists) {
    result.data = specialists;
  } else {
    res.status(404);
    result.success = false;
    result.messages.push(
      "there is no serves with this ID ,Please provide a valid ID"
    );
  }
  res.send(result);
};

var showByServiceId = async function (req, res, next) {
  var result = {
    success: true,
    data: {},
    messages: [],
  };

  var serviceId = req?.params?.id;

  if (serviceId?.length < 1) {
    result.success = false;
    result.messages.push("Please check  Service Datsa");
    return res.send(result);
  }

  console.log("Service Id :", serviceId);

  var services = await models.Specialist.findAll({
    where: {
      serviceId,
    },
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: models.Worker,
        where: {
            deletedAt: {[Op.eq]: null}
        },
        attributes: ["id", "name", "image"],
      },
    ],
  });
  if (services) {
    result.data = services;
  } else {
    res.status(404);
    result.success = false;
    result.messages.push(
      "there is no serves with this ID ,Please provide a valid ID"
    );
  }
  res.send(result);
};

var showByWorkerId = async function (req, res, next) {
  var result = {
    success: true,
    data: {},
    messages: [],
  };

  var workerId = req?.params?.id;

  if (workerId?.length < 1) {
    result.success = false;
    result.messages.push("Please check  Worker Data");
    return res.send(result);
  }

  console.log("Worker Id :", workerId);

  var workers = await models.Specialist.findAll({
    where: {
      workerId,
    },
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: models.Service,
        attributes: ["title"],
      },
    ],
  });
  console.log("Workers Data :", workers);
  if (workers) {
    result.data = workers;
  } else {
    res.status(404);
    result.success = false;
    result.messages.push(
      "there is no serves with this ID ,Please provide a valid ID"
    );
  }
  res.send(result);
};

var destroy = async function (req, res, next) {
  var result = {
    success: true,
    data: {},
    messages: [],
  };
  var id = req?.params?.id;
  var deleted = await models.Specialist.destroy({
    where: {
      id,
    },
  });
  if (deleted) {
    res.status(200);
    result.messages.push("Specialist has been deleted ");
  } else {
    res.status(404);
    result.success = false;
    result.messages.push("Please provide a valid ID");
  }
  res.send(result);
};

module.exports = {
  store,
  index,
  showByServiceId,
  showByWorkerId,
  destroy,
};
