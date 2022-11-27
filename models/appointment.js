'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
    static associate(models) {
      Appointment.belongsTo(models.Service, {
        foreignKey: 'serviceId'
      })
      Appointment.belongsTo(models.Worker, {
        foreignKey: 'workerId'
      })
      Appointment.belongsTo(models.Customer, {
        foreignKey: 'customerId'
      })
      Appointment.belongsTo(models.Address, {
        foreignKey: 'addressId'
      })
    }
  }
  Appointment.init({
    serviceId: DataTypes.INTEGER,
    workerId: DataTypes.INTEGER,
    customerId: DataTypes.INTEGER,
    datetime: DataTypes.DATE,
    isHome: DataTypes.BOOLEAN,
    addressId: DataTypes.INTEGER,
    note: DataTypes.STRING,
    total: DataTypes.INTEGER,
    canceledAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Appointment',
    paranoid: true,
    deletedAt: 'canceledAt'
  });
  return Appointment;
};