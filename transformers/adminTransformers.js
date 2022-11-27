const adminTransformer = (admin) => {
    if (admin?.dataValues?.password) {
        delete admin.dataValues.password
    }

     delete admin ["dataValues"]["createdAt"]
     delete admin ["dataValues"]["updatedAt"]
    
    return admin
}
var adminsTransformer = function(admins) {
    return admins.map(admin => adminTransformer(admin))
}

module.exports = {
    adminTransformer,
    adminsTransformer
}