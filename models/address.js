'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Address.belongsTo(models.Customer, {
        foreignKey: 'customerId'
      })
      Address.hasMany(models.Appointment, {
        foreignKey: 'addressId'
      })
    }
  }
  Address.init({
    customerId: DataTypes.INTEGER,
    city: DataTypes.STRING,
    street: DataTypes.STRING,
    building: DataTypes.STRING,
    apartment: DataTypes.STRING,
    phone: DataTypes.STRING,
    note: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Address',
  });
  return Address;
};