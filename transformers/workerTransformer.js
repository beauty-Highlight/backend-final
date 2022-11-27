const workerTransformer = (worker) => {
    if (worker?.dataValues?.password) {
        delete worker.dataValues.password
    }
    //   delete worker ["dataValues"]["createdAt"]
    //   delete worker ["dataValues"]["updatedAt"]

    worker.image = `${process.env.API_URL + "/uploads/" + worker.image}`;


    return worker
}
var workersTransformer = function(workers) {
    return workers.map(worker => workerTransformer(worker))
}

module.exports = {
    workerTransformer,
    workersTransformer
}