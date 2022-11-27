'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Service.hasMany(models.Appointment, {
        foreignKey: 'serviceId'
      })
      Service.belongsToMany(models.Worker, {
        foreignKey: 'serviceId',
         through: 'Specialists'
      })
    }
  }
  Service.init({
    title: DataTypes.STRING,
    price: DataTypes.INTEGER,
    time: DataTypes.INTEGER,
    description: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Service',
  });
  return Service;
};