'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Specialist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      Specialist.belongsTo(models.Worker, {
        foreignKey: 'workerId'
      })
      Specialist.belongsTo(models.Service, {
        foreignKey: 'serviceId'
      })
    }
  }
  Specialist.init({
    serviceId: DataTypes.INTEGER,
    workerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Specialist',
  });
  return Specialist;
};