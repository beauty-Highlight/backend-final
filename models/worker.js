'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Worker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Worker.hasMany(models.Appointment, {
        foreignKey: 'workerId'
      })
      Worker.belongsToMany(models.Service, {
        foreignKey: 'workerId',
        through: 'Specialists'
      })
    }
  }
  Worker.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Worker',
    paranoid: true
  });
  return Worker;
};